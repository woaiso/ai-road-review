import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { Callout } from "@/components/Callout";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";
import { palette } from "@/lib/theme";
import { XCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

/** 三种提示形态：名称 / 副标题 / 质量分 / 示例文本 */
const FORMS = [
  {
    tag: "Zero-shot",
    sub: "直接问",
    quality: 38,
    barColor: palette.mute400,
    bgClass: "bg-ink/5 border-ink/15",
    labelColor: "text-ink/65",
    example: `帮我写个道歉短信`,
    effect: "能写，但风格与结构全靠运气",
  },
  {
    tag: "Few-shot",
    sub: "给几个例子",
    quality: 70,
    barColor: palette.blue,
    bgClass: "bg-brand-blue/8 border-brand-blue/20",
    labelColor: "text-brand-blue",
    example: `像这样写：
"不好意思今天临时…"
帮我写给客户的`,
    effect: "风格对齐，格式可控",
  },
  {
    tag: "CoT",
    sub: "一步步思考",
    quality: 94,
    barColor: palette.orange,
    bgClass: "bg-brand-orange/8 border-brand-orange/20",
    labelColor: "text-brand-orange",
    example: `先想：对方情绪、
我该承认什么、
怎么挽回，然后写`,
    effect: "推理路径外显，质量大幅提升",
  },
] as const;

export default function Slide08Ch41PromptContract() {
  const step = usePresenterStep(5);

  return (
    <Slide
      eyebrow="第四章 · Prompt 工程"
      title={
        <>
          Prompt：你给 AI 的<span className="text-brand-orange">任务说明书</span>
        </>
      }
    >
      <div className="grid h-full grid-cols-[1.3fr_1fr] gap-6">
        {/* ══════════════════════════════
            左列：定义 → 场景对比 → 三种形态
            ══════════════════════════════ */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* Step 1 · 定义 + 类比 */}
          <Reveal show={step >= 1} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-[38px] leading-none flex-shrink-0 mt-0.5">🧑‍💼</span>
                <div>
                  <div className="font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase mb-1">
                    核心类比
                  </div>
                  <p className="font-serif text-[16px] leading-relaxed text-ink/82">
                    AI 就像新来的实习生——
                    <strong className="text-ink">你说得越清楚，它干得越准。</strong>
                  </p>
                  <p className="mt-1 font-serif text-[13px] text-ink/55">
                    唯一区别：它不会主动问"这是什么意思"，只会按你写的猜，猜错了闷头交差。
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Step 2 · 外卖场景对比 */}
          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="font-display text-[12px] tracking-[0.2em] text-brand-orange uppercase mb-3">
                🍜 一个场景说透
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* 烂 Prompt */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <XCircle size={14} className="text-red-400 flex-shrink-0" />
                    <span className="font-display text-[13px] text-ink/80">模糊指令</span>
                  </div>
                  <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                    <div className="font-mono text-[13px] text-red-700 leading-relaxed">
                      "帮我订个吃的"
                    </div>
                  </div>
                  <div className="font-serif text-[12px] text-ink/55 leading-relaxed px-0.5">
                    实习生懵了——辣的？多少钱？哪家？什么时候？只能随便订，大概率不对。
                  </div>
                </div>
                {/* 好 Prompt */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                    <span className="font-display text-[13px] text-ink/80">明确指令</span>
                  </div>
                  <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                    <div className="font-mono text-[13px] text-green-800 leading-relaxed">
                      "美团，20元内沙县<br />番茄蛋花汤+炒饭<br />12点前，不要香菜"
                    </div>
                  </div>
                  <div className="font-serif text-[12px] text-ink/55 leading-relaxed px-0.5">
                    立刻明白，执行完美。你写得越具体，它完成得越稳。
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Step 3 · 三种提示形态（含动效质量条） */}
          <Reveal show={step >= 3} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="font-display text-[12px] tracking-[0.2em] text-brand-orange uppercase mb-3">
                三种说话方式 · 效果递进 →
              </div>
              <div className="flex gap-3">
                {FORMS.map((f, i) => (
                  <div key={f.tag} className="flex-1 flex flex-col gap-2">
                    {/* 质量进度条（从 0 动画到目标宽度） */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-ink/8 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: f.barColor }}
                          initial={{ width: 0 }}
                          animate={step >= 3 ? { width: `${f.quality}%` } : { width: 0 }}
                          transition={{ duration: 0.9, delay: 0.15 * i, ease }}
                        />
                      </div>
                      <span
                        className="font-mono text-[11px] tabular-nums"
                        style={{ color: f.barColor }}
                      >
                        {f.quality}%
                      </span>
                    </div>
                    {/* 卡片正文 */}
                    <div className={`rounded-xl border p-3 flex flex-col gap-2 flex-1 ${f.bgClass}`}>
                      <div>
                        <div className={`font-display text-[13px] font-semibold text-ink`}>
                          {f.tag}
                        </div>
                        <div className={`font-serif text-[12px] ${f.labelColor}`}>{f.sub}</div>
                      </div>
                      {/* 示例 Prompt（仿终端风格） */}
                      <div className="rounded-lg bg-ink/8 px-2.5 py-2 font-mono text-[11px] leading-relaxed text-ink/75 whitespace-pre-wrap">
                        {f.example}
                      </div>
                      <div className="font-serif text-[11px] text-ink/58">
                        → {f.effect}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ══════════════════════════════
            右列：System Prompt 可视化 + 结论
            ══════════════════════════════ */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* Step 4 · System Prompt 层叠可视化 */}
          <Reveal show={step >= 4} variant="slide-left">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="font-display text-[12px] tracking-[0.2em] text-brand-orange uppercase mb-4">
                隐藏层：System Prompt
              </div>

              {/* Layer 1 - System Prompt（灰色锁定区） */}
              <div className="flex items-start gap-3 mb-2">
                <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-ink/8">
                  <EyeOff size={13} className="text-ink/45" />
                </div>
                <div className="flex-1 rounded-xl border border-dashed border-ink/20 bg-ink/5 px-3 py-2.5">
                  <div className="font-display text-[11px] tracking-widest text-ink/45 uppercase mb-1">
                    SYSTEM · 用户看不见
                  </div>
                  <p className="font-mono text-[12px] leading-relaxed text-ink/65">
                    你是高端酒店客服；语气温暖专业；不讨论竞争对手；不透露折扣政策；回答控制在 100 字内。
                  </p>
                </div>
              </div>

              {/* 连线 */}
              <div className="ml-[13px] h-4 flex items-center">
                <div className="w-px h-full bg-ink/15" />
              </div>

              {/* Layer 2 - 用户消息 */}
              <div className="flex items-start gap-3 mb-2">
                <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-brand-orange/15">
                  <Eye size={13} className="text-brand-orange" />
                </div>
                <div className="flex-1 self-end">
                  <div className="font-display text-[11px] tracking-widest text-brand-orange uppercase mb-1">
                    USER VIEW
                  </div>
                  <div className="self-end max-w-[90%] ml-auto">
                    <div className="rounded-2xl rounded-tr-sm bg-brand-blue/15 px-4 py-2.5 font-serif text-[14px] text-ink">
                      你们有没有更便宜的房型？
                    </div>
                  </div>
                </div>
              </div>

              {/* 连线 */}
              <div className="ml-[13px] h-4 flex items-center">
                <div className="w-px h-full bg-ink/15" />
              </div>

              {/* Layer 3 - AI 回复 */}
              <div className="flex items-start gap-3">
                <div
                  className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md"
                  style={{ background: palette.ink }}
                >
                  <span className="font-display text-[10px] text-cream/70 font-semibold">AI</span>
                </div>
                <div
                  className="flex-1 rounded-2xl rounded-tl-sm px-4 py-3 text-cream/90"
                  style={{ background: `linear-gradient(135deg, ${palette.ink} 0%, #3a2c25 100%)` }}
                >
                  <div className="font-serif text-[13px] leading-relaxed">
                    您好，感谢来电～目前有
                    <strong className="text-brand-orange"> 行政房</strong>与
                    <strong className="text-brand-orange"> 高级豪华房</strong>
                    两种入门选择，含双人早餐。请告知入住日期，我立刻为您查询 🌿
                  </div>
                  <div className="mt-1.5 font-display text-[11px] text-brand-orange/70 tracking-widest">
                    100字内 · 温暖专业 · 不透露折扣
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-ink/5 px-3 py-2 font-serif text-[13px] text-ink/65 leading-relaxed">
                同样问题 + 不同 System Prompt → 风格、边界、语气完全不同。这就是产品个性的来源。
              </div>
            </div>
          </Reveal>

          {/* Step 5 · 结论 */}
          <Reveal show={step >= 5} variant="rise">
            <Callout tone="insight" title="核心结论">
              你有多清楚，AI 就有多准。
              <br />
              <span className="text-[15px] text-ink/65">
                Prompt 不是随便问一句——写得清晰，一次过；写得含糊，它只会猜。
              </span>
            </Callout>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
