# AGENTS.md — ai-road-review

> React + Vite **独立幻灯片工程**，位于仓库根目录。
>
> 内容入口：
>
> - [`./README.md`](./README.md)（工程结构、开发命令、快捷键）
> - 讲稿正文与编排依据：[《AI 演进之路：从生成式 AI 到 Agentic AI》](./docs/AI演进之路：从生成式AI到Agentic_AI.md)
> - 参考文档目录：[`./docs/`](./docs/)

## 设计与视觉规范

1. **品牌与配色**：整体界面按 **Anthropic Claude** 设计语言实现——奶油底 (`cream`)、墨色正文 (`ink`)、品牌橙作强调、雾蓝 / 苔绿 / 暖灰作辅助，可读、温润且偏「人文科技」，避免高饱和霓虹或杂乱渐变。
2. **气质**：追求 **前瞻性、科技与可信**——大留白与清晰排版为主，动效（Framer Motion）宜短、顺滑、有意义，少用炫技式闪烁。
3. **实现落点**：新增 UI、图表色或 SVG **不要散落硬编码 HEX**；优先使用 [`src/styles/globals.css`](./src/styles/globals.css) 中与 shadcn 对齐的 CSS 变量（浅色 / `.dark` 章节页）、[`src/lib/theme.ts`](./src/lib/theme.ts) 的 `palette` 与 `chapterColor`，以及与 Tailwind token 一致的类名。（README「主题与配色」中的十六进制为该体系的参考快照。）

## 幻灯片标题规范

每页 `<Slide>` 使用**两行标题**（见 [`src/deck/Slide.tsx`](./src/deck/Slide.tsx)）：

1. **`eyebrow`（章节行）**：`第X章 · 小标题`，**不要**写 `1.1`、`5.2` 等小节序号。序章可用 `序篇 · …`，尾声可用 `尾声 · …`。
2. **`title`（主标题）**：一句概括本页视觉焦点的「主题句」，风格类似 **「智能大厦：技术栈的层叠地图」**（可用冒号连接意象与说明）。

新增或改名页面时，请同步把 [`src/slides/index.ts`](./src/slides/index.ts) 里对应条目的 **`title`** 设为与主标题一致的**纯文字**（供右下页脚与「G」跳页面板搜索）。

## 执行命令与工作目录

项目位于**仓库根目录**，直接在根目录运行即可：

```bash
pnpm install --ignore-workspace   # 首次安装依赖
pnpm dev                          # 启动开发服务器
pnpm build                        # 生产构建
pnpm preview                      # 预览构建产物
```

> 若系统同时有 npm，也可直接使用 `npm run dev` / `npm run build`（package.json scripts 已对齐）。

## 最小改动约定

1. **新增/调整页面时**：同步维护 [`src/slides/index.ts`](./src/slides/index.ts) 的注册顺序与元数据（`id`、`title`、`chapter`、`steps`、`dark`）。
2. **优先复用基础组件**：页面容器使用 `deck/Slide`，分步揭示优先 `deck/usePresenterStep` + `components/Reveal`。
3. **保持演示一致性**：改动后至少本地验证 `pnpm dev` 可运行、键盘翻页与 `#/页码/步骤` hash 路由正常。
4. **导出兼容**：避免破坏打印样式（PDF 导出依赖 `src/styles/globals.css` 的 print 规则）。

## 协作补充要求（通用）

1. **每次改完必须构建**：完成任意代码改动后，必须执行一次 `pnpm build` 并确认通过，再反馈结果。
2. **内容对齐源文**：章节页内容默认以 [`docs/AI演进之路：从生成式AI到Agentic_AI.md`](./docs/AI演进之路：从生成式AI到Agentic_AI.md) 为准；若用户要求"完整包含"，应覆盖核心定义、步骤、对比、类比与过渡信息，不随意删减关键论点。
3. **大屏可读优先**：版式与字号按 PPT/投屏场景设计——标题与关键信息优先增大；避免信息块溢出；必要时通过分步展示、信息分层或摘要卡片解决拥挤，而不是把文字缩到难以阅读。
4. **动画服务表达**：动画用于解释机制与流程（如 token 逐步生成、状态流转），应明显但克制，重点突出"因果关系"和"步骤推进"，避免炫技式动效干扰讲述。
5. **页面文案克制**：默认不在页面上显式展示"伏笔"这类叙事标签；可保留自然过渡语义，但避免占用主叙事空间。
