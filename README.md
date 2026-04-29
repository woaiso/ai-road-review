# AI 演进之路 · 演示工程

> 基于源博客 [`docs/AI演进之路：从生成式AI到Agentic_AI.md`](./docs/AI演进之路：从生成式AI到Agentic_AI.md)，  
> 用 React + Vite + Framer Motion 实现的 30 分钟 / 22 页交互式演示。

## ✨ 特性

- **每一页是一个 React 组件**：天然组件化，可以被任意编辑、改造、复用
- **自定义 Deck 引擎**：键盘控制、URL hash 路由、章节配色、概览模式、跳页命令面板
- **Fragment 分步揭示**：每页可以分多个 step 渐次显示，与 Reveal.js 等价
- **品牌色彩**：基于 Anthropic 设计语言（奶油底 + 暖橙、雾蓝、苔绿点缀）
- **shadcn/ui 原子组件**：Dialog / Tabs / Tooltip / Command Palette 等开箱即用
- **打印导出 PDF**：浏览器 `Cmd+P` 直接导出 16:9 横版
- **响应式缩放**：1920×1080 设计画布，自动等比缩放到任意视口

## 🚀 快速开始

```bash
# 1. 安装依赖
pnpm install --ignore-workspace

# 2. 启动开发服务器
pnpm dev
# → http://localhost:5173

# 3. 生产构建
pnpm build && pnpm preview
```

## ⌨️ 演讲快捷键

| 键位 | 作用 |
| --- | --- |
| `→` `Space` `Enter` | 下一步 / 下一页 |
| `←` `Backspace` | 上一步 / 上一页 |
| `Home` `End` | 首页 / 末页 |
| `Esc` | 进入 / 退出概览模式 |
| `G` | 打开跳页命令面板（按章节搜索） |
| `F` | 切换全屏 |
| `?` | 显示帮助弹窗 |

URL hash 形如 `#/4/2`：第 4 页（1-based）的第 2 步，刷新页面会自动恢复位置。

## 📁 目录结构

```
src/
├── App.tsx                # 入口，挂载 Deck
├── main.tsx               # React 根
├── styles/globals.css     # Tailwind + 主题变量 + 打印样式
├── lib/
│   ├── utils.ts           # cn（clsx + tailwind-merge）工具函数
│   ├── theme.ts           # palette / chapterColor 颜色体系
│   └── motion.ts          # 通用动效配置
├── components/
│   ├── ui/                # shadcn/ui 原子组件（button, dialog, tabs, tooltip 等）
│   ├── Reveal.tsx         # Fragment 分步揭示包装
│   ├── Callout.tsx        # 引用 / 提示 / 洞察色块
│   ├── KeyTerm.tsx        # 关键术语高亮
│   ├── StatCard.tsx       # 数字卡
│   ├── CodeBlock.tsx      # 终端风格代码块
│   └── SectionGrid.tsx    # N 列布局
├── visualizations/        # 自定义 SVG 动画组件
│   ├── AITower.tsx        # 智能大厦逐层点亮
│   ├── Timeline.tsx       # 范式跃迁时间线
│   ├── AttentionMatrix.tsx# Self-Attention 注意力连线
│   ├── RagFlow.tsx        # RAG 流程动画
│   ├── AgentLoop.tsx      # Agent 三要素环
│   ├── MCPHub.tsx         # MCP 中心化路由
│   └── ContextWindowBar.tsx # 上下文窗口对比条
├── deck/                  # PPT 引擎
│   ├── Deck.tsx           # 顶层容器：状态、布局、缩放
│   ├── Slide.tsx          # 单页基础容器（eyebrow / title / 内容 / 装饰）
│   ├── DeckContext.tsx    # Context + useDeck hook
│   ├── usePresenterStep.ts# 页内分步 hook
│   ├── useHashRoute.ts    # URL hash 双向同步
│   ├── useKeyBindings.ts  # 全局快捷键
│   ├── ProgressBar.tsx    # 顶部进度条
│   ├── PageIndicator.tsx  # 右下页码 + 章节标
│   ├── Overview.tsx       # Esc 概览缩略图
│   ├── JumpPalette.tsx    # G 跳页命令面板
│   ├── HelpDialog.tsx     # ? 帮助弹窗
│   └── types.ts           # SlideMeta / DeckState / DeckActions 类型
└── slides/                # 22 张已注册幻灯片，每张一个组件
    ├── 01-Cover.tsx
    ├── 01-Preface.tsx
    ├── 02-Ch1-1-EvolutionMap.tsx
    ├── ...
    ├── 48-Postscript.tsx
    └── index.ts           # 注册中心：在这里调整顺序、增删页面
```

> **注意**：`slides/` 目录下存在部分尚未注册到 `index.ts` 的组件文件（如 `12-Ch5-2-CoTWorkflow.tsx` 等），属于草稿状态，不参与正式演示流程。

## 🧱 编写一张新幻灯片

