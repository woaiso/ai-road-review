import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { Slide } from "@/deck/Slide";

/**
 * 封面页：暗色背景 + 主标题 + 动态 AI 科技感视觉
 *
 * 设计理念：
 *  - 满幅出血的深色背景，叠加多层渐变光晕
 *  - 前景 SVG 神经网络：节点呼吸、连线按波次流光，隐喻 AI 的「联结」与「演化」
 *  - 漂浮粒子 + 扫描线，营造 lidar / 算力场的科技氛围
 *  - 主标题渐变文字 + 光晕脉冲；副标题以「终端风格」分段进入
 *  - 底部引言保留；移除与全局导航重复的快捷键提示
 *  - 尊重 prefers-reduced-motion，降级为静态构图
 */
export default function Cover() {
  const reduceMotion = useReducedMotion();

  // 预生成神经网络节点坐标（viewBox: 1600 × 900）
  // 使用确定性数值（非随机）保证每次渲染一致，便于打印/截图
  const graph = useMemo(() => buildNeuralGraph(), []);

  return (
    <Slide
      dark
      className="!px-32"
      backdrop={
        <>
          {/* 基础渐变光晕：右上暖橙 + 左下冷蓝，形成「晨昏线」 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 78% 18%, rgba(217,119,87,0.28), transparent 60%), radial-gradient(ellipse 70% 55% at 12% 88%, rgba(106,155,204,0.22), transparent 58%), radial-gradient(ellipse 50% 40% at 50% 50%, rgba(217,119,87,0.05), transparent 70%)",
            }}
          />

          {/* 细密网格：提供空间尺度感，营造「数字画布」 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(250,249,245,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,245,0.6) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 85%)",
            }}
          />

          {/* 神经网络可视化：SVG 满幅绘制，节点呼吸、连线流光 */}
          <NeuralField graph={graph} reduceMotion={!!reduceMotion} />

          {/* 漂浮粒子：营造粒子场 */}
          {!reduceMotion && <Particles />}

          {/* 暗角渐晕：让中心主标题更聚焦 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 90% at 50% 55%, transparent 40%, rgba(10,10,9,0.55) 100%)",
            }}
          />
        </>
      }
    >
      <div className="relative flex h-full flex-col justify-between">
        {/* 顶部 eyebrow：品牌标记 + 年份 */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 font-display text-sm tracking-[0.4em] text-brand-orange"
        >
          <span className="h-px w-12 bg-brand-orange" />
          AI · TECH · WALKTHROUGH · 2026
          {/* 闪烁光点：表达「实时 / 在线」 */}
          <motion.span
            aria-hidden
            className="ml-3 inline-block h-2 w-2 rounded-full bg-brand-orange"
            style={{ boxShadow: "0 0 10px 2px rgba(217,119,87,0.8)" }}
            animate={reduceMotion ? undefined : { opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* 主内容区 */}
        <div className="flex flex-col gap-8">
          {/* 副标题（英文路径符号，形成流向感） */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-display text-[20px] tracking-[0.3em] text-cream/60 uppercase flex items-center gap-4"
          >
            <span>从 GenAI</span>
            <Arrow />
            <span>到 Agent</span>
            <Arrow />
            <span className="text-brand-orange/90">到 Agentic AI</span>
          </motion.div>

          {/* 主标题：渐变 + 光晕呼吸 */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative font-display font-semibold leading-[1.05]"
            style={{ fontSize: "120px" }}
          >
            {/* 文字后方的光晕（blur 层） */}
            {!reduceMotion && (
              <motion.span
                aria-hidden
                className="absolute inset-0 -z-10 select-none"
                style={{
                  color: "rgba(217,119,87,0.35)",
                  filter: "blur(40px)",
                }}
                animate={{ opacity: [0.55, 0.9, 0.55] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              >
                AI 演进之路
              </motion.span>
            )}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(100deg, #faf9f5 0%, #faf9f5 40%, #f4c9b6 55%, #d97757 75%, #d97757 100%)",
              }}
            >
              AI 演进之路
            </span>
          </motion.h1>

          {/* 正文副标题 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-serif text-[28px] leading-relaxed text-cream/75 max-w-[1300px]"
          >
            一场正在发生的范式革命 ——
            <span className="text-brand-orange">
              从生成式 AI 到 Agentic AI
            </span>
            ，写给所有人的技术全景导览。
          </motion.div>
        </div>

        {/* 底部：只保留引言，删除与全局导航重复的快捷键提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex items-end justify-between font-display text-[13px] text-cream/40"
        >
          {/* 左下：一组「系统状态」样式的小标签，强化科技感 */}
          <div className="flex items-center gap-4 tracking-widest uppercase">
            <StatusChip label="Neural Link" tone="orange" pulse={!reduceMotion} />
            <StatusChip label="Agent Ready" tone="blue" pulse={!reduceMotion} />
            <StatusChip label="Ctx · 1M" tone="dim" />
          </div>
          <div className="font-serif italic text-cream/45">
            "这是人类最后一次独自思考的时代。"
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

/* ============================================================
 * 子组件：方向箭头（带 hover 感的分隔符）
 * ============================================================ */
function Arrow() {
  return (
    <svg width="28" height="10" viewBox="0 0 28 10" className="text-brand-orange/70">
      <motion.path
        d="M 0 5 L 22 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <path
        d="M 18 1 L 24 5 L 18 9"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
 * 子组件：状态标签（左下角，模拟 HUD 系统状态）
 * ============================================================ */
function StatusChip({
  label,
  tone,
  pulse,
}: {
  label: string;
  tone: "orange" | "blue" | "dim";
  pulse?: boolean;
}) {
  const color =
    tone === "orange"
      ? "rgba(217,119,87,0.9)"
      : tone === "blue"
        ? "rgba(106,155,204,0.9)"
        : "rgba(250,249,245,0.35)";
  return (
    <div className="flex items-center gap-2">
      <motion.span
        aria-hidden
        className="inline-block h-[6px] w-[6px] rounded-full"
        style={{ background: color, boxShadow: `0 0 8px 1px ${color}` }}
        animate={pulse ? { opacity: [1, 0.3, 1] } : undefined}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span style={{ color }}>{label}</span>
    </div>
  );
}

/* ============================================================
 * 子组件：神经网络可视化
 *  - 节点按网格分布 + 抖动位移，避免死板
 *  - 连线按「波次」逐批淡入，模拟信号从左至右传导
 *  - 关键节点呼吸放大
 * ============================================================ */
interface Graph {
  nodes: Array<{ id: number; x: number; y: number; r: number; hub: boolean }>;
  edges: Array<{ from: number; to: number; delay: number }>;
}

function buildNeuralGraph(): Graph {
  // viewBox: 1600 × 900
  const cols = 7;
  const rows = 5;
  const marginX = 140;
  const marginY = 120;
  const stepX = (1600 - marginX * 2) / (cols - 1);
  const stepY = (900 - marginY * 2) / (rows - 1);

  // 使用确定性「伪随机」（基于索引的三角函数），避免 SSR hydration 抖动
  const jitter = (i: number, seed: number) =>
    (Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1;

  const nodes: Graph["nodes"] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const id = c * rows + r;
      const jx = (jitter(id, 1) - 0.5) * 60;
      const jy = (jitter(id, 2) - 0.5) * 60;
      const hub = (c === 2 && r === 2) || (c === 4 && r === 1) || (c === 5 && r === 3);
      nodes.push({
        id,
        x: marginX + c * stepX + jx,
        y: marginY + r * stepY + jy,
        r: hub ? 5.5 : 2.5 + Math.abs(jitter(id, 3)) * 1.5,
        hub,
      });
    }
  }

  // 连线：每个节点连到下一列的 1~2 个最近节点
  const edges: Graph["edges"] = [];
  for (const n of nodes) {
    const col = Math.floor((n.x - marginX + stepX / 2) / stepX);
    if (col >= cols - 1) continue;
    const candidates = nodes
      .filter((m) => Math.floor((m.x - marginX + stepX / 2) / stepX) === col + 1)
      .map((m) => ({ m, d: Math.hypot(m.x - n.x, m.y - n.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const { m } of candidates) {
      edges.push({
        from: n.id,
        to: m.id,
        delay: col * 0.25 + Math.abs(jitter(n.id + m.id, 5)) * 0.6,
      });
    }
  }

  return { nodes, edges };
}

function NeuralField({ graph, reduceMotion }: { graph: Graph; reduceMotion: boolean }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(106,155,204,0)" />
          <stop offset="40%" stopColor="rgba(106,155,204,0.35)" />
          <stop offset="60%" stopColor="rgba(217,119,87,0.55)" />
          <stop offset="100%" stopColor="rgba(217,119,87,0)" />
        </linearGradient>
        <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(217,119,87,0.9)" />
          <stop offset="60%" stopColor="rgba(217,119,87,0.25)" />
          <stop offset="100%" stopColor="rgba(217,119,87,0)" />
        </radialGradient>
      </defs>

      {/* 连线 */}
      <g>
        {graph.edges.map((e, i) => {
          const a = graph.nodes[e.from];
          const b = graph.nodes[e.to];
          if (!a || !b) return null;
          return (
            <motion.line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="url(#edge-grad)"
              strokeWidth={0.8}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                reduceMotion
                  ? { pathLength: 1, opacity: 0.35 }
                  : {
                      pathLength: [0, 1, 1],
                      opacity: [0, 0.55, 0.18],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : {
                      duration: 3.2,
                      delay: 0.6 + e.delay,
                      repeat: Infinity,
                      repeatDelay: 2.4,
                      ease: "easeInOut",
                    }
              }
            />
          );
        })}
      </g>

      {/* 节点 */}
      <g>
        {graph.nodes.map((n) => (
          <g key={n.id}>
            {n.hub && (
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={n.r * 6}
                fill="url(#hub-glow)"
                initial={{ opacity: 0 }}
                animate={
                  reduceMotion
                    ? { opacity: 0.4 }
                    : { opacity: [0.2, 0.7, 0.2], scale: [0.9, 1.1, 0.9] }
                }
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: n.id * 0.11,
                }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
            )}
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={n.hub ? "#f4c9b6" : "rgba(250,249,245,0.85)"}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={
                reduceMotion
                  ? { opacity: 0.6, scale: 1 }
                  : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.15, 0.9] }
              }
              transition={{
                duration: n.hub ? 2.6 : 3.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (n.id % 7) * 0.25,
              }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ============================================================
 * 子组件：漂浮粒子
 *  - 12 个粒子，随机上浮，循环
 *  - 使用确定性坐标，避免 SSR 抖动
 * ============================================================ */
function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const seed = i * 0.137;
      return {
        id: i,
        left: `${(seed * 100) % 100}%`,
        size: 2 + ((i * 7) % 5),
        duration: 8 + (i % 5) * 1.5,
        delay: (i * 0.6) % 5,
        tone: i % 3 === 0 ? "orange" : i % 3 === 1 ? "blue" : "cream",
      };
    });
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => {
        const color =
          p.tone === "orange"
            ? "rgba(217,119,87,0.7)"
            : p.tone === "blue"
              ? "rgba(106,155,204,0.6)"
              : "rgba(250,249,245,0.55)";
        return (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              bottom: "-4%",
              width: p.size,
              height: p.size,
              background: color,
              boxShadow: `0 0 ${p.size * 3}px ${color}`,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [-0, -(600 + (p.id % 5) * 120)],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
              times: [0, 0.1, 0.85, 1],
            }}
          />
        );
      })}
    </div>
  );
}
