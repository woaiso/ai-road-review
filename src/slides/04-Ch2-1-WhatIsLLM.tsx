import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const CONTEXT_TOKENS = ["用户", "问", "：", "上个月", "花了", "多少钱", "？"];
const GENERATED_TOKENS = ["你", "上个月", "总消费", "是", "12,480", "元", "。"];
const KEY_POINTS = [
  {
    title: "本质定义：LLM 是“下一个 Token 预测器”",
    bullets: [
      "不是先查到整段答案再复述，而是基于上下文一步步续写。",
      "读取上下文 -> 预测 next token -> 回灌上下文，循环直到成句。",
    ],
    accent: "border-l-brand-orange",
    badge: "01",
  },
  {
    title: "为什么看起来“像理解了你”",
    bullets: [
      "在海量语料中学到词与词、句与句的统计规律与衔接模式。",
      "所以它能在新语境重组表达，而不只是复读历史句子。",
    ],
    accent: "border-l-brand-blue",
    badge: "02",
  },
  {
    title: "规则系统 vs LLM（以及权重文件）",
    bullets: [
      "规则系统是命中返回；LLM 是概率连续生成，没见过原句也可合理组合。",
      "开源大模型真正稀缺的是权重（Weights）：参数化记忆而非人类可读词条。",
    ],
    accent: "border-l-brand-green",
    badge: "03",
  },
] as const;

