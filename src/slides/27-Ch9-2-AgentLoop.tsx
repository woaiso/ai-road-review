import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { AgentLoop } from "@/visualizations/AgentLoop";
import { motion } from "framer-motion";
import { Brain, Wrench, Eye } from "lucide-react";
import { ease } from "@/lib/motion";

/** Generative vs Agentic 四维度差异 */
const PARADIGM_DIFF = [
  { dim: "输出形态", gen: "文本 / 图像 / 代码（内容）",     ag: "副作用、状态变更（结果）" },
  { dim: "交互方式", gen: "对话，用户驱动",                 ag: "多步循环，目标驱动" },
  { dim: "行为模式", gen: "回答——是什么 / 写什么",          ag: "完成——怎么办 / 去做" },
  { dim: "能力边界", gen: "上下文 + 训练数据",              ag: "由可用工具集决定" },
];

/** ReAct 紧凑流水线（5行） */
type RowKind = "think" | "act" | "obs" | "final";
const REACT_ROWS: { kind: RowKind; label: string; content: string; step: number }[] = [
  { kind: "think", label: "思考", content: "需查两个模型价格，分别搜索。",            step: 4 },
  { kind: "act",   label: "行动", content: 'search("Claude 3.7 Sonnet pricing")',    step: 4 },
  { kind: "obs",   label: "观察", content: "输入 $3 / 输出 $15 / 1M tokens",         step: 4 },
  { kind: "act",   label: "行动", content: 'search("GPT-4o pricing 2025")',           step: 5 },
  { kind: "final", label: "输出", content: "→ 生成格式化对比表格",                   step: 5 },
];
const KIND_STYLE: Record<RowKind, { bg: string; border: string; text: string }> = {
  think: { bg: "bg-brand-blue/10",   border: "border-brand-blue/35",   text: "text-brand-blue" },
  act:   { bg: "bg-brand-orange/10", border: "border-brand-orange/35", text: "text-brand-orange" },
  obs:   { bg: "bg-brand-green/10",  border: "border-brand-green/35",  text: "text-brand-green" },
  final: { bg: "bg-ink",             border: "border-ink",             text: "text-cream" },
};

