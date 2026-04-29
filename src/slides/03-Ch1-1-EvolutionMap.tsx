import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { AITower as Tower } from "@/visualizations/AITower";
import { Callout } from "@/components/Callout";

const BANDS = [
  { id: "foundation", label: "地基层", range: "GenAI + Prompt", towerRange: "L1-L2", summary: "先让模型“会说人话”。", floorCount: 2 },
  { id: "cognition", label: "认知层", range: "Context + Thinking", towerRange: "L3-L4", summary: "再让模型“会利用上下文，并进行深度思考”。", floorCount: 4 },
  {
    id: "knowledge",
    label: "知识执行层",
    range: "RAG -> Tool / MCP -> Agent -> Agent Skill",
    towerRange: "L5-L8",
    summary: "补知识，再接能力层（Tool / MCP），再进入 Agent 多步执行，最后沉淀为 Agent Skill。",
    floorCount: 8,
  },
  { id: "runtime", label: "工程层", range: "Harness", towerRange: "L9", summary: "把实验能力变成生产能力。", floorCount: 9 },
  { id: "paradigm", label: "范式与愿景层", range: "Agentic AI + AGI", towerRange: "L10-L11", summary: "上面是范式，最上面是愿景。", floorCount: 11 },
];

export default function AITowerSlide() {
  // 11 个步骤：从底向上点亮（含 Agentic AI 与 AGI）
  const step = usePresenterStep(11);
  const activeBandIndex = BANDS.findIndex((band) => step <= band.floorCount);
  const stageIndex = activeBandIndex === -1 ? BANDS.length - 1 : activeBandIndex;
  const currentBand = BANDS[stageIndex];
  return (
    <Slide
      eyebrow="第一章 · 一图全览"
      title="智能大厦：技术栈的层叠地图"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="grid min-h-0 flex-1 grid-cols-[0.62fr_1.38fr] items-end gap-6">
          {/* 左：常驻分层索引卡，和右侧楼层形成稳定对应关系 */}
          <div className="flex min-h-0 flex-col gap-3 pb-6">
            {/* 顶部固定预留区：避免 step 出现时触发整页布局变化 */}
            <div className="min-h-[150px] space-y-2">
              <Reveal show={step >= 10}>
                <Callout tone="insight" title="一句话记住这张图">
                  <span className="font-semibold text-ink">Harness</span> 解决的是
                  <span className="font-semibold text-ink">“如何可靠地跑”</span>，
                  <span className="font-semibold text-brand-orange">Agentic AI</span> 解决的是
                  <span className="font-semibold text-brand-orange">“为了目标自主完成”</span>，
                  而 <span className="font-semibold text-brand-orange">AGI</span> 是更长期的愿景层。
                </Callout>
              </Reveal>
              <Reveal show={step >= 10}>
                <div className="rounded-xl border border-ink/10 bg-white/75 px-4 py-3">
                  <div className="space-y-1.5 font-serif text-[13px] leading-relaxed text-ink/70">
                    <div>底层是数值计算链路：Embedding → Attention → FFN → LM Head。</div>
                    <div>从下到上是能力跃迁：先“会写”，再“会办”。</div>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white/78 p-4">
              <div className="mb-2 font-display text-[12px] tracking-[0.14em] text-ink/55 uppercase">
                塔层对照索引
              </div>
              <div className="flex flex-col-reverse gap-2">
                {BANDS.map((band) => {
                  const isActive = band.id === currentBand.id;
                  const isPassed = step >= band.floorCount;
                  return (
                    <div
                      key={band.id}
                      className={`rounded-xl border px-3 py-2 transition-all ${
                        isActive
                          ? "border-brand-orange/40 bg-brand-orange/[0.08] shadow-[0_4px_14px_rgba(217,119,87,0.18)]"
                          : isPassed
                            ? "border-ink/12 bg-ink/[0.02]"
                            : "border-ink/10 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-display text-[18px] font-semibold text-ink">{band.label}</div>
                        <div className="font-display text-[12px] tracking-[0.06em] text-ink/55">
                          {band.towerRange}
                        </div>
                      </div>
                      <div className="mt-0.5 font-display text-[12px] tracking-[0.04em] text-ink/58">
                        {band.range}
                      </div>
                      <div className="mt-1 font-serif text-[14px] leading-relaxed text-ink/70">
                        {band.summary}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右：高塔可视化 */}
          <div className="relative flex h-full min-h-0 items-end justify-end">
            <Tower activeLevel={step} />
          </div>
        </div>
      </div>
    </Slide>
  );
}
