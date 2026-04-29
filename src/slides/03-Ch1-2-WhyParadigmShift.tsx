import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { Timeline } from "@/visualizations/Timeline";
import { Callout } from "@/components/Callout";

export default function TimelineSlide() {
  const step = usePresenterStep(6);
  return (
    <Slide
      eyebrow="第一章 · 范式跃迁"
      title="拐点已至：为什么说「范式跃迁」发生在此刻"
    >
      <div className="flex h-full flex-col gap-8">
        <div className="h-[420px]">
          <Timeline activeIndex={step} />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <Reveal show={step >= 6} variant="rise">
            <Callout tone="quote" title="不是量变，是质变">
              从马车到汽车，并不是「快一点的马车」，而是<strong>整个出行方式的重构</strong>。
            </Callout>
          </Reveal>
          <Reveal show={step >= 6} variant="rise" delay={0.1}>
            <Callout tone="insight" title="今天的位置">
              我们正站在第六个里程碑——
              <span className="text-brand-orange">Agentic AI（2026）</span>
              ——规模化落地的起点上。
            </Callout>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
