import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";
import { Zap, Brain, XCircle, CheckCircle2, ArrowRight } from "lucide-react";

const REFLECTION_STEPS = [
  { num: "01", label: "初步作答" },
  { num: "02", label: "发现问题" },
  { num: "03", label: "修正重算" },
  { num: "04", label: "验算确认" },
];

const METRICS = [
  { label: "响应速度",   fastBar: 90, fastText: "秒级",  slowBar: 28, slowText: "十秒~数分钟" },
  { label: "推理准确率", fastBar: 50, fastText: "中等",  slowBar: 93, slowText: "显著更高"   },
  { label: "Token 成本", fastBar: 12, fastText: "低",    slowBar: 88, slowText: "贵约 5-10×" },
];

export default function ThinkingModes() {
  const step = usePresenterStep(5);

  return (
    <Slide
      eyebrow="第五章 · 深度思考 Thinking"
      title="从快思考到慢思考：何时更准、何时更贵"
    >
      <div className="grid h-full grid-cols-[1.3fr_1fr] gap-6">

        {/* ══ 左列：双系统对比 + 数学例题 ══ */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* Step 1 · 双系统大卡 */}
          <Reveal show={step >= 1} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <div className="mb-4 font-display text-[13px] tracking-[0.22em] text-brand-orange uppercase">
                两种思维模式（卡尼曼《思考，快与慢》）
              </div>
              <div className="grid grid-cols-2 gap-4">

                {/* 系统 1 · 快 */}
                <div className="rounded-xl border-2 border-brand-orange/40 bg-brand-orange/8 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-orange/20">
                      <Zap size={24} className="text-brand-orange" />
                    </div>
                    <div>
                      <div className="font-display text-[26px] font-bold leading-none text-ink">系统 1</div>
                      <div className="font-serif text-[17px] text-brand-orange mt-0.5">快思考</div>
                    </div>
                  </div>
                  <ul className="space-y-2 font-serif text-[16px] leading-snug text-ink/78">
                    <li>⚡ 直觉反应、毫秒级生成</li>
                    <li>✔ 适合简单、低容错任务</li>
                    <li>⚠ 遇复杂题容易跳步出错</li>
                  </ul>
                  <div className="mt-4 rounded-lg bg-brand-orange/15 px-4 py-2.5 font-mono text-[17px] text-ink/80">
                    例：2 + 2 = ?
                  </div>
                </div>

                {/* 系统 2 · 慢 */}
                <div className="rounded-xl border-2 border-brand-blue/40 bg-brand-blue/8 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-blue/20">
                      <Brain size={24} className="text-brand-blue" />
                    </div>
                    <div>
                      <div className="font-display text-[26px] font-bold leading-none text-ink">系统 2</div>
                      <div className="font-serif text-[17px] text-brand-blue mt-0.5">慢思考</div>
                    </div>
                  </div>
                  <ul className="space-y-2 font-serif text-[16px] leading-snug text-ink/78">
                    <li>🧠 逐步推理、过程可校验</li>
                    <li>✔ 适合高复杂、低容错任务</li>
                    <li>⚠ 更慢、更贵（约 5-10×）</li>
                  </ul>
                  <div className="mt-4 rounded-lg bg-brand-blue/15 px-4 py-2.5 font-mono text-[17px] text-ink/80">
                    例：17 × 24 = ?
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Step 2 · 数学题：快错 vs 慢对 */}
          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <div className="mb-3 font-display text-[13px] tracking-[0.22em] text-brand-orange uppercase">
                🚗 一道题看透差别
              </div>
              <div className="rounded-xl bg-ink/5 px-4 py-2.5 font-serif text-[15px] text-ink/72 mb-4">
                一辆车先以 <strong>60 km/h 行驶 2 小时</strong>，再以{" "}
                <strong>90 km/h 行驶 1.5 小时</strong>，求平均速度。
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* 快·错 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <XCircle size={16} className="text-red-400 flex-shrink-0" />
                    <span className="font-display text-[14px] text-ink/60">快思考 · 直接平均</span>
                  </div>
                  <div className="flex-1 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                    <div className="font-mono text-[16px] text-red-800 leading-relaxed">
                      (60 + 90) ÷ 2<br />
                      = <span className="line-through opacity-60">75</span> km/h
                    </div>
                    <div className="mt-2 font-serif text-[14px] text-red-500">
                      ✗ 跳过了"路程 ÷ 时间"的本质
                    </div>
                  </div>
                </div>
                {/* 慢·对 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                    <span className="font-display text-[14px] text-ink/60">慢思考 · 逐步推导</span>
                  </div>
                  <div className="flex-1 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                    <div className="font-mono text-[15px] text-green-900 leading-relaxed space-y-0.5">
                      <div>路程：60×2 + 90×1.5 = 255</div>
                      <div>时间：2 + 1.5 = 3.5 h</div>
                      <div className="font-bold text-[16px]">→ 255 ÷ 3.5 ≈ 72.9 ✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ══ 右列：自我反思 + 代价对比 + 结论 ══ */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* Step 3 · 自我反思流程 */}
          <Reveal show={step >= 3} variant="slide-left">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <div className="mb-4 font-display text-[13px] tracking-[0.22em] text-brand-orange uppercase">
                🔄 自我反思：像交卷前再复查
              </div>
              <div className="flex items-center gap-2 mb-4">
                {REFLECTION_STEPS.map((s, i) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <motion.div
                      className="rounded-xl border border-brand-blue/30 bg-brand-blue/8 px-3 py-2.5 text-center min-w-[68px]"
                      initial={{ opacity: 0, y: 8 }}
                      animate={step >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                      transition={{ duration: 0.4, delay: 0.12 * i, ease }}
                    >
                      <div className="font-display text-[12px] font-semibold text-brand-blue">
                        {s.num}
                      </div>
                      <div className="font-serif text-[14px] text-ink/80 mt-0.5">{s.label}</div>
                    </motion.div>
                    {i < REFLECTION_STEPS.length - 1 && (
                      <ArrowRight size={13} className="text-ink/30 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="font-serif text-[15px] text-ink/62 leading-relaxed">
                先进模型在内部执行此循环，把逻辑漏洞拦在最终输出之前。
              </div>
            </div>
          </Reveal>

          {/* Step 4 · 三维代价对比（动效进度条） */}
          <Reveal show={step >= 4} variant="slide-left">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <div className="mb-3 font-display text-[13px] tracking-[0.22em] text-brand-orange uppercase">
                📊 代价对比
              </div>
              {/* 图例 */}
              <div className="flex items-center gap-5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-6 rounded-full bg-brand-orange" />
                  <span className="font-serif text-[14px] text-ink/60">普通模式</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-6 rounded-full bg-brand-blue" />
                  <span className="font-serif text-[14px] text-ink/60">深度思考</span>
                </div>
              </div>
              {/* 指标 */}
              <div className="space-y-4">
                {METRICS.map((m, mi) => (
                  <div key={m.label}>
                    <div className="mb-2 font-display text-[14px] font-semibold text-ink/70">
                      {m.label}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* 普通 */}
                      <div className="flex flex-col gap-1.5">
                        <div className="h-3 w-full rounded-full bg-ink/8 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-brand-orange"
                            initial={{ width: 0 }}
                            animate={step >= 4 ? { width: `${m.fastBar}%` } : { width: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 * mi, ease }}
                          />
                        </div>
                        <div className="font-serif text-[14px] text-ink/55">{m.fastText}</div>
                      </div>
                      {/* 深度 */}
                      <div className="flex flex-col gap-1.5">
                        <div className="h-3 w-full rounded-full bg-ink/8 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-brand-blue"
                            initial={{ width: 0 }}
                            animate={step >= 4 ? { width: `${m.slowBar}%` } : { width: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 * mi + 0.12, ease }}
                          />
                        </div>
                        <div className="font-serif text-[14px] text-ink/55">{m.slowText}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Step 5 · 决策结论 */}
          <Reveal show={step >= 5} variant="rise">
            <Callout tone="tip" title="实战开关原则">
              高复杂度、低容错 → 开深度思考；低复杂度、高实时 → 普通模式。
              <br />
              <span className="text-[15px] text-ink/60">
                核心是「任务分级」，而不是默认全量开启。
              </span>
            </Callout>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