export default function AgentLoopSlide() {
  const step = usePresenterStep(5);

  return (
    <Slide
      eyebrow="第九章 · Agent / 智能体"
      title={
        <>
          从 <span className="text-ink/50">Generative AI</span> 到{" "}
          <span className="text-brand-orange">Agent</span>：多步自主决策
        </>
      }
    >
      <div className="grid h-full grid-cols-[1.05fr_1fr] gap-5">

        {/* ══ 左列：定义 → 差异表 → Loop说明 → ReAct摘要 ══ */}
        <div className="flex flex-col gap-3">

          {/* Step 1 · 核心定义 */}
          <Reveal show={step >= 1} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                顾问 → 执行助理
              </div>
              <p className="mb-3 font-serif text-[14px] leading-relaxed text-ink/80">
                之前的 AI 是"<strong>咨询顾问</strong>"——告诉你怎么做；
                Agent 是"<strong className="text-brand-orange">执行助理</strong>"——自己规划、调资源、逐步完成任务。
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Brain, label: "目标对齐", desc: "多轮不漂移", color: "text-brand-blue" },
                  { icon: Wrench, label: "动作执行", desc: "调 Tool/MCP", color: "text-brand-orange" },
                  { icon: Eye, label: "异常恢复", desc: "重试或降级", color: "text-brand-green" },
                ].map(({ icon: Icon, label, desc, color }) => (
                  <div key={label} className="flex flex-col items-center rounded-xl bg-ink/4 px-2 py-2.5 text-center">
                    <Icon size={18} className={color} strokeWidth={2} />
                    <div className="mt-1 font-display text-[12px] font-semibold text-ink">{label}</div>
                    <div className="font-serif text-[11px] text-ink/55">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Step 2 · 四维度差异表（色格标注优势方） */}
          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-sm">
              <div className="mb-2 grid grid-cols-[auto_1fr_1fr] gap-2 border-b border-ink/10 pb-1.5">
                <div className="w-[60px] font-display text-[11px] text-ink/35">维度</div>
                <div className="font-display text-[11px] text-ink/45">Generative AI</div>
                <div className="font-display text-[11px] font-semibold text-brand-orange">Agentic AI</div>
              </div>
              <div className="space-y-1">
                {PARADIGM_DIFF.map((row, i) => (
                  <motion.div
                    key={row.dim}
                    className="grid grid-cols-[auto_1fr_1fr] items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={step >= 2 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.07 * i, ease }}
                  >
                    <div className="w-[60px] font-display text-[12px] font-semibold text-ink/60">{row.dim}</div>
                    <div className="rounded-lg px-2 py-1 font-serif text-[12px] text-ink/55">{row.gen}</div>
                    <div className="rounded-lg bg-brand-orange/10 px-2 py-1 font-serif text-[12px] font-semibold text-brand-orange/90">{row.ag}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Step 3 · Agent Loop 说明 */}
          <Reveal show={step >= 3} variant="rise">
            <div className="rounded-xl border border-brand-orange/30 bg-gradient-to-r from-brand-orange/10 to-brand-orange/3 px-4 py-3">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase shrink-0">
                  Agent Loop
                </span>
                <span className="font-display text-[18px] font-semibold text-ink">
                  感知 → 规划 → 执行 → 观察（循环）
                </span>
              </div>
              <p className="mt-1 font-serif text-[13px] text-ink/70">
                不再"问一句答一句"，而是持续闭环，直到任务完成或主动求助。
              </p>
            </div>
          </Reveal>

          {/* Step 5 · ReAct 摘要 + 结论 */}
          <Reveal show={step >= 5} variant="rise">
            <div className="flex items-center gap-2">
              {[
                { label: "REASON", bg: "bg-brand-blue/15", text: "text-brand-blue" },
                { label: "ACT",    bg: "bg-brand-orange/15", text: "text-brand-orange" },
                { label: "OBSERVE",bg: "bg-brand-green/15", text: "text-brand-green" },
              ].map(b => (
                <div key={b.label} className={`flex-1 rounded-lg ${b.bg} py-1.5 text-center font-display text-[12px] font-semibold tracking-widest ${b.text}`}>
                  {b.label}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal show={step >= 5} variant="rise">
            <Callout tone="insight" title="章节结论">
              有了 Tool/MCP 之后，Agent 解决的是下一层问题：
              <strong>在多轮中如何连续决策，而不是"问一句答一句"就结束</strong>。
            </Callout>
          </Reveal>
        </div>

        {/* ══ 右列：AgentLoop 可视化 + ReAct 流水线 ══ */}
        <div className="flex flex-col gap-3">

          {/* AgentLoop 可视化（固定高度，随 step 逐步点亮） */}
          <div className="rounded-2xl border border-ink/10 bg-white shadow-sm">
            <div className="h-[320px]">
              <AgentLoop activeStep={Math.min(step, 4)} />
            </div>
          </div>

          {/* Step 4 · ReAct 紧凑流水线 */}
          <Reveal show={step >= 4} variant="slide-left">
            <div className="rounded-2xl border border-ink/10 bg-white p-3 shadow-sm">
              <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                ReAct 流水线示例
              </div>
              <div className="space-y-1.5">
                {REACT_ROWS.map((row, i) => {
                  const s = KIND_STYLE[row.kind];
                  return (
                    <motion.div
                      key={i}
                      className={`flex items-center gap-2.5 rounded-lg border-l-4 px-3 py-2 ${s.bg} ${s.border}`}
                      initial={{ opacity: 0, x: 8 }}
                      animate={step >= row.step ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
                      transition={{ duration: 0.3, delay: 0.1 * (i % 3), ease }}
                    >
                      <span className={`font-display text-[10px] font-bold tracking-widest shrink-0 ${s.text}`}>
                        {row.label}
                      </span>
                      <span className={`font-mono text-[12px] leading-snug ${
                        row.kind === "final" ? "text-cream" : "text-ink/80"
                      }`}>
                        {row.content}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
