import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { Phone, MessageSquare, Sparkles, Bot } from "lucide-react";

const STAGES = [
  {
    icon: Phone,
    era: "第一代",
    title: "按键迷宫",
    desc: "「您好，查询余额请按 1，转账请按 2…」",
    scene: "你只想改个账单地址，却要在层层菜单里反复重来。",
    insight: "本质是写死的决策树。",
    color: "#9b8770",
  },
  {
    icon: MessageSquare,
    era: "第二代",
    title: "关键词机器",
    desc: "认得「账单」，但不懂「钱去哪了」。",
    scene: "你换了说法，它就听不懂；你说得越自然，它越容易跑偏。",
    insight: "可以聊天，但不会理解。",
    color: "#6a9bcc",
  },
  {
    icon: Sparkles,
    era: "今天",
    title: "LLM 客服",
    desc: "听得懂多种说法，能给出理财建议。",
    scene: "你像在和真人沟通，系统能接住语气、上下文和隐含诉求。",
    insight: "真正『听懂』了你说话。",
    color: "#788c5d",
  },
  {
    icon: Bot,
    era: "未来",
    title: "AI Agent",
    desc: "主动发现定存到期，全程替你办完。",
    scene: "你只说『帮我把收益最大化』，它会自动规划、执行并回报进度。",
    insight: "你说目标，它替你办事。",
    color: "#d97757",
  },
];

export default function Slide01Preface() {
  const step = usePresenterStep(4);
  return (
    <Slide
      eyebrow="序篇 · 开篇故事"
      title={<>银行客服三十年：从「按 1 按 2」到「替你办完」</>}
    >
      <div className="flex h-full min-h-0 flex-col gap-6">
        <div className="grid min-h-0 flex-1 grid-cols-4 gap-6">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.era} show={step >= idx + 1} delay={0.05 * idx}>
                <div
                  className="flex h-full flex-col gap-3 rounded-2xl border border-ink/8 bg-white p-6 shadow-sm"
                  style={{ borderTop: `4px solid ${s.color}` }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${s.color}20`, color: s.color }}
                    >
                      <Icon size={24} strokeWidth={1.6} />
                    </div>
                    <span
                      className="font-display text-[12px] tracking-[0.25em]"
                      style={{ color: s.color }}
                    >
                      {s.era}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="font-display text-[25px] font-semibold leading-tight text-ink">
                      {s.title}
                    </div>
                    <p className="font-serif text-[15px] leading-relaxed text-ink/72">
                      {s.desc}
                    </p>
                    <p className="font-serif text-[14px] leading-relaxed text-ink/62">
                      {s.scene}
                    </p>
                  </div>
                  <div className="mt-auto border-t border-ink/8 pt-3">
                    <div
                      className="mb-1 font-display text-[11px] tracking-[0.2em]"
                      style={{ color: s.color }}
                    >
                      INSIGHT
                    </div>
                    <div className="font-serif text-[14px] text-ink/84">
                      {s.insight}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {step >= 4 && (
          <Reveal show>
            <Callout tone="insight" title="三级跨越">
              从「按键迷宫」到「听懂你说话」到「主动替你办事」——
              这背后是一整条<span className="font-semibold text-brand-orange">技术栈的范式跃迁</span>，也是这次分享的主线。
            </Callout>
          </Reveal>
        )}
      </div>
    </Slide>
  );
}
