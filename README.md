# AI 演进之路 · 演示工程

> 基于源博客 `blogs/AI演进之路：从生成式AI到Agentic_AI.md`，
> 用 React + Vite + Framer Motion 实现的 30 分钟 / 28 页交互式演示。

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
# 1. 安装依赖（必须加 --ignore-workspace，因为本目录在 monorepo 之外）
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
├── lib/                   # cn / clamp / palette / motion 通用工具
├── components/
│   ├── ui/                # shadcn/ui 原子组件
│   ├── Reveal.tsx         # Fragment 包装
│   ├── Callout.tsx        # 引用 / 提示 / 洞察色块
│   ├── KeyTerm.tsx        # 关键术语高亮
│   ├── StatCard.tsx       # 数字卡
│   ├── CodeBlock.tsx      # 终端风格代码块
│   └── SectionGrid.tsx    # N 列布局
├── visualizations/        # 自定义 SVG 动画
│   ├── AITower.tsx        # 智能大厦逐层点亮
│   ├── Timeline.tsx       # 范式跃迁时间线
│   ├── AttentionMatrix.tsx# Self-Attention 注意力连线
│   ├── RagFlow.tsx        # RAG 6 步流程
│   ├── AgentLoop.tsx      # Agent 三要素环
│   ├── MCPHub.tsx         # MCP 中心化路由
│   └── ContextWindowBar.tsx # 上下文窗口对比条
├── deck/                  # PPT 引擎
│   ├── Deck.tsx           # 顶层容器：状态、布局、缩放
│   ├── Slide.tsx          # 单页基础容器（标题 / 内容 / 装饰）
│   ├── DeckContext.tsx    # Context + useDeck
│   ├── usePresenterStep.ts# 页内分步 hook
│   ├── useHashRoute.ts    # URL hash 双向同步
│   ├── useKeyBindings.ts  # 全局快捷键
│   ├── ProgressBar.tsx    # 顶部进度条
│   ├── PageIndicator.tsx  # 右下页码 + 章节标
│   ├── Overview.tsx       # Esc 概览缩略图
│   ├── JumpPalette.tsx    # G 跳页命令面板
│   ├── HelpDialog.tsx     # ? 帮助弹窗
│   └── types.ts           # SlideMeta / DeckState / DeckActions
└── slides/                # 28 张幻灯片，每张一个组件
    ├── 01-Cover.tsx
    ├── 02-Agenda.tsx
    ├── ...
    ├── 28-Finale.tsx
    └── index.ts           # 注册中心：在这里调整顺序、增删页面
```

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
    <Slide eyebrow="第 X 章" title="标题">
      <Reveal show={step >= 1}>第 1 步内容</Reveal>
      <Reveal show={step >= 2}>第 2 步内容</Reveal>
      <Reveal show={step >= 3}>第 3 步内容</Reveal>
    </Slide>
  );
}
```

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

## 📚 内容来源

- 源文：`blogs/AI演进之路：从生成式AI到Agentic_AI.md`（约 1 万字）
- 28 页对应该文 12 个章节，每章 1-3 页可视化重写
