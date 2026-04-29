# OpenClaw 与 Hermes Agent 技术研究报告

> 整理自 2026 年 4 月深度调研，涵盖系统架构、核心机制与技术实现对比
> 资料来源：官方文档、GitHub 源码分析、社区技术文章

---

## 目录

1. [背景概述](#1-背景概述)
2. [OpenClaw 系统架构](#2-openclaw-系统架构)
  - 2.1 [整体设计哲学](#21-整体设计哲学)
  - 2.2 [Gateway 协议层](#22-gateway-协议层)
  - 2.3 [Session 管理与上下文压缩](#23-session-管理与上下文压缩)
  - 2.4 [记忆体系与 Dreaming 机制](#24-记忆体系与-dreaming-机制)
  - 2.5 [Skill 系统](#25-skill-系统)
  - 2.6 [工具执行与沙箱](#26-工具执行与沙箱)
  - 2.7 [Task Brain 任务调度](#27-task-brain-任务调度)
3. [Hermes Agent 系统架构](#3-hermes-agent-系统架构)
  - 3.1 [整体设计哲学](#31-整体设计哲学)
  - 3.2 [三层架构拆解](#32-三层架构拆解)
  - 3.3 [AIAgent 核心循环](#33-aiagent-核心循环)
  - 3.4 [记忆体系四层设计](#34-记忆体系四层设计)
  - 3.5 [Skill 自动生成流水线](#35-skill-自动生成流水线)
  - 3.6 [工具与执行后端](#36-工具与执行后端)
  - 3.7 [RL 训练数据生成](#37-rl-训练数据生成)
4. [核心设计对比](#4-核心设计对比)
  - 4.1 [架构总览对比](#41-架构总览对比)
  - 4.2 [记忆保证性的根本差异](#42-记忆保证性的根本差异)
  - 4.3 [Skill 机制对比](#43-skill-机制对比)
  - 4.4 [安全模型对比](#44-安全模型对比)
  - 4.5 [生态与选型建议](#45-生态与选型建议)
5. [关键技术细节速查](#5-关键技术细节速查)

---

## 1. 背景概述


| 项目                    | 发布时间        | 作者 / 机构           | GitHub Stars（2026.04） | 开源协议 |
| --------------------- | ----------- | ----------------- | --------------------- | ---- |
| OpenClaw（前身 Clawdbot） | 2025 年 11 月 | Peter Steinberger | 250,000+              | MIT  |
| Hermes Agent          | 2026 年 2 月  | Nous Research     | 64,000+               | MIT  |


两个框架都是**自托管、本地优先**的个人 AI Agent 平台，支持 SKILL.md 开放标准，均以「替代云端 SaaS 助手、数据主权归用户」为核心价值主张。

Hermes 官方支持从 OpenClaw 一键迁移配置、记忆、Skill 和 API 密钥（`hermes claw migrate`），两者在生态上形成互补关系。

---

## 2. OpenClaw 系统架构

### 2.1 整体设计哲学

**Hub-and-spoke 架构**：把接口层（消息从哪来）与 Agent 运行时（智能和执行在哪发生）彻底分离。

设计理念来自创始人 Peter Steinberger 的四句话：

> **「一个优秀的 AI 助手必须能够倾听、思考、行动和记忆。」**

对应四层架构：

- 消息接入层 → **倾听**（Listen）
- Gateway 网关层 → **指挥**（Orchestrate）
- Agent 运行层 → **思考 + 行动**（Think & Act）
- 持久化层 → **记忆**（Remember）

核心工程决策：**会话串行化**。同一 session 的消息逐条处理，而非并发执行，防止工具冲突和状态损坏。

```
架构全景：

用户消息（WhatsApp / Telegram / Slack / 50+ 平台）
         ↓  Channel Adapters（统一规范化）
┌─────────────────────────────────────────┐
│  Gateway（ws://127.0.0.1:18789）        │
│  Command Queue → Session Router          │
│  Device Pairing → Task Brain            │
└───────────────────┬─────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Agent Runtime（Agentic Loop）          │
│  Context Assembly → Model Router        │
│  Skill Engine → Plugin System           │
└───────────────────┬─────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Tool Backends（Docker 沙箱隔离）       │
│  文件系统 / 浏览器 / Canvas / MCP       │
└─────────────────────────────────────────┘
```

### 2.2 Gateway 协议层

#### 协议基础

- **传输**：WebSocket，文本帧，JSON payload
- **协议版本**：v3（`PROTOCOL_VERSION = 3`），版本协商通过 `minProtocol / maxProtocol` 实现，不兼容则拒绝连接
- **默认端口**：`127.0.0.1:18789`

#### 三种帧类型

```jsonc
// 请求帧（客户端 → 服务端）
{ "type": "req", "id": "...", "method": "chat.send", "params": {...} }

// 响应帧（服务端 → 客户端）
{ "type": "res", "id": "...", "ok": true, "payload": {...} }

// 事件帧（服务端主动广播）
{ "type": "event", "event": "agent.update", "payload": {...}, "seq": 42 }
```

#### 握手与认证

第一帧必须是 `connect` 请求，包含：

- `role`：`operator`（CLI/UI/自动化）或 `node`（macOS/iOS/Android 节点）
- `scopes`：权限范围声明
- `device`：设备身份（公钥指纹 + 挑战签名）
- `caps` / `commands`：节点能力声明（仅 node 角色）

```jsonc
// iOS 节点握手示例
{
  "type": "req", "method": "connect",
  "params": {
    "minProtocol": 3, "maxProtocol": 3,
    "role": "node",
    "caps": ["camera", "canvas", "screen", "location", "voice"],
    "commands": ["camera.snap", "canvas.navigate", "screen.record", "location.get"],
    "permissions": { "camera.capture": true, "screen.record": false },
    "auth": { "token": "..." },
    "device": {
      "id": "device_fingerprint",
      "publicKey": "...",
      "signature": "...",    // 对 nonce 的签名
      "nonce": "..."
    }
  }
}
```

#### 安全策略

- **挑战-签名机制**：Gateway 先下发 nonce，客户端用设备密钥签名，绑定 `platform + deviceFamily` 元数据
- **设备配对**：新设备 ID 需要明确审批，本地 loopback 可自动审批
- **幂等性 key**：所有副作用方法（send、agent）必须携带，服务端维护短期去重缓存
- **速率限制**：控制面写方法每个客户端每 60 秒最多 3 次（含 retryAfterMs 提示）
- **权限分级**：`operator.admin` 范围才能跨设备管理，非 admin 只能操作自己的设备

#### Gateway 暴露的 RPC 方法体系（100+）


| 方法族              | 功能               |
| ---------------- | ---------------- |
| `chat.`*         | 发送消息、流式输出        |
| `agent.`*        | Agent 调度、身份查询、等待 |
| `sessions.`*     | 会话列表、订阅、预览、解析    |
| `agents.files.`* | 工作区引导文件读写        |
| `device.token.`* | token 轮换、吊销      |
| `config.`*       | 配置应用、补丁更新        |
| `nodes.*`        | 节点管理             |


### 2.3 Session 管理与上下文压缩

#### Session 标识与存储

- 会话以唯一 key 标识（格式如 `agent:main:whatsapp:dm:+123...`）
- 以 **JSONL** 格式持久化为对话记录文件
- 支持标签（label）解析，支持重置（reset）

#### 上下文压缩两阶段流程

当 session token 估算值接近 `contextWindow - reserveTokensFloor - softThresholdTokens` 时触发：

**阶段 1：预压缩记忆刷写（Memory Flush）**

```jsonc
// 配置示例
{
  "agents": {
    "defaults": {
      "compaction": {
        "reserveTokensFloor": 20000,
        "memoryFlush": {
          "enabled": true,
          "softThresholdTokens": 4000,
          "systemPrompt": "Session nearing compaction. Store durable memories now.",
          "prompt": "Write any lasting notes to memory/YYYY-MM-DD.md; reply with NO_REPLY if nothing to store."
        }
      }
    }
  }
}
```

- 对用户完全静默（prompt 包含 `NO_REPLY` 指令）
- 每次压缩周期只触发一次（状态记录在 sessions.json）
- 若工作区为只读沙箱，刷写跳过

**阶段 2：历史摘要压缩**

- 最近约 20,000 tokens 的消息保持原样，文件路径和 ID 被保留
- 更早的历史被 LLM 摘要为压缩版本

**注意**：压缩会使 Anthropic 提示缓存失效，下次请求需重新缓存，有额外成本。

### 2.4 记忆体系与 Dreaming 机制

#### 文件结构（所有记忆均为纯 Markdown）

```
~/.openclaw/workspace/
├── MEMORY.md          # 长期记忆：持久事实、偏好、决策（每次 DM session 加载）
├── SOUL.md            # Agent 人格定义
├── AGENTS.md          # Agent 行为规则
├── memory/
│   ├── YYYY-MM-DD.md  # 每日笔记（当天 + 昨天自动加载）
│   └── .dreams/       # Dreaming 系统工作区
│       └── session-corpus/
└── DREAMS.md          # Dream Diary（人工可审查的梦境日记）
```

关键约束：

- `MEMORY.md` 有 20,000 字符/文件上限，所有引导文件总上限 150,000 字符
- 超出上限的内容被截断，不会报错但会静默丢失

#### 记忆召回工具

- `memory_search`：语义搜索，基于向量索引，支持措辞不同的相关召回
- `memory_get`：精确读取指定文件或行范围，文件不存在时优雅降级（返回空而非报错）

#### Dreaming 三阶段记忆巩固系统

模拟人类睡眠记忆巩固机制，**默认禁用，需手动开启**（`/dreaming on` 或配置文件）：


| 阶段      | 名称              | 工作内容                                                      |
| ------- | --------------- | --------------------------------------------------------- |
| Phase 1 | Light Sleep（摄取） | 读取近期每日记忆文件，解析成片段块；摄取 session 记录进语料库；Jaccard 相似度去重（阈值 0.9） |
| Phase 2 | REM Sleep（反思）   | 分析 7 天内短期召回条目；提取反复出现的概念主题；识别「候选真理」                        |
| Phase 3 | Deep Sleep（晋升）  | 通过三重门槛才写入 MEMORY.md                                       |


**晋升三重门槛**：

- `minScore ≥ 0.8`
- `minRecallCount ≥ 3`（被召回次数）
- `minUniqueQueries ≥ 3`（不同查询词数）

**六维评分权重**：


| 信号                         | 权重   |
| -------------------------- | ---- |
| 相关度（Relevance）             | 0.30 |
| 频率（Frequency）              | 0.24 |
| 查询多样性（Query diversity）     | 0.15 |
| 时效性（Recency）               | 0.15 |
| 整合度（Consolidation）         | 0.10 |
| 概念丰富度（Conceptual richness） | 0.06 |


Dreaming 结果写入 `DREAMS.md` 供人工查阅，可通过 `openclaw memory rem-backfill --rollback` 回滚历史回放。

### 2.5 Skill 系统

OpenClaw 的 Skill 实现完整遵循 SKILL.md 开放标准（2025 年 12 月 Anthropic 正式发布）。

#### 发现路径（优先级从高到低）

```
工作区级别：.openclaw/skills/<skill-name>/SKILL.md
全局安装：  ~/.openclaw/skills/<skill-name>/SKILL.md
内置捆绑：  随 OpenClaw 本体安装
```

#### 关键实现细节

- **不会全量注入**：不把所有 Skill 的完整内容塞进系统提示，而是注入精简候选列表（名称 + 描述 + 路径）
- **模型主动决策**：LLM 读取候选列表后，主动判断哪个 Skill 相关，再按需读取完整内容
- **可附带脚本**：`scripts/` 目录中的可执行脚本可在任务执行中被调用，实现真实文件操作

**ClawHub** 是 OpenClaw 的 Skill 社区，公开 Skill 数量已超过 35 万个。

> ⚠️ 安全警告：Snyk 审计显示超过 36% 的公开 Skill 包含至少一个安全问题。像对待 npm 包一样对待第三方 Skill——安装前读内容，只信任可信来源。

### 2.6 工具执行与沙箱

- **Docker 容器隔离**：所有 shell 命令和文件操作在独立容器内执行
- **Canvas 独立进程**：可视化工作区运行在独立服务进程（默认端口 18793），与 Gateway 崩溃隔离
  - Agent 写入 HTML → Canvas 服务解析 A2UI 属性 → WebSocket 推送到浏览器 → 渲染交互界面
- **Tool 权限策略**：通过配置 `allow` 和 `deny` 列表控制 Tool 访问

#### Companion Node 的人工审批流

高风险工具操作可委托给「伴随节点」（macOS/iOS/Android 设备）进行人工审批（Human-in-the-Loop），审批通过后 Gateway 才继续执行。

### 2.7 Task Brain 任务调度

2026 年最重要的架构演进（2026 Q1 引入）。

**解决的问题**：此前四类独立执行实体（ACP、子 Agent、cron 任务、后台 CLI 进程）各有自己的生命周期，相互毫无感知，可能造成并发冲突。

**Task Brain 的设计**：将四类全部统一到 **SQLite 支撑的任务账本**，类比 Kubernetes 容器调度：

- 所有任务有统一的生命周期管理，含心跳监控和自动恢复
- 任务流注册表暴露 CLI 命令：`openclaw flows list` / `openclaw flows show` / `openclaw flows cancel`

---

## 3. Hermes Agent 系统架构

### 3.1 整体设计哲学

**「闭环学习」架构**：解决其他所有 Agent 框架都没解决的问题——让 Agent 自己创建和改进 Skill，用得越久越强。

核心设计原则：

> **「大多数 Agent 框架把 LLM 当执行引擎，把记忆当上下文注入。Session 结束，上下文清空，经验消失。Hermes 是围绕这个 gap 设计的。」**

标签：**「The agent that grows with you」**

### 3.2 三层架构拆解

```
Layer 1 — 接入层（Hermes Gateway）
  15+ 消息平台 → 统一接入 → 同一 Agent 跨平台保持持久状态

Layer 2 — 核心 Agent 层（AIAgent）
  Context Engine → Model Router → Tool Registry → Auxiliary LLM
  Skill Engine → Memory System → Scheduler

Layer 3 — 执行后端层（可插拔 Backends）
  Terminal（6种）/ Browser（5种）/ Web（4种）/ File / Vision / MCP
```

**关键设计决策**：执行层与智能层物理分离——Agent 的智能运行在一台机器，代码执行发生在另一台隔离容器里，支持安全敏感部署。

### 3.3 AIAgent 核心循环

核心实现文件：`run_agent.py`（约 10,700 行）

```
消息到达
  ↓
生成 task ID
  ↓
加载缓存的系统提示 或 重新构建（memory + skills + context files）
  ↓
预检压缩（确认历史未超限）
  ↓
API 调用（模型推理）
  ↓
[有工具调用？]
  ├── 是 → 执行工具 → 追加结果 → 回到 API 调用
  └── 否 → 生成最终响应 → 持久化 → 结束
```

#### 关键子模块


| 模块         | 文件                                   | 职责                                                                            |
| ---------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| Prompt 构建器 | `agent/prompt_builder.py`            | 组装：人格(SOUL.md) + 记忆(MEMORY/USER.md) + Skills + 工具指南 + 模型专用指令                  |
| 提示缓存       | `agent/prompt_caching.py`            | Anthropic 前缀缓存断点应用                                                            |
| 上下文压缩      | `agent/context_compressor.py`        | 中间对话轮次有损摘要                                                                    |
| 模型解析器      | `agent/anthropic_adapter.py` + 共享解析器 | 映射 `(provider, model)` → `(api_mode, api_key, base_url)`，处理 18+ 提供商、OAuth、凭据池 |
| 辅助 LLM     | `agent/auxiliary_client.py`          | 处理视觉分析、摘要等辅助任务，与主模型独立                                                         |


**Session 持久化**：`hermes_state.py`，SQLite + FTS5 全文搜索，检索延迟约 10ms（10,000+ 文档规模）。

### 3.4 记忆体系四层设计

#### Layer 1 — 冻结系统提示记忆（始终注入）

两个核心文件，**session 开始时注入，session 内不变**：

**MEMORY.md**（约 2200 字符上限）：

```markdown
用户的项目是位于 ~/code/myapi 的 Rust Web 服务，使用 Axum + SQLx §
此机器运行 Ubuntu 22.04，已安装 Docker 和 Podman §
不要为 Docker 使用 sudo——用户在 docker 组中 §
项目使用 tab 缩进，120 字符行宽，Google 风格注释 §
数据库于 2026-01-15 从 MySQL 迁移到 PostgreSQL §
```

（`§` 是 Hermes 约定的条目分隔符）

**USER.md**（约 1375 字符上限）：

```markdown
偏好简洁回答——无不必要的前言
前端用 TypeScript/React，后端用 Rust/Python
时区：UTC+2
紧急任务 ping Discord，日常更新用 Telegram
偏好用 Notion 做项目追踪
```

> 字符上限是刻意约束，防止系统提示膨胀影响模型性能和 API 成本。

#### Layer 2 — 情节记忆（Skills）

从任务经验自动创建的 Markdown Skill 文档，存储在 `~/.hermes/skills/`。详见 [3.5 节](#35-skill-自动生成流水线)。

#### Layer 3 — Session 搜索档案

SQLite FTS5 全文索引覆盖所有历史对话，Agent 通过显式调用 `session_search` 工具访问。

**重要设计原则**：「架构决定访问方式，而非 Agent 判断。」

- 提示记忆 → 始终在上下文中（被动）
- Session 档案 → 只在 Agent 显式调用时访问（主动）

这保持了系统提示短小且缓存稳定，同时支持历史深度召回。

#### Layer 4（可选扩展）


| 插件                   | 功能                          |
| -------------------- | --------------------------- |
| **Honcho**           | 跨会话用户建模，AI 原生记忆管理           |
| **PLUR**             | 社区 engram 插件，支持跨 Agent 经验传播 |
| Mem0、Hindsight 等 7 种 | 第三方记忆提供者（单选，只能激活一个）         |


### 3.5 Skill 自动生成流水线

这是 Hermes 最核心的差异化特性。

#### 触发条件

任务完成后，若本次执行涉及 **5 次以上工具调用**，且方法被评估为「非平凡」，则自动触发 Skill 生成。

#### 五步流水线

```
① 执行（Execute）
   完成一个复杂任务

② 评估（Evaluate）
   Agent 反思：这个方法是否值得提炼？
   判断依据：工具调用次数、步骤复杂度、结果质量

③ 提取（Extract）
   将推理过程提炼为结构化 Skill 文档：
   - 适用场景描述
   - 步骤序列
   - 已知陷阱和边界条件
   - 验证步骤

④ 精化（Refine）
   后续遇到相似任务时，对比新结果与已有 Skill
   若有矛盾或改进，自动修补 Skill 文档（patch）

⑤ 复用（Reuse）
   下次遇到相似任务，直接从 Skill 库检索应用
   渐进式披露：先读摘要，按需展开完整内容
```

#### 渐进式披露加载机制

Skills 不会一次性全量注入上下文：

1. Session 启动时：注入精简 Skill 候选列表（名称 + 描述）
2. 任务匹配时：读取目标 Skill 的摘要部分
3. 需要详细步骤时：展开完整 SKILL.md 内容

这与 OpenClaw 的实现原理相同，均遵循 SKILL.md 开放标准。

#### Skill 资产统计

- 内置：118 个（96 捆绑 + 22 可选），覆盖 26+ 类别
- 所有社区提交 Skill 经过安全扫描（检测数据外泄、提示注入、破坏性命令、供应链攻击）
- 遵循 **agentskills.io** 开放标准，跨兼容系统可移植

#### 成本代价

Skill 自我改进过程额外消耗 token 约 **15%～25%**（来自 NxCode 独立分析），预算敏感部署需考虑此项。

#### 性能收益

Nous Research 发布的基准数据：使用自创 Skill 的 Agent 完成研究类任务比全新实例**快 40%**。

### 3.6 工具与执行后端

#### 内置工具体系

- **总计**：47 个内置工具，19 个预设工具集（toolsets）


| 工具类别        | 后端数量 | 典型实现                                       |
| ----------- | ---- | ------------------------------------------ |
| Terminal    | 6 种  | 本地、SSH、Docker、Singularity/Apptainer、远程 GPU |
| Browser     | 5 种  | Browser Use 集成                             |
| Web/Search  | 4 种  | Brave、Tavily 等                             |
| File/Vision | —    | 文件操作、图像分析                                  |
| MCP         | 动态   | 支持任意 MCP Server 动态接入                       |


#### 多后端安全价值

执行后端与 Agent 智能层物理分离，允许：

- Agent 智能运行在一台机器（如低成本 VPS）
- 代码执行发生在另一台隔离容器或远程 GPU 机器
- SSH 后端可调用 NVIDIA DGX 等 HPC 设施而不直接暴露这些系统

#### 插件系统

三个发现源：

1. `~/.hermes/plugins/`（用户级）
2. `.hermes/plugins/`（项目级）
3. pip entry points（包安装级）

两种单选特化插件类型（同一时刻只能激活一个）：

- **记忆提供者**（`plugins/memory/`）
- **上下文引擎**（`plugins/context_engine/`）

### 3.7 RL 训练数据生成

这是 Hermes 独有的、面向 AI 研究社区的特性：

- `batch_runner.py`：批量轨迹生成
- 完整的 Atropos 集成框架，支持多种工具调用解析器
- 生成 **ShareGPT 格式**的轨迹数据集，可直接用于模型微调
- 支持多种评估环境（Environments）和基准测试（Benchmarks）

---

## 4. 核心设计对比

### 4.1 架构总览对比


| 对比维度     | OpenClaw               | Hermes Agent               |
| -------- | ---------------------- | -------------------------- |
| **核心隐喻** | Hub-and-spoke（通讯枢纽）    | Closed learning loop（学习飞轮） |
| **设计问题** | 如何让一个 Agent 接入所有渠道？    | 如何让 Agent 越用越强？            |
| **架构层数** | 四层（接入/网关/运行/持久）        | 三层（接入/智能/执行）               |
| **技术栈**  | TypeScript（Node.js）    | Python（~10,700 行核心）        |
| **配置语言** | JSON5                  | YAML                       |
| **主要存储** | JSONL 会话 + Markdown 记忆 | SQLite FTS5 + Markdown     |
| **平台支持** | 50+ 消息平台               | 15+ 消息平台                   |
| **版本节奏** | 每周多次发布（日期版本号）          | 每周 50+ PRs，v0.x 阶段         |


### 4.2 记忆保证性的根本差异

这是两个系统最本质的架构分歧：

**OpenClaw — 工具-提示驱动的记忆**

```
记忆行为 ← LLM 的启发式判断

风险链：
  用户说"记住这个" → Agent 决定是否写入 → 可能不写
  会话压缩时 → 预刷写 → 可能遗漏
  新会话召回 → Agent 决定是否调用 memory_search → 可能不调用
  → 结果：记忆丢失是「预期结果」，而非 Bug
```

**Hermes — 架构层保证的记忆**

```
记忆行为 ← 架构设计强制

系统保证：
  MEMORY.md → 每次 session 始终注入（无需 Agent 决策）
  FTS5 索引 → session_search 工具可显式调用
  Skill 生成 → 5次+工具调用后自动触发（无需提示）
  → 结果：记忆保证性更高，代价是更高 token 成本
```

**实践影响**：


| 场景        | OpenClaw 表现    | Hermes 表现  |
| --------- | -------------- | ---------- |
| 短期单次任务    | 优秀             | 优秀         |
| 跨天持续项目    | 可能遗忘细节         | 稳定保留关键信息   |
| 跨周工作流优化   | 需手动管理记忆        | 自动积累 Skill |
| 长达数月的固定任务 | 依赖 Dreaming 机制 | 闭环学习显著改善   |


### 4.3 Skill 机制对比


| 维度              | OpenClaw                    | Hermes Agent      |
| --------------- | --------------------------- | ----------------- |
| **来源**          | 手动定义 + 社区 ClawHub           | 自动生成 + 手动 + 社区    |
| **生成机制**        | 无自动生成                       | 5次+工具调用后自动触发      |
| **自我改进**        | 无                           | 使用中自动 patch       |
| **标准**          | SKILL.md（agentskills.io 兼容） | agentskills.io 标准 |
| **社区规模**        | 35万+ Skill（ClawHub）         | 118 内置 + 社区增长中    |
| **安全审计**        | 无官方扫描                       | 社区提交需过安全扫描器       |
| **加载方式**        | 渐进式披露（候选列表 → 按需全文）          | 渐进式披露（摘要 → 按需展开）  |
| **额外 token 成本** | 无                           | 约 +15%～25%        |


### 4.4 安全模型对比

**OpenClaw**：

- Docker 容器沙箱隔离执行
- 设备签名挑战认证（防伪造）
- 幂等性 key 防重复执行
- Canvas 独立进程隔离
- 人工审批流（Companion Node）

**Hermes Agent**：

- 执行后端与智能层物理分离
- 社区 Skill 安全扫描器（检测数据外泄、提示注入）
- Singularity/Apptainer 支持 HPC 合规环境
- SSH 后端避免直接暴露远程系统

**共同风险**：两者都存在第三方 Skill/Plugin 的提示注入风险。核心原则：**像审计 npm 包一样审计 Skill——安装前读内容，只信任可信来源。**

### 4.5 生态与选型建议


| 需求场景             | 推荐选择     | 理由                                       |
| ---------------- | -------- | ---------------------------------------- |
| 接入尽可能多的消息平台      | OpenClaw | 50+ vs 15+，生态更完整                         |
| 非技术用户，快速上手       | OpenClaw | 引导式安装，社区资源多                              |
| 固定重复任务的自动优化      | Hermes   | 闭环学习飞轮效果显著                               |
| 需要 RL 训练数据       | Hermes   | 内置 batch_runner 和 Atropos                |
| 跨多个 AI 工具团队      | 均可       | 双方都支持 SKILL.md 标准，Hermes 支持从 OpenClaw 迁移 |
| 已有 OpenClaw 配置迁移 | Hermes   | 官方 `hermes claw migrate` 命令              |
| 注重 24/7 在线稳定性    | OpenClaw | 成熟度更高，社区更大                               |
| 研究型 / 开发者导向      | Hermes   | 更深的技术控制，更高的可定制性                          |


---

## 5. 关键技术细节速查

### OpenClaw 常用 CLI

```bash
# 核心操作
openclaw gateway           # 前台启动 Gateway
openclaw onboard           # 引导式初始化
openclaw doctor            # 健康检查与修复
openclaw security audit    # 安全审计

# 记忆操作
openclaw memory status     # 查看记忆状态
openclaw memory status --deep  # 深度分析
openclaw memory promote --dry-run  # 预览 Dreaming 晋升结果
openclaw memory rem-backfill --path ./memory  # 历史笔记回放

# Dreaming
/dreaming on               # 会话内启用
/dreaming off              # 会话内禁用

# Session 操作
/compact                   # 手动触发压缩
/context list              # 查看当前上下文内容
/new                       # 重置 session

# ACP 桥接（IDE 集成）
openclaw acp               # 启动 ACP 桥
openclaw acp --session agent:main:main   # 指定 session
openclaw acp --reset-session             # 重置 session

# 流程管理（Task Brain）
openclaw flows list
openclaw flows show <id>
openclaw flows cancel <id>
```

### Hermes Agent 常用 CLI

```bash
# 安装与配置
hermes setup               # 引导式配置（自动检测 ~/.openclaw）
hermes model               # 切换模型
hermes plugins             # 管理插件

# OpenClaw 迁移
hermes claw migrate        # 交互式完整迁移
hermes claw migrate --dry-run  # 预览迁移内容
hermes claw migrate --preset user-data  # 仅迁移用户数据（不含密钥）
hermes claw migrate --overwrite         # 覆盖已有冲突

# Skill 管理
/skills                    # 会话内 Skill 管理
# 从 ClawHub / LobeHub / GitHub / skills.sh 安装 Skill
```

### 关键配置文件位置

**OpenClaw**：

```
~/.openclaw/openclaw.json          # 主配置（JSON5 格式）
~/.openclaw/workspace/MEMORY.md    # 长期记忆
~/.openclaw/workspace/SOUL.md      # Agent 人格
~/.openclaw/workspace/AGENTS.md    # 行为规则
~/.openclaw/workspace/memory/*.md  # 每日笔记
~/.openclaw/skills/                # 全局 Skill
.openclaw/skills/                  # 项目级 Skill
```

**Hermes Agent**：

```
~/.hermes/config.yaml              # 主配置
~/.hermes/MEMORY.md                # 长期记忆（~2200字符上限）
~/.hermes/USER.md                  # 用户画像（~1375字符上限）
~/.hermes/skills/                  # Skill 资产库
~/.hermes/plugins/                 # 用户级插件
.hermes/plugins/                   # 项目级插件
~/.hermes/sessions/                # SQLite 会话数据库
```

### 关键性能参数参考


| 参数                | OpenClaw                   | Hermes              |
| ----------------- | -------------------------- | ------------------- |
| 记忆文件单文件上限         | 20,000 字符                  | 2,200 字符（MEMORY.md） |
| 引导文件总上限           | 150,000 字符                 | —                   |
| FTS5 检索延迟         | —                          | ~10ms（10,000+ 文档）   |
| Skill 自动生成阈值      | —                          | 5次以上工具调用            |
| Skill 额外 token 成本 | 0                          | +15%～25%            |
| Dreaming 晋升门槛     | minScore 0.8 + 3次召回 + 3种查询 | —                   |
| 控制面 API 速率限制      | 3次/60秒/客户端                 | —                   |


---

*本文档基于 2026 年 4 月公开资料整理。两个框架均处于快速迭代期，建议定期参阅官方文档获取最新信息。*

**参考链接**：

- OpenClaw 官方文档：[https://docs.openclaw.ai](https://docs.openclaw.ai)
- OpenClaw GitHub：[https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)
- Hermes Agent 官方文档：[https://hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)
- Hermes Agent GitHub：[https://github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
- SKILL.md 标准：[https://agentskills.io](https://agentskills.io)
- MCP 协议规范：[https://modelcontextprotocol.io](https://modelcontextprotocol.io)

