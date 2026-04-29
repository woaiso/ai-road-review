import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { usePresenterStep } from "@/deck/usePresenterStep";

export default function Slide13Ch53SelfReflection() {
  const step = usePresenterStep(2);

  return (
    <Slide eyebrow="第五章 · 自我反思" title="自我反思：让模型做自己的「审稿人」">
      <div className="grid h-full grid-cols-[1.15fr_1fr] gap-8">
        <Reveal show={step >= 1} variant="rise">
          <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
            <div className="mb-3 font-display text-[12px] tracking-[0.2em] text-brand-orange uppercase">内部循环</div>
            <div className="space-y-2 rounded-xl bg-ink/5 p-4 font-mono text-[13px] leading-relaxed text-ink/80">
              <div>[草稿推理] 先给出初版答案</div>
              <div>[自检] 发现某一步不一致</div>
              <div>[修正] 回退并重算关键步骤</div>
              <div>[验算] 交叉检查后再输出最终结果</div>
            </div>
            <p className="mt-4 font-serif text-[15px] leading-relaxed text-ink/75">
              这相当于在“交卷前再审一次”，把易错点拦在输出之前。
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-4">
          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="font-display text-[12px] tracking-[0.16em] text-ink/55 uppercase">收益与代价</div>
              <div className="mt-3 space-y-2 font-serif text-[15px] leading-relaxed text-ink/78">
                <div>收益：减少逻辑跳步，提升复杂任务稳定性。</div>
                <div>代价：更高 token 消耗与更长响应延迟。</div>
                <div>策略：高复杂任务开，低复杂高实时任务关。</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
