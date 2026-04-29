import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { ContextWindowBar } from "@/visualizations/ContextWindowBar";

export default function ContextWindow() {
  const step = usePresenterStep(3);
  return (
    <Slide
      eyebrow="第三章 · Context / Context Window"
      title={<>上下文窗口：模型的「<span className="text-brand-orange">工作台</span>」</>}
    >
      <div className="grid h-full grid-cols-[1.05fr_1.35fr] gap-8">
        <div className="flex flex-col gap-4">
          <Reveal show={step >= 1} variant="rise">
            <div className="rounded-2xl bg-white p-7 shadow-sm border border-ink/8">
              <div className="font-display text-[12px] tracking-[0.24em] text-brand-orange mb-3 uppercase">
                先回答一个常见问题
              </div>
              <div className="font-display text-[25px] font-semibold text-ink leading-tight mb-4">
                为什么模型看起来“记得”上文？
              </div>
              <p className="font-serif text-[16px] text-ink/75 leading-relaxed">
                不是模型在这一刻重新训练了自己，而是系统把前文一并放进当前请求。模型在同一条语境里持续作答，于是看起来像“有记忆”。
              </p>
            </div>
          </Reveal>

          {step >= 2 && (
            <Reveal show variant="rise" delay={0.1}>
              <div className="space-y-3">
                <Callout tone="quote" title="把“记忆”拆开看">
                  一次请求里通常包含：System Prompt、历史摘要、最近对话、RAG 片段、工具结果与当前问题。模型是“看到了这些材料”，不是“凭空回忆”。
                </Callout>
                <div className="rounded-xl border border-ink/10 bg-white/75 px-4 py-3">
                  <div className="font-display text-[11px] tracking-[0.16em] text-ink/55 uppercase">
                    工作台直觉
                  </div>
                  <div className="mt-1 font-serif text-[14px] leading-relaxed text-ink/72">
                    Context Window 就像桌面，能同时摊开的“材料”有限。超出上限的内容，模型当前轮次就看不见。
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {step >= 3 && (
            <Reveal show variant="rise">
              <Callout tone="info" title="单位 = Token">
                GPT-3：4K（约 3000 汉字） · GPT-4：128K（约 10 万汉字） · 最新模型：1M（约 75 万汉字）。
                <br />
                <span className="text-ink/60">粗略估算：1 个英文词或 1 个汉字约为 1.3 Token（因分词器与文本类型会波动）。</span>
              </Callout>
            </Reveal>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Reveal show={step >= 2} variant="slide-left">
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-ink/8">
              <div className="font-display text-[12px] tracking-[0.24em] text-brand-orange mb-3 uppercase">
                一次请求里的上下文卡片
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["System Prompt", "你是电商技术顾问，先结论再步骤。"],
                  ["历史对话摘要", "用户在做购物车，卡在库存校验。"],
                  ["最近几轮对话", "库存锁定、Redis 预占、担心超卖。"],
                  ["外部知识 / RAG", "两阶段扣减 + Lua 原子性建议。"],
                  ["工具返回结果", "2000 并发：超卖率 0.7%，延迟 120ms。"],
                  ["当前用户问题", "那现在应该优先改哪一块？"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-xl border border-ink/10 bg-ink/5 p-3">
                    <div className="font-display text-[12px] text-ink">{title}</div>
                    <div className="mt-1 font-serif text-[13px] leading-relaxed text-ink/72">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal show={step >= 3} variant="slide-left">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-ink/8 h-full">
              <div className="font-display text-[12px] tracking-[0.24em] text-brand-orange mb-2 uppercase">便利贴到白板</div>
              <div className="font-display text-[20px] font-semibold text-ink mb-4">
                主流模型的窗口规模
              </div>
              <div className="h-[300px]">
                <ContextWindowBar activeStep={5} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
