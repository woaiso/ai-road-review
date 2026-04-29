import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";
import { palette } from "@/lib/theme";

/** 工具调用执行序列：声明 → 调用 → 结果 → 调用 */
const EXEC_STEPS = [
  {
    tag: "工具声明",
    bg: "bg-ink/5",
    border: "border-ink/15",
    label: "text-ink/55",
    content: [
      "get_weather(city)  → 查询天气",
      "send_email(to, subject, body)  → 发邮件",
      "search_db(query)  → 查询数据库",
    ],
  },
  {
    tag: "Tool Call #1",
    bg: "bg-[#1f1d1b]",
    border: "border-ink/0",
    label: "text-brand-orange",
    content: [
      '{ "tool": "get_weather",',
      '  "params": { "city": "北京",',
      '              "date": "明天" } }',
    ],
  },
  {
    tag: "Tool Result",
    bg: "bg-brand-green/10",
    border: "border-brand-green/30",
    label: "text-brand-green",
    content: ["晴，18 ~ 26°C"],
  },
  {
    tag: "Tool Call #2",
    bg: "bg-[#1f1d1b]",
    border: "border-ink/0",
    label: "text-brand-orange",
    content: [
      '{ "tool": "send_email",',
      '  "params": { "to": "laowang@..",',
      '    "body": "明天晴，宜出行" } }',
    ],
  },
];

/** 三原则 */
const PRINCIPLES = [
  {
    num: "01",
    title: "单一职责",
    color: palette.orange,
    bgClass: "bg-brand-orange/8 border-brand-orange/30",
    desc: "一个工具只做一件事。`send_email` 只发邮件，不混入检索逻辑。",
  },
  {
    num: "02",
    title: "幂等性",
    color: palette.blue,
    bgClass: "bg-brand-blue/8 border-brand-blue/30",
    desc: "可重试操作需幂等，避免模型重试导致重复扣款、重复发信等副作用。",
  },
  {
    num: "03",
    title: "错误处理",
    color: palette.green,
    bgClass: "bg-brand-green/8 border-brand-green/30",
    desc: "失败要返回可解释错误，便于模型选择重试、降级或向用户反馈。",
  },
];

export default function Slide17Ch71OutOfSandbox() {
  const step = usePresenterStep(5);

  return (
    <Slide
      eyebrow="第七章 · Tool / 工具"
      title="Tool：让模型从「说」变成「做」"
    >
      <div className="grid h-full grid-cols-[1.1fr_1fr] gap-6">

        {/* ══ 左列：走出沙箱 + 典型场景 + 工具声明 ══ */}
        <div className="flex flex-col gap-4">

          {/* Step 1 · 核心概念 */}
          <Reveal show={step >= 1} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <div className="mb-3 font-display text-[13px] tracking-[0.22em] text-brand-orange uppercase">
                孤岛 → 连接现实世界
              </div>
              <p className="mb-4 font-serif text-[16px] leading-relaxed text-ink/82">
                没有 Tool 的 LLM，像一个只能"说"不能"做"的人。<br />
                有了 Tool，它可以真正<strong>调用外部能力、产生副作用</strong>。
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "查实时天气与市场信息",
                  "调用数据库、检索文档",
                  "执行通知、发邮件、写入系统",
                  "把「回答问题」升级为「完成任务」",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg bg-ink/5 px-3 py-2 font-serif text-[14px] text-ink/75"
                  >
                    · {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Step 2 · 用户任务（Function Calling 入口） */}
          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="mb-2 font-display text-[13px] tracking-[0.22em] text-brand-orange uppercase">
                示例用户任务
              </div>
              <div className="space-y-2">
                <div className="rounded-xl bg-ink/5 px-4 py-3 font-serif text-[16px] text-ink/80">
                  "帮我查一下明天北京的天气，然后发邮件给老王。"
                </div>
                <div className="flex items-center gap-2 px-1">
                  <div className="h-px flex-1 bg-ink/10" />
                  <span className="font-display text-[12px] text-ink/40 uppercase tracking-wider">
                    模型识别意图 → 分两步调用工具
                  </span>
                  <div className="h-px flex-1 bg-ink/10" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Step 4 · 三大原则 */}
          <Reveal show={step >= 4} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="mb-3 font-display text-[13px] tracking-[0.22em] text-brand-orange uppercase">
                好工具三原则
              </div>
              <div className="space-y-2">
                {PRINCIPLES.map((p, i) => (
                  <motion.div
                    key={p.num}
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${p.bgClass}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={step >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                    transition={{ duration: 0.4, delay: 0.1 * i, ease }}
                  >
                    <div
                      className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-cream"
                      style={{ backgroundColor: p.color }}
                    >
                      <span className="font-display text-[11px] font-bold">{p.num}</span>
                    </div>
                    <div>
                      <div className="font-display text-[15px] font-semibold text-ink">
                        {p.title}
                      </div>
                      <div className="font-serif text-[13px] leading-relaxed text-ink/68">
                        {p.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ══ 右列：Function Calling 执行序列 + 结论 ══ */}
        <div className="flex flex-col gap-4">

          {/* Step 3 · Function Calling 执行序列 */}
          <Reveal show={step >= 3} variant="slide-left">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="mb-3 font-display text-[13px] tracking-[0.22em] text-brand-orange uppercase">
                Function Calling 执行序列
              </div>
              <div className="space-y-2">
                {EXEC_STEPS.map((s, i) => (
                  <motion.div
                    key={s.tag}
                    initial={{ opacity: 0, y: 8 }}
                    animate={step >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.4, delay: 0.1 * i, ease }}
                  >
                    <div
                      className={`rounded-xl border px-4 py-3 ${s.bg} ${s.border}`}
                    >
                      <div className={`mb-1 font-display text-[11px] tracking-widest uppercase ${s.label}`}>
                        {s.tag}
                      </div>
                      {s.content.map((line) => (
                        <div
                          key={line}
                          className={`font-mono text-[13px] leading-relaxed ${
                            s.bg.includes("1f1d1b") ? "text-cream/85" : "text-ink/80"
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Step 5 · 结论 */}
          <Reveal show={step >= 5} variant="rise">
            <Callout tone="insight" title="工程落点">
              好工具不是"能跑一次"，而是"在失败、重试、并发下仍可控"。
              <br />
              <span className="text-[15px] text-ink/60">
                Tool 是模型走向执行的第一步：先有"能动手"的能力，再谈多步决策与闭环。
              </span>
            </Callout>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
