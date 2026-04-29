import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { AttentionMatrix } from "@/visualizations/AttentionMatrix";

export default function Slide05Ch23SelfAttention() {
  const step = usePresenterStep(5);

  return (
    <Slide eyebrow="第二章 · Transformer" title="自注意力机制：模型如何动态聚焦一句话">
      <div className="grid h-full grid-rows-[1fr_auto] gap-4">
        <div className="grid grid-cols-[520px_1fr] gap-5">
          <div className="flex flex-col gap-3">
            <Reveal show={step >= 1} variant="rise">
              <Callout tone="info" title="原理先行">
                每生成一个词，模型都会回看全句，并动态计算注意力权重：
                <span className="font-semibold text-ink">谁更相关，谁权重更高</span>。
              </Callout>
            </Reveal>

            <Reveal show={step >= 1} variant="rise" delay={0.04}>
              <div className="rounded-xl border-l-4 border-brand-orange bg-white p-4 shadow-sm">
                <div className="font-display text-[11px] tracking-[0.22em] text-brand-orange uppercase">
                  案例句
                </div>
                <div className="mt-2 font-serif text-[22px] leading-relaxed text-ink">
                  “小明拿起桌上的苹果，他尝试咬了一口，他说
                  <span className="rounded bg-brand-orange/15 px-1.5 py-0.5 font-semibold text-brand-orange">
                    ____
                  </span>
                  ”
                </div>
              </div>
            </Reveal>

            <Reveal show={step >= 2} variant="rise">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-lg border border-ink/10 bg-white px-3 py-2.5">
                  <div className="font-display text-[11px] text-ink/55">STEP 2</div>
                  <div className="font-serif text-[14px] text-ink/85">“他”锁定“小明”</div>
                </div>
                <div className="rounded-lg border border-ink/10 bg-white px-3 py-2.5">
                  <div className="font-display text-[11px] text-ink/55">STEP 3</div>
                  <div className="font-serif text-[14px] text-ink/85">“咬”关联“他 + 苹果”</div>
                </div>
                <div className="rounded-lg border border-ink/10 bg-white px-3 py-2.5">
                  <div className="font-display text-[11px] text-ink/55">STEP 4</div>
                  <div className="font-serif text-[14px] text-ink/85">“说____”做语义补全</div>
                </div>
              </div>
            </Reveal>

            <Reveal show={step >= 3} variant="rise">
              <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
                <div className="font-display text-[11px] tracking-[0.18em] text-brand-orange uppercase">
                  Multi-Head Attention
                </div>
                <div className="mt-2 font-serif text-[14px] leading-relaxed text-ink/72">
                  不是一个视角在看句子，而是多个注意力头并行工作：有的关注指代关系，
                  有的关注动作与对象，有的关注语气和句法。最后合并各头结果，得到更稳的理解。
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {["指代关系", "动作对象", "语气句法"].map((item) => (
                    <div
                      key={item}
                      className="rounded-md border border-ink/10 bg-cream px-2.5 py-1.5 text-center text-[12px] text-ink/68"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal show={step >= 4} variant="rise">
              <div className="rounded-lg bg-mute-100 px-3 py-2.5 font-serif text-[14px] leading-relaxed text-ink/75">
                讲解提示：Self-Attention 不是按顺序死读，而是不断重算“当前词与全句词的关联强弱”。
              </div>
            </Reveal>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-white p-4 shadow-sm">
            <AttentionMatrix activeStep={step} />
          </div>
        </div>

        {step >= 5 && (
          <Reveal show variant="rise">
            <div className="rounded-xl border border-brand-green/30 bg-brand-green/10 px-5 py-3">
              <div className="font-display text-[11px] tracking-[0.2em] text-brand-green uppercase">
                生成结果
              </div>
              <div className="mt-1 flex items-end justify-between">
                <div className="font-serif text-[18px] leading-relaxed text-ink/85">
                  模型综合“苹果 + 咬一口 + 他说____”的上下文后，完成补全：
                </div>
                <div className="font-display text-[36px] font-bold text-brand-green">很甜</div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </Slide>
  );
}
