import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { usePresenterStep } from "@/deck/usePresenterStep";

export default function Slide12Ch52CoTWorkflow() {
  const step = usePresenterStep(3);

  return (
    <Slide eyebrow="第五章 · 思维链" title="Chain-of-Thought：让推理显式可见">
      <div className="grid h-full grid-cols-[1.15fr_1fr] gap-8">
        <Reveal show={step >= 1} variant="rise">
          <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
            <div className="mb-3 font-display text-[12px] tracking-[0.2em] text-brand-orange uppercase">问题样例</div>
            <p className="font-serif text-[15px] leading-relaxed text-ink/75">
              一辆车先以 60km/h 行驶 2 小时，再以 90km/h 行驶 1.5 小时，求平均速度。
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-ink/10 bg-ink/5 p-4">
                <div className="font-display text-[13px] text-ink">直接快答</div>
                <div className="mt-1 font-serif text-[14px] text-ink/75">75 km/h</div>
                <div className="mt-2 font-serif text-[12px] text-red-600">错误：把两个速度直接平均</div>
              </div>
              <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/10 p-4">
                <div className="font-display text-[13px] text-ink">思维链推导</div>
                <div className="mt-1 font-serif text-[14px] text-ink/75">总路程 / 总时间</div>
                <div className="mt-2 font-serif text-[12px] text-green-700">正确：72.9 km/h</div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-4">
          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="font-display text-[12px] tracking-[0.16em] text-ink/55 uppercase">CoT 工作方式</div>
              <ol className="mt-2 space-y-2 font-serif text-[15px] leading-relaxed text-ink/78">
                <li>1) 先分解问题，明确已知量与目标量</li>
                <li>2) 再按步骤计算中间结果</li>
                <li>3) 最后统一验算，输出结论</li>
              </ol>
            </div>
          </Reveal>

          <Reveal show={step >= 3} variant="rise" delay={0.06}>
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="font-display text-[12px] tracking-[0.16em] text-ink/55 uppercase">讲解抓手</div>
              <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink/75">
                CoT 的价值不在“字数更多”，而在“把推理路径外显化”，降低跳步错误与伪合理答案。
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
