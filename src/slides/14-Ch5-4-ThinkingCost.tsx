import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { StatCard } from "@/components/StatCard";
import { usePresenterStep } from "@/deck/usePresenterStep";

const ROWS = [
  { dim: "响应速度",   normal: "秒级",          deep: "十秒~数分钟",  hint: "慢得多" },
  { dim: "推理准确率", normal: "中等",          deep: "显著更高",     hint: "↑↑↑" },
  { dim: "Token 消耗", normal: "低",            deep: "高（含思考）", hint: "贵 5-10×" },
  { dim: "适用场景",   normal: "日常对话/问答", deep: "复杂推理/代码/数学", hint: "高难度" },
];

export default function ThinkingTradeoff() {
  const step = usePresenterStep(4);
  return (
    <Slide
      eyebrow="第五章 · 深度思考取舍"
      title={
        <>
          算力与延迟：<span className="text-brand-orange">慢炖</span> 还是{" "}
          <span className="text-brand-blue">微波炉</span>
        </>
      }
    >
      <div className="grid h-full grid-cols-[1.4fr_1fr] gap-10">
        {/* 左：对比表格 */}
        <Reveal show={step >= 1} variant="rise">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-ink/8">
            <table className="w-full">
              <thead>
                <tr className="bg-mute-100">
                  <th className="px-6 py-4 text-left font-display text-[13px] tracking-widest text-ink/55">
                    维度
                  </th>
                  <th className="px-6 py-4 text-left font-display text-[13px] tracking-widest text-brand-orange">
                    普通回答
                  </th>
                  <th className="px-6 py-4 text-left font-display text-[13px] tracking-widest text-brand-blue">
                    深度思考
                  </th>
                  <th className="px-6 py-4 text-left font-display text-[13px] tracking-widest text-ink/45">
                    差异
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/8">
                {ROWS.map((r) => (
                  <tr
                    key={r.dim}
                    className="font-serif text-[16px] hover:bg-mute-100/40 transition"
                  >
                    <td className="px-6 py-5 font-display font-semibold text-ink">{r.dim}</td>
                    <td className="px-6 py-5 text-ink/75">{r.normal}</td>
                    <td className="px-6 py-5 text-ink/85 font-medium">{r.deep}</td>
                    <td className="px-6 py-5 font-mono text-[13px] text-ink/45">{r.hint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* 右：核心数字 + 决策 */}
        <div className="flex flex-col gap-4">
          <Reveal show={step >= 2} variant="rise">
            <StatCard
              value="5-10×"
              label="深度思考的 Token 成本倍数"
              hint="思考过程也要计费"
              accent="#d97757"
            />
          </Reveal>
          <Reveal show={step >= 3} variant="rise" delay={0.05}>
            <StatCard
              value="数秒 → 数分钟"
              label="单次响应延迟"
              hint="不适合实时对话"
              accent="#6a9bcc"
            />
          </Reveal>
          {step >= 4 && (
            <Reveal show variant="rise">
              <div className="space-y-3">
                <Callout tone="tip" title="决策建议">
                  <strong>日常对话</strong>用快思考；遇到<strong>代码、数学、复杂推理、关键决策</strong>再切到深度思考。
                </Callout>
                {/* 原理补充：强调成本来自额外推理 Token */}
                <div className="rounded-xl border border-ink/10 bg-white/75 px-4 py-3">
                  <div className="font-display text-[11px] tracking-[0.16em] text-ink/55 uppercase">
                    原理补充 · GEN-NOTE §2.3
                  </div>
                  <div className="mt-1 font-serif text-[14px] leading-relaxed text-ink/72">
                    深度思考的主要代价来自额外推理 Token 与延迟；更适合作为“任务分级开关”，而非默认全量开启。
                  </div>
                  <div className="mt-2 space-y-1.5 font-serif text-[13px] leading-relaxed text-ink/68">
                    <div>讲解抓手 1：把“复杂度高且容错低”的任务优先分配到深度思考。</div>
                    <div>讲解抓手 2：把“快响应场景”保留给普通模式，提升整体性价比。</div>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </Slide>
  );
}
