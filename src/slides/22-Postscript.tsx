import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { usePresenterStep } from "@/deck/usePresenterStep";

/* ── 封面同款：神经网络图 ── */
interface Graph {
  nodes: Array<{ id: number; x: number; y: number; r: number; hub: boolean }>;
  edges: Array<{ from: number; to: number; delay: number }>;
}
function buildGraph(): Graph {
  const cols = 7, rows = 5, mX = 140, mY = 120;
  const sX = (1600 - mX * 2) / (cols - 1);
  const sY = (900 - mY * 2) / (rows - 1);
  const jitter = (i: number, s: number) => (Math.sin(i * 12.9898 + s * 78.233) * 43758.5453) % 1;
  const nodes: Graph["nodes"] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const id = c * rows + r;
      const hub = (c === 2 && r === 2) || (c === 4 && r === 1) || (c === 5 && r === 3);
      nodes.push({
        id,
        x: mX + c * sX + (jitter(id, 1) - 0.5) * 60,
        y: mY + r * sY + (jitter(id, 2) - 0.5) * 60,
        r: hub ? 5.5 : 2.5 + Math.abs(jitter(id, 3)) * 1.5,
        hub,
      });
    }
  }
  const edges: Graph["edges"] = [];
  for (const n of nodes) {
    const col = Math.floor((n.x - mX + sX / 2) / sX);
    if (col >= cols - 1) continue;
    nodes
      .filter((m) => Math.floor((m.x - mX + sX / 2) / sX) === col + 1)
      .map((m) => ({ m, d: Math.hypot(m.x - n.x, m.y - n.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach(({ m }) =>
        edges.push({ from: n.id, to: m.id, delay: col * 0.25 + Math.abs(jitter(n.id + m.id, 5)) * 0.6 })
      );
  }
  return { nodes, edges };
}

function NeuralBg({ graph, rm }: { graph: Graph; rm: boolean }) {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* 与封面完全一致的渐变定义 */}
        <linearGradient id="edge-grad-ps" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(106,155,204,0)" />
          <stop offset="40%"  stopColor="rgba(106,155,204,0.35)" />
          <stop offset="60%"  stopColor="rgba(217,119,87,0.55)" />
          <stop offset="100%" stopColor="rgba(217,119,87,0)" />
        </linearGradient>
        <radialGradient id="hub-glow-ps" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(217,119,87,0.9)" />
          <stop offset="60%"  stopColor="rgba(217,119,87,0.25)" />
          <stop offset="100%" stopColor="rgba(217,119,87,0)" />
        </radialGradient>
      </defs>

      {/* 连线 */}
      <g>
        {graph.edges.map((e, i) => {
          const a = graph.nodes[e.from], b = graph.nodes[e.to];
          if (!a || !b) return null;
          return (
            <motion.line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="url(#edge-grad-ps)" strokeWidth={0.8}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={rm ? { pathLength: 1, opacity: 0.35 } : { pathLength: [0, 1, 1], opacity: [0, 0.55, 0.18] }}
              transition={rm ? { duration: 0.01 } : { duration: 3.2, delay: 0.6 + e.delay, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
            />
          );
        })}
      </g>

      {/* 节点（与封面相同：hub 节点带光晕背景圈） */}
      <g>
        {graph.nodes.map((n) => (
          <g key={n.id}>
            {n.hub && (
              <motion.circle
                cx={n.x} cy={n.y} r={n.r * 6}
                fill="url(#hub-glow-ps)"
                initial={{ opacity: 0 }}
                animate={rm ? { opacity: 0.4 } : { opacity: [0.2, 0.7, 0.2], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: n.id * 0.11 }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
            )}
            <motion.circle
              cx={n.x} cy={n.y} r={n.r}
              fill={n.hub ? "#f4c9b6" : "rgba(250,249,245,0.85)"}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={rm ? { opacity: 0.6, scale: 1 } : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: n.hub ? 2.6 : 3.4, repeat: Infinity, ease: "easeInOut", delay: (n.id % 7) * 0.25 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

function Particles() {
  const list = useMemo(() =>
    Array.from({ length: 14 }).map((_, i) => {
      const s = i * 0.137;
      return { id: i, left: `${(s * 100) % 100}%`, size: 2 + ((i * 7) % 5), dur: 8 + (i % 5) * 1.5, delay: (i * 0.6) % 5, tone: i % 3 };
    }), []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {list.map((p) => {
        const c = p.tone === 0 ? "rgba(217,119,87,0.7)" : p.tone === 1 ? "rgba(106,155,204,0.6)" : "rgba(250,249,245,0.55)";
        return (
          <motion.span key={p.id} className="absolute rounded-full"
            style={{ left: p.left, bottom: "-4%", width: p.size, height: p.size, background: c, boxShadow: `0 0 ${p.size * 3}px ${c}` }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, -(600 + (p.id % 5) * 120)], opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear", times: [0, 0.1, 0.85, 1] }}
          />
        );
      })}
    </div>
  );
}

/* ── 四大支柱数据 ── */
const PILLARS = [
  { tech: "MCP",    label: "有标准", color: "#6a9bcc" },
  { tech: "Skill",  label: "有方法", color: "#d97757" },
  { tech: "Harness", label: "有运行时", color: "#788c5d" },
  { tech: "闭环学习", label: "有进化", color: "#9b6fbf" },
];

export default function Slide48Postscript() {
  const rm = !!useReducedMotion();
  const graph = useMemo(() => buildGraph(), []);
  const step = usePresenterStep(4);

  return (
    <Slide
      dark
      className="!px-32"
      backdrop={
        <>
          {/* 渐变光晕 */}
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 78% 18%, rgba(217,119,87,0.28), transparent 60%)",
              "radial-gradient(ellipse 70% 55% at 12% 88%, rgba(106,155,204,0.22), transparent 58%)",
              "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(217,119,87,0.05), transparent 70%)",
            ].join(","),
          }} />
          {/* 细密网格 */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: "linear-gradient(rgba(250,249,245,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,245,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 85%)",
          }} />
          {/* 神经网络 */}
          <NeuralBg graph={graph} rm={rm} />
          {/* 漂浮粒子 */}
          {!rm && <Particles />}
          {/* 暗角 */}
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{
            background: "radial-gradient(ellipse 120% 90% at 50% 55%, transparent 40%, rgba(10,10,9,0.55) 100%)",
          }} />
        </>
      }
    >
      <div className="relative flex h-full flex-col gap-4">

        {/* ── Eyebrow ── */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-3 font-display text-[13px] tracking-[0.38em] text-brand-orange">
          <span className="h-px w-12 bg-brand-orange" />
          写在最后
          <motion.span
            aria-hidden
            className="ml-3 inline-block h-2 w-2 rounded-full bg-brand-orange"
            style={{ boxShadow: "0 0 10px 2px rgba(217,119,87,0.8)" }}
            animate={rm ? undefined : { opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* ── 主标题 ── */}
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.15 }}
          className="font-display font-bold leading-tight" style={{ fontSize: "62px", color: "#faf9f5" }}>
          此刻，
          <span style={{
            backgroundImage: "linear-gradient(90deg, #f4c9b6, #d97757)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            是分水岭。
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="font-serif text-[20px] leading-relaxed"
          style={{ color: "rgba(250,249,245,0.60)" }}
        >
          不必焦虑，不必完美——先动起来，就是赢家。
        </motion.p>

        {/* ── 主体双栏 ── */}
        <div className="flex-1 grid grid-cols-[1.2fr_1fr] gap-10 min-h-0">

          {/* 左栏 */}
          <div className="flex flex-col gap-5 justify-center">

            {/* Step 1 · 核心转变（纯文字，无卡片） */}
            <Reveal show={step >= 1} variant="rise">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="font-display text-[21px] tracking-[0.2em] mt-1 shrink-0" style={{ color: "rgba(250,249,245,0.62)" }}>过去</span>
                  <p className="font-serif text-[33px] leading-relaxed" style={{ color: "rgba(250,249,245,0.75)" }}>
                    优化「人如何更高效地使用工具」
                  </p>
                </div>
                <div className="ml-14 h-px w-12" style={{ background: "rgba(217,119,87,0.50)" }} />
                <div className="flex items-start gap-4">
                  <span className="font-display text-[21px] tracking-[0.2em] mt-1 shrink-0" style={{ color: "#d97757" }}>现在</span>
                  <p className="font-serif text-[33px] leading-relaxed font-semibold" style={{ color: "#faf9f5" }}>
                    设计「工具如何在边界内自主完成目标」
                  </p>
                </div>
                <p className="ml-14 font-serif text-[27px] leading-relaxed" style={{ color: "rgba(250,249,245,0.78)" }}>
                  AI 终局价值不在回答本身，而在
                  <span style={{ color: "#e8935c" }}> 可验证、可复用、可持续优化的结果交付</span>。
                </p>
              </div>
            </Reveal>

            {/* Step 2 · 四大支柱（节点连线样式） */}
            <Reveal show={step >= 2} variant="rise">
              <div>
                <p className="mb-4 font-display text-[21px] tracking-[0.24em]" style={{ color: "rgba(250,249,245,0.65)" }}>
                  搭建你的下一代能力栈
                </p>
                <div className="flex items-center gap-0">
                  {PILLARS.map((p, i) => (
                    <div key={p.tech} className="flex items-center">
                      {/* 节点 */}
                      <motion.div
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.7 }}
                        transition={{ duration: 0.35, delay: 0.1 * i }}
                      >
                        <div className="rounded-full flex items-center justify-center font-display font-bold border-2"
                          style={{ width: 120, height: 120, fontSize: 21, background: `${p.color}30`, borderColor: p.color, color: p.color, boxShadow: `0 0 24px ${p.color}40` }}>
                          {p.tech.length <= 3 ? p.tech : p.tech.slice(0, 2)}
                        </div>
                        <span className="font-display text-[20px]" style={{ color: p.color }}>{p.label}</span>
                        <span className="font-serif text-[20px] text-center max-w-[120px]" style={{ color: "rgba(250,249,245,0.82)" }}>{p.tech}</span>
                      </motion.div>
                      {/* 连线 */}
                      {i < PILLARS.length - 1 && (
                        <motion.div className="flex-1 mx-3"
                          initial={{ scaleX: 0 }} animate={{ scaleX: step >= 2 ? 1 : 0 }}
                          transition={{ duration: 0.4, delay: 0.1 * i + 0.2 }}
                          style={{ transformOrigin: "left" }}>
                          <div className="h-px w-full" style={{ background: "linear-gradient(90deg,rgba(250,249,245,0.40),rgba(250,249,245,0.18))" }} />
                          <div className="text-center" style={{ fontSize: "14px", color: "rgba(250,249,245,0.45)", marginTop: "-8px" }}>▸</div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* 右栏 · Step 3 · 双路建议（无边框，纯文字+色彩） */}
          <div className="flex flex-col justify-center">
            <Reveal show={step >= 3} variant="rise">
              <div className="space-y-6">
                {/* 给个人 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="rounded-full shrink-0" style={{ width: 18, height: 18, background: "#6a9bcc" }} />
                    <span className="font-display text-[30px] font-bold tracking-widest" style={{ color: "#8ab0d4" }}>给个人</span>
                  </div>
                  <div className="space-y-3 ml-7">
                    {[
                      "你的实验密度够不够高？",
                      "你的 Token 用得够不够值？",
                      "你是否把能力转成工作流资产？",
                    ].map((q, i) => (
                      <motion.p key={i} className="font-serif text-[29px] leading-relaxed"
                        style={{ color: "rgba(250,249,245,0.85)" }}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: step >= 3 ? 1 : 0, x: step >= 3 ? 0 : 8 }}
                        transition={{ duration: 0.3, delay: 0.07 * i }}>
                        <span style={{ color: "#8ab0d4", marginRight: "8px" }}>·</span>{q}
                      </motion.p>
                    ))}
                  </div>
                </div>

                {/* 分隔线 */}
                <div className="h-px ml-5" style={{ background: "rgba(250,249,245,0.22)" }} />

                {/* 给团队 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="rounded-full shrink-0" style={{ width: 18, height: 18, background: "#d97757" }} />
                    <span className="font-display text-[30px] font-bold tracking-widest" style={{ color: "#e8935c" }}>给团队</span>
                  </div>
                  <div className="space-y-3 ml-7">
                    {[
                      "主动拥抱先进工具与模型",
                      "持续试错、快速复盘",
                      "及时固化为团队规范与资产",
                    ].map((q, i) => (
                      <motion.p key={i} className="font-serif text-[29px] leading-relaxed"
                        style={{ color: "rgba(250,249,245,0.85)" }}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: step >= 3 ? 1 : 0, x: step >= 3 ? 0 : 8 }}
                        transition={{ duration: 0.3, delay: 0.07 * i + 0.15 }}>
                        <span style={{ color: "#e8935c", marginRight: "8px" }}>·</span>{q}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Step 4 · 结语 ── */}
        {step >= 4 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex flex-col gap-3 pt-4"
            style={{ borderTop: "1px solid rgba(250,249,245,0.22)" }}>
            <div className="flex items-end justify-between">
              <div>
                <p className="font-serif italic text-[26px]" style={{ color: "#faf9f5" }}>
                  "纸上得来终觉浅，
                  <span style={{ color: "#d97757" }} className="not-italic font-bold">觉知此事要躬行。</span>"
                </p>
                <p className="mt-2 font-serif text-[18px]" style={{ color: "rgba(250,249,245,0.68)" }}>
                  这，才是从 Generative AI 走向 Agentic AI 的真正意义。
                </p>
              </div>
              <div className="text-right shrink-0 ml-12">
                <p className="font-display text-[21px] tracking-[0.45em] font-bold" style={{ color: "rgba(250,249,245,0.88)" }}>
                  THANK YOU
                </p>
                <p className="mt-1 font-serif text-[16px]" style={{ color: "rgba(250,249,245,0.55)" }}>
                  问题、讨论、反馈，都欢迎 ✦
                </p>
              </div>
            </div>
            {/* 版权/生成署名 */}
            <p className="font-display text-[12px] tracking-[0.2em] text-right"
              style={{ color: "rgba(250,249,245,0.28)" }}>
              本内容由 Cursor Agent + Claude 提供
            </p>
          </motion.div>
        )}
      </div>
    </Slide>
  );
}
