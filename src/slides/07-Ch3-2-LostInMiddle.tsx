import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { motion } from "framer-motion";

/**
 * Lost in the Middle 可视化：
 *  - U 形曲线：开头与结尾召回率高，中间低
 *  - step 1：画曲线
 *  - step 2：高亮"中间凹陷"区域
 */
export default function LostInMiddle() {
  const step = usePresenterStep(2);
  return (
    <Slide
      eyebrow="第三章 · 位置偏置"
      title={
        <>
          <span className="text-brand-orange">Lost in the Middle</span>：中间信息为何更容易「消失」
        </>
      }
    >
      <div className="grid h-full grid-cols-[1.4fr_1fr] gap-10">
        {/* 左：U 形曲线 */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-ink/8">
          <div className="font-display text-[12px] tracking-[0.3em] text-brand-orange mb-2">
            实证发现
          </div>
          <div className="font-display text-[22px] font-semibold text-ink mb-3">
            上下文不同位置的"召回准确率"
          </div>

          <svg viewBox="0 0 800 460" className="w-full">
            {/* 坐标轴 */}
            <line x1={70} y1={400} x2={770} y2={400} stroke="#cdc7bb" strokeWidth={2} />
            <line x1={70} y1={40} x2={70} y2={400} stroke="#cdc7bb" strokeWidth={2} />
            {/* 标签 */}
            <text x={70} y={425} fontSize={12} fill="#a8a194" fontFamily="Poppins" textAnchor="middle">开头</text>
            <text x={420} y={425} fontSize={12} fill="#a8a194" fontFamily="Poppins" textAnchor="middle">中间</text>
            <text x={770} y={425} fontSize={12} fill="#a8a194" fontFamily="Poppins" textAnchor="middle">结尾</text>
            <text x={400} y={448} fontSize={13} fill="#5a544a" fontFamily="Poppins" fontWeight={600} textAnchor="middle">
              信息所在位置 →
            </text>
            <text x={30} y={220} fontSize={13} fill="#5a544a" fontFamily="Poppins" fontWeight={600} textAnchor="middle" transform="rotate(-90 30 220)">
              召回准确率 ↑
            </text>

            {/* 中间凹陷高亮区 */}
            {step >= 2 && (
              <motion.rect
                x={250}
                y={40}
                width={340}
                height={360}
                fill="#d97757"
                opacity={0.08}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.08 }}
              />
            )}

            {/* U 形曲线 */}
            <motion.path
              d="M 80 80 C 180 90, 240 230, 420 320 C 580 230, 660 90, 760 80"
              stroke="#d97757"
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: step >= 1 ? 1 : 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* 端点和谷底标注 */}
            {step >= 1 && (
              <>
                <circle cx={80} cy={80} r={8} fill="#788c5d" />
                <text x={95} y={70} fontSize={13} fontFamily="Poppins" fontWeight={600} fill="#788c5d">高召回</text>

                <circle cx={760} cy={80} r={8} fill="#788c5d" />
                <text x={755} y={70} fontSize={13} fontFamily="Poppins" fontWeight={600} fill="#788c5d" textAnchor="end">高召回</text>
              </>
            )}
            {step >= 2 && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
                style={{ transformOrigin: "420px 320px" }}
              >
                <circle cx={420} cy={320} r={10} fill="#d97757" />
                <line x1={420} y1={320} x2={420} y2={150} stroke="#d97757" strokeWidth={1.2} strokeDasharray="3 3" />
                <rect x={355} y={120} width={130} height={30} rx={4} fill="#d97757" />
                <text x={420} y={140} fontSize={13} fontFamily="Poppins" fontWeight={600} fill="#faf9f5" textAnchor="middle">
                  ⬇ 中间被遗忘
                </text>
              </motion.g>
            )}
          </svg>
        </div>

        {/* 右：解读 + 实践 */}
        <div className="flex flex-col gap-5">
          <Reveal show={step >= 1} variant="rise">
            <Callout tone="quote" title="开会的隐喻">
              主持人的<strong>第一句</strong>和总结人的<strong>最后一句</strong>大家都记得清楚，
              中间两小时的讨论？只剩几个关键词。
            </Callout>
          </Reveal>

          <Reveal show={step >= 2} variant="rise" delay={0.1}>
            <div className="space-y-3">
              <div className="rounded-2xl bg-white p-7 shadow-sm border border-ink/8">
                <div className="font-display text-[12px] tracking-[0.3em] text-brand-orange mb-3">
                  工程实践
                </div>
                <ul className="space-y-3 font-serif text-[16px] text-ink/80">
                  <li>
                    <strong className="text-ink">1.</strong> 把
                    <strong className="text-brand-orange">最关键的指令</strong>
                    放在 Prompt 的<strong>开头或结尾</strong>。
                  </li>
                  <li>
                    <strong className="text-ink">2.</strong> 重要信息适当
                    <strong className="text-brand-orange">重复</strong>或<strong>显式编号</strong>。
                  </li>
                  <li>
                    <strong className="text-ink">3.</strong> 对超长文档使用
                    <strong className="text-brand-orange">RAG</strong>而不是全文塞入。
                  </li>
                </ul>
              </div>
              {/* 原理补充：解释位置效应来自注意力分配 */}
              <div className="rounded-xl border border-ink/10 bg-white/75 px-4 py-3">
                <div className="font-display text-[11px] tracking-[0.16em] text-ink/55 uppercase">
                  原理补充 · GEN-NOTE §2.2 / §6
                </div>
                <div className="mt-1 font-serif text-[14px] leading-relaxed text-ink/72">
                  注意力在长上下文中会受位置与语义共同影响，排序与结构化组织通常比“无脑加长上下文”更有效。
                </div>
                <div className="mt-2 space-y-1.5 font-serif text-[13px] leading-relaxed text-ink/68">
                  <div>讲解抓手 1：把关键约束放头尾，能显著降低中段信息衰减风险。</div>
                  <div>讲解抓手 2：长文优先分块检索与重组，不建议整段原样塞入。</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
