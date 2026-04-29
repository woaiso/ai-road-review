import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { RagFlow as RagFlowViz } from "@/visualizations/RagFlow";

/**
 * 第六章合并页：全宽四行布局
 *
 * Row 1 (flex-shrink-0) ← Step 1 : 三大问题 + RAG 概念  (2 列)
 * Row 2 (flex-shrink-0) ← Step 2 : 业务案例 Q/A
 * Row 3 (flex-1)        ← Step 2 : RagFlowViz（flex-1 直接在 div 上，不经过 Reveal）
 * Row 4 (flex-shrink-0) ← Step 5 : 三个 Callout
 *
 * step → RagFlow activeStep:
 *   1→0, 2→1, 3→3, 4→5, 5→6
 */
const RAG_STEP_MAP = [0, 0, 1, 3, 5, 6] as const;

const CASE_Q = "上海出差住宿费上限是多少？能报销打车吗？";
const CASE_A = "住宿费上限 500 元/晚；机场往返打车可报销（制度 2026-Q1 第 4.2 / 6.1 节）";

const PROBLEMS = [
  {
    num: "①",
    title: "知识截止",
    desc: "训练结束后知识冻结，新事实不在参数里。",
  },
  {
    num: "②",
    title: "私有数据",
    desc: "企业内部文档、流程、实时状态不在模型权重中。",
  },
  {
    num: "③",
    title: "幻觉风险",
    desc: "即便知识范围内，也可能给出听起来合理但错误的答案。",
  },
];

export default function Slide15Ch61KnowledgeLimits() {
  const step = usePresenterStep(5);
  const ragStep = RAG_STEP_MAP[Math.min(step, 5)];

  return (
    <Slide
      eyebrow="第六章 · 知识与检索"
      title={
        <>
          知识边界与 RAG：先<span className="text-brand-orange">查文档</span>，再组织回答
        </>
      }
    >
      {/* 全宽四行 flex-col，Row 3 的 flex-1 在普通 div 上（不经过 Reveal） */}
      <div className="flex h-full flex-col gap-4">

        {/* ── Row 1 : 三大问题 + RAG 概念 ─────────────────── */}
        <Reveal show={step >= 1} variant="rise" className="flex-shrink-0">
          <div className="grid grid-cols-[1.6fr_1fr] gap-4">

            {/* 三大问题：横向三格 */}
            <div className="grid grid-cols-3 gap-3">
              {PROBLEMS.map((p) => (
                <div
                  key={p.num}
                  className="rounded-xl border border-ink/10 bg-white px-4 py-4 shadow-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-display text-[18px] font-bold text-brand-orange">
                      {p.num}
                    </span>
                    <span className="font-display text-[15px] font-semibold text-ink">
                      {p.title}
                    </span>
                  </div>
                  <p className="font-serif text-[14px] leading-relaxed text-ink/70">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* RAG 核心思路 */}
            <div className="rounded-xl border-2 border-brand-orange/40 bg-brand-orange/8 px-5 py-4">
              <div className="mb-2 font-display text-[13px] tracking-[0.2em] text-brand-orange uppercase">
                RAG 核心思路
              </div>
              <p className="font-serif text-[16px] leading-relaxed text-ink/82">
                不是"让模型记住一切"，而是
                <strong className="text-brand-orange"> 回答前先去查</strong>，查完再回答。
              </p>
              <p className="mt-2 font-serif text-[14px] text-ink/55 leading-relaxed">
                类比：给博览群书的学者配一个图书管理员——每次提问先去书架上找相关页，再据此作答。
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── Row 2 : 业务案例 Q/A ──────────────────────────── */}
        <Reveal show={step >= 2} variant="rise" className="flex-shrink-0">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-ink/8 bg-white p-4 shadow-sm">
            <div className="rounded-xl bg-ink/5 px-4 py-3">
              <div className="mb-1 font-display text-[12px] tracking-[0.2em] text-ink/45 uppercase">
                真实提问
              </div>
              <p className="font-serif text-[16px] leading-relaxed text-ink">{CASE_Q}</p>
            </div>
            <Reveal show={step >= 4} variant="rise" delay={0.05}>
              <div className="h-full rounded-xl bg-brand-orange/10 px-4 py-3">
                <div className="mb-1 font-display text-[12px] tracking-[0.2em] text-brand-orange uppercase">
                  可追溯回答
                </div>
                <p className="font-serif text-[16px] leading-relaxed text-ink">{CASE_A}</p>
              </div>
            </Reveal>
          </div>
        </Reveal>

        {/* ── Row 3 : RagFlowViz（flex-1 直接在 div 上） ───── */}
        {step >= 2 && (
          <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-ink/8 bg-white p-4 shadow-sm">
            <div className="h-full">
              <RagFlowViz activeStep={ragStep} />
            </div>
          </div>
        )}

        {/* ── Row 4 : 三个 Callout ─────────────────────────── */}
        <Reveal show={step >= 5} variant="rise" className="flex-shrink-0">
          <div className="grid grid-cols-3 gap-4">
            <Callout tone="info" title="为什么能答对">
              模型先查原文条款，<strong>不靠训练记忆猜答案</strong>。
            </Callout>
            <Callout tone="info" title="规则变了怎么办">
              只替换知识库文档，<strong>不用重新训练模型</strong>。
            </Callout>
            <Callout tone="insight" title="给业务的价值">
              回答带章节引用，<strong>可解释、可追溯、可审计</strong>。
            </Callout>
          </div>
        </Reveal>
      </div>
    </Slide>
  );
}