export default function GenAIvsDict() {
  const step = usePresenterStep(3);
  const reduceMotion = useReducedMotion();
  return (
    <Slide
      eyebrow="第二章 · LLM 本质"
      title="续写引擎：一个会预测下一句的概率模型"
    >
      <div className="grid h-full min-h-0 grid-cols-[0.9fr_1.1fr] gap-8">
        <div className="flex min-h-0 flex-col gap-3">
          {KEY_POINTS.map((item, idx) => (
            <Reveal key={item.title} show={step >= idx + 1} variant="rise">
              <div
                className={`rounded-2xl border border-ink/10 border-l-4 ${item.accent} bg-gradient-to-br from-white to-mute-100/35 px-5 py-4 shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full border border-ink/15 bg-white px-2.5 py-0.5 font-mono text-[12px] text-ink/55">
                    {item.badge}
                  </div>
                  <div className="font-display text-[24px] font-semibold leading-tight text-ink">
                    {item.title}
                  </div>
                </div>
                <div className="mt-3 space-y-2 font-serif text-[18px] leading-relaxed text-ink/80">
                  <div>• {item.bullets[0]}</div>
                  <div>• {item.bullets[1]}</div>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal show={step >= 3} variant="rise">
            <div className="rounded-2xl border border-ink/12 bg-[#1f1d1b] px-5 py-4 text-cream shadow-md">
              <div className="font-display text-[13px] tracking-[0.16em] text-brand-orange uppercase">
                最小 LLM 结构（推理程序 + 权重文件）
              </div>
              <div className="mt-3 rounded-2xl border border-white/15 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-display text-[12px] tracking-[0.12em] text-cream/80 uppercase">
                    外层：推理程序（Runtime）
                  </div>
                  <div className="rounded-full border border-cream/20 bg-white/10 px-2 py-0.5 font-mono text-[11px] text-cream/75">
                    app / service
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-2 text-[12px] font-mono text-cream/85">
                  <span className="rounded bg-white/10 px-2 py-1">Tokenizer</span>
                  <ArrowRight size={13} className="text-cream/45" />
                  <span className="rounded bg-white/10 px-2 py-1">Transformer Forward</span>
                  <ArrowRight size={13} className="text-cream/45" />
                  <span className="rounded bg-white/10 px-2 py-1">Sampling</span>
                </div>

                <div className="my-2 flex items-center justify-center gap-2 text-brand-orange/90">
                  <ArrowRight size={14} className="rotate-90" />
                  <span className="font-display text-[10px] tracking-[0.12em] uppercase">加载权重</span>
                </div>

                <div className="rounded-xl border border-brand-orange/35 bg-brand-orange/10 px-4 py-3">
                  <div className="font-display text-[12px] tracking-[0.12em] text-brand-orange uppercase">
                    内层：权重文件（Weights）
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[12px] font-mono text-cream/92">
                    <div className="rounded border border-white/10 bg-white/8 px-2.5 py-1.5">token_embedding.weight</div>
                    <div className="rounded border border-white/10 bg-white/8 px-2.5 py-1.5">attention.{`{q,k,v,o}`}</div>
                    <div className="rounded border border-white/10 bg-white/8 px-2.5 py-1.5">ffn.{`{up,gate,down}`}</div>
                    <div className="rounded border border-white/10 bg-white/8 px-2.5 py-1.5">lm_head.weight</div>
                  </div>
                </div>
              </div>
              <div className="mt-2 font-serif text-[13px] leading-relaxed text-cream/82">
                结论：推理程序是“播放器”，权重文件是“音乐内容”。二者组合，才构成最小可用 LLM。
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal show={step >= 2} variant="slide-left" delay={0.04}>
          <div className="relative flex h-full min-h-0 flex-col rounded-2xl border border-ink/8 bg-[#1f1d1b] p-6 shadow-md">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(circle at 24% 14%, rgba(106,155,204,0.22), transparent 48%), radial-gradient(circle at 84% 82%, rgba(217,119,87,0.26), transparent 52%)",
              }}
            />
            <div className="relative z-10 mb-4 flex items-center justify-between">
              <div className="font-display text-[13px] tracking-[0.18em] text-brand-orange uppercase">
                核心动画 · 连续预测-连续生成
              </div>
              <div className="rounded-full border border-brand-orange/35 bg-brand-orange/15 px-3 py-1 font-mono text-[12px] text-brand-orange">
                LOOP
              </div>
            </div>

            <div className="relative z-10 grid grid-rows-[auto_auto_1fr] gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="font-display text-[11px] tracking-[0.16em] text-cream/65 uppercase">上下文窗口</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CONTEXT_TOKENS.map((token, idx) => (
                    <motion.span
                      key={`ctx-${token}-${idx}`}
                      className="rounded-md border border-white/12 bg-white/10 px-2.5 py-1.5 font-mono text-[13px] text-cream/90"
                      animate={
                        reduceMotion ? undefined : { y: [0, -3, 0], opacity: [0.65, 1, 0.7] }
                      }
                      transition={{
                        duration: 1.5,
                        delay: idx * 0.08,
                        repeat: reduceMotion ? 0 : Infinity,
                      }}
                    >
                      {token}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="rounded-xl border border-brand-blue/40 bg-brand-blue/20 px-3 py-3 text-center font-display text-[13px] tracking-[0.05em] text-cream">
                  预测 next token
                </div>
                <motion.div
                  animate={reduceMotion ? undefined : { x: [-2, 2, -2] }}
                  transition={{ duration: 0.7, repeat: reduceMotion ? 0 : Infinity }}
                >
                  <ArrowRight size={20} className="text-brand-orange" />
                </motion.div>
                <div className="rounded-xl border border-brand-orange/45 bg-brand-orange/20 px-3 py-3 text-center font-display text-[13px] tracking-[0.05em] text-cream">
                  回灌到上下文
                </div>
              </div>

              <div className="rounded-xl border border-brand-orange/35 bg-brand-orange/10 px-4 py-3">
                <div className="font-display text-[11px] tracking-[0.16em] text-brand-orange uppercase">
                  输出（逐 Token 生长）
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {GENERATED_TOKENS.map((token, idx) => (
                    <motion.span
                      key={`gen-${token}-${idx}`}
                      className="rounded-md border border-brand-orange/40 bg-white px-2.5 py-1.5 font-mono text-[14px] text-ink"
                      animate={
                        reduceMotion
                          ? { opacity: 1 }
                          : { opacity: [0.15, 1, 1], scale: [0.94, 1.06, 1] }
                      }
                      transition={{
                        duration: 1.05,
                        delay: idx * 0.22,
                        repeat: reduceMotion ? 0 : Infinity,
                        repeatDelay: 0.5,
                      }}
                    >
                      {token}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Slide>
  );
}
