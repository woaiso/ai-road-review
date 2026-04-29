import { motion } from "framer-motion";
import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { ease } from "@/lib/motion";

/** 三阶段演进 */
const STAGES = [
  {
    phase: "阶段一", name: "Generative AI",
    tag: "能说话",
    desc: "理解语言，生成内容，一问一答",
    color: "#6a9bcc", bg: "#6a9bcc18",
  },
  {
    phase: "阶段二", name: "Agentic AI",
    tag: "能做事",
    desc: "多步执行，调用工具，自主完成任务",
    color: "#d97757", bg: "#d9775718",
  },
  {
    phase: "阶段三", name: "Self-Improving",
    tag: "会进化",
    desc: "经验沉淀，闭环学习，系统持续变强",
    color: "#788c5d", bg: "#788c5d18",
  },
];

/** 三大洞察 */
const INSIGHTS = [
  {
    n: "01",
    title: "人机分工重构",
    desc: "人负责目标与审批，AI 负责拆解与执行——从「写答案」走向「管系统」",
    color: "#6a9bcc",
  },
  {
    n: "02",
    title: "工程化能力是护城河",
    desc: "Skill、MCP、Harness 决定系统上限，选模型只是起点",
    color: "#d97757",
  },
  {
    n: "03",
    title: "每个人都有自己的 Agent",
    desc: "记忆、规范、权限、审计与闭环学习，将成为个人与团队的标配基础设施",
    color: "#788c5d",
  },
];

/** 实践三步 */
const PRACTICE = [
  { n: "①", text: "从一条高频流程起步，而不是全栈改造" },
  { n: "②", text: "先建可观测与治理，再追求全自动" },
  { n: "③", text: "把经验产品化：Skill、MCP、Harness 都要沉淀" },
];

export default function Slide43Ch131ResultLoop() {
  const step = usePresenterStep(3);

  return (
    <Slide
      eyebrow="第十三章 · 总结"
      title="三个阶段 · 三个洞察 · 三条实践"
    >
      <div className="flex flex-col gap-5 h-full">

        {/* Step 1 · 三阶段演进 */}
        <Reveal show={step >= 1} variant="rise">
          <div className="grid grid-cols-3 gap-4">
            {STAGES.map((s, i) => (
              <motion.div
                key={s.name}
                className="rounded-2xl p-5"
                style={{ background: s.bg, border: `2px solid ${s.color}40` }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 10 }}
                transition={{ duration: 0.4, delay: 0.1 * i, ease }}
              >
                {/* 阶段标签 */}
                <div
                  className="inline-block rounded-full px-3 py-0.5 font-display text-[11px] tracking-widest text-white mb-3"
                  style={{ background: s.color }}
                >
                  {s.phase}
                </div>
                {/* 大标题 */}
                <div className="font-display text-[22px] font-bold text-ink leading-tight mb-1">
                  {s.name}
                </div>
                {/* 口号 */}
                <div
                  className="font-display text-[16px] font-semibold mb-2"
                  style={{ color: s.color }}
                >
                  {s.tag}
                </div>
                {/* 描述 */}
                <p className="font-serif text-[14px] leading-relaxed text-ink/72">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Step 2 · 三大洞察 */}
        <Reveal show={step >= 2} variant="rise">
          <div className="space-y-3">
            {INSIGHTS.map((ins, i) => (
              <motion.div
                key={ins.n}
                className="flex items-start gap-5 rounded-xl border border-ink/8 bg-white px-5 py-3.5 shadow-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: step >= 2 ? 1 : 0, x: step >= 2 ? 0 : -10 }}
                transition={{ duration: 0.35, delay: 0.09 * i, ease }}
              >
                <span
                  className="font-display text-[32px] font-bold leading-none shrink-0"
                  style={{ color: `${ins.color}55` }}
                >
                  {ins.n}
                </span>
                <div>
                  <div
                    className="font-display text-[17px] font-semibold mb-0.5"
                    style={{ color: ins.color }}
                  >
                    {ins.title}
                  </div>
                  <p className="font-serif text-[14px] leading-relaxed text-ink/70">
                    {ins.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Step 3 · 实践三步 + 金句 */}
        <Reveal show={step >= 3} variant="rise">
          <div className="flex gap-4 items-stretch">
            {/* 三条实践 */}
            <div className="flex-1 rounded-2xl border border-ink/10 bg-white px-6 py-4 shadow-sm">
              <div className="mb-3 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                落地实践
              </div>
              <div className="space-y-2.5">
                {PRACTICE.map((p) => (
                  <div key={p.n} className="flex items-start gap-3">
                    <span className="font-display text-[18px] font-bold text-brand-orange shrink-0 leading-none mt-0.5">
                      {p.n}
                    </span>
                    <span className="font-serif text-[15px] leading-relaxed text-ink/78">
                      {p.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* 金句 */}
            <div
              className="w-[280px] shrink-0 rounded-2xl flex flex-col items-center justify-center px-6 py-5 text-center"
              style={{ background: "linear-gradient(135deg,#d9775720,#d9775708)", border: "1.5px solid #d9775750" }}
            >
              <p className="font-serif text-[17px] leading-relaxed text-ink/85">
                能持续交付并可复盘，才算真正从
              </p>
              <p className="mt-2 font-display text-[20px] font-bold text-brand-orange">
                「会聊天」→「会生产」
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Slide>
  );
}