1. 在 `src/slides/` 下新建 `XX-MyPage.tsx`
2. 用 `<Slide>` 容器 + 可选 `usePresenterStep(N)` 实现分步揭示
3. 在 `src/slides/index.ts` 注册一行 `SlideMeta`

```tsx
import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { usePresenterStep } from "@/deck/usePresenterStep";

export default function MyPage() {
  const step = usePresenterStep(3);
  return (
    <Slide eyebrow="第 X 章 · 小标题" title="主题句：意象与说明">
      <Reveal show={step >= 1}>第 1 步内容</Reveal>
      <Reveal show={step >= 2}>第 2 步内容</Reveal>
      <Reveal show={step >= 3}>第 3 步内容</Reveal>
    </Slide>
  );
}
```

在 `src/slides/index.ts` 添加注册项：

```ts
{ id: "my-page", title: "主题句：意象与说明", chapter: "第X章", steps: 3, component: MyPage }
```

## 📋 当前幻灯片列表

| 页码 | ID | 章节 | 标题 |
|------|-----|------|------|
| 1 | cover | 序 | 封面 |
| 2 | preface | 序 | 银行客服三十年：从「按 1 按 2」到「替你办完」 |
| 3 | ch1-1 | 第一章 | 智能大厦：技术栈的层叠地图 |
| 4 | ch1-2 | 第一章 | 拐点已至：为什么说「范式跃迁」发生在此刻 |
| 5 | ch2-1 | 第二章 | 续写引擎：一个会预测下一句的概率模型 |
| 6 | ch2-2 | 第二章 | Token：把语言切成可计算的积木 |
| 7 | ch2-3 | 第二章 | 自注意力机制：模型如何动态聚焦一句话 |
| 8 | ch3-1 | 第三章 | 上下文窗口：模型的「工作台」 |
| 9 | ch3-2 | 第三章 | Lost in the Middle：中间信息为何更容易「消失」 |
| 10 | ch4-1 | 第四章 | 一句话讲透 Prompt：清晰指令，稳定结果 |
| 11 | ch5-1 | 第五章 | 从快思考到慢思考：何时更准、何时更贵 |
| 12 | ch6-1 | 第六章 | 知识边界与 RAG：先查文档，再组织回答 |
| 13 | ch7-1 | 第七章 | Tool / 工具：让模型从「说」变成「做」 |
| 14 | ch8-1 | 第八章 | 统一契约：从碎片化接入到协议化生态 |
| 15 | ch8-4 | 第八章 | 两条工程路线：快接入 vs 可治理（CLI vs MCP）|
| 16 | ch9-1 | 第九章 | 从 Generative AI 到 Agent 智能体：多步自主决策 |
| 17 | ch10-1 | 第十章 | Skill / 技能：把「做法」沉淀成可复制的流程标准 |
| 18 | ch10-5 | 第十章 | 分工边界：流程封装 × 能力接入 |
| 19 | ch11-1 | 第十一章 | Harness：约束智能体，放行业务结果 |
| 20 | ch12-1 | 第十二章 | Hermes 案例解剖：从方法论到工程落地 |
| 21 | ch13-1 | 第十三章 | 三个阶段 · 三个洞察 · 三条实践 |
| 22 | postscript | 尾声 | 写在最后：此刻，是分水岭 |

## 🖨️ 导出 PDF

1. 启动 `pnpm dev`，进入想要导出的页码（或直接首页）
2. 浏览器 `Cmd+P` / `Ctrl+P`
3. 纸张：横向 A4 / Letter，"背景图形" 勾选
4. 保存为 PDF

打印样式中已隐藏进度条 / 页码 / 提示等"演讲外壳"。

## 🎨 主题与配色

整体设计遵循 Anthropic Claude 品牌色谱与版式气质，强调 **可读、温润、前瞻性**（科技与未来感主要来自清晰结构、留白与克制动效，而非炫彩堆叠）。

设计语言取自 Anthropic Brand Guidelines：

- 主底色 `#faf9f5`（cream）
- 文字 `#141413`（ink）
- 主品牌橙 `#d97757`
- 辅助雾蓝 `#6a9bcc`、苔绿 `#788c5d`、暖灰 `#9b8770`

字体：标题 Poppins、正文 Lora、代码 JetBrains Mono（自动降级到中文系统字体）。

颜色体系定义在 `src/lib/theme.ts`（`palette` / `chapterColor`）和 `src/styles/globals.css`（CSS 变量）。**新增 UI 或图表请优先使用这两处的变量，避免散落硬编码 HEX。**

## 📚 内容来源

- 源文：[`docs/AI演进之路：从生成式AI到Agentic_AI.md`](./docs/AI演进之路：从生成式AI到Agentic_AI.md)（约 1 万字）
- 22 页对应该文 13 个章节，每章 1-3 页可视化重写
- 其他参考文档见 [`docs/`](./docs/) 目录
