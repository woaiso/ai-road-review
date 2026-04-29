import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { CodeBlock } from "@/components/CodeBlock";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/** Skill 三要素 */
const SKILL_PARTS = [
  {
    num: "1",
    title: "触发条件",
    desc: "什么场景应该调用该 Skill",
    color: "text-brand-orange",
    bg: "bg-brand-orange/8 border-brand-orange/30",
  },
  {
    num: "2",
    title: "执行步骤",
    desc: "先做什么、后做什么、异常如何处理",
    color: "text-brand-blue",
    bg: "bg-brand-blue/8 border-brand-blue/30",
  },
  {
    num: "3",
    title: "输出格式",
    desc: "结果长什么样，如何验收达标",
    color: "text-brand-green",
    bg: "bg-brand-green/8 border-brand-green/30",
  },
];

/** 生命周期四阶段 */
const LIFECYCLE = [
  { title: "起草", desc: "写最小可用版，明确触发/步骤/输出" },
  { title: "测试", desc: "用 2~3 个真实请求做小样本验证" },
  { title: "迭代", desc: "按失败样例改描述与流程，不只改措辞" },
  { title: "扩展", desc: "稳定后扩场景，沉淀为团队标准资产" },
];

/** 典型 Skill 资产 */
const SKILL_LIB = [
  { name: "Code-Review",    desc: "代码评审" },
  { name: "PRD-Writing",    desc: "产品需求文档" },
  { name: "Tech-Review",    desc: "技术方案评审" },
  { name: "Weekly-Report",  desc: "周报生成" },
  { name: "Bug-Triage",     desc: "缺陷分级与分派" },
  { name: "Incident-Recap", desc: "故障复盘" },
];

export default function Slide29Ch101SkillOverview() {
  const step = usePresenterStep(5);

  return (
    <Slide
      eyebrow="第十章 · Agent Skills"
      title="Skill：为智能体赋予全新能力与专业技能的标准化方式"
    >
      <div className="flex h-full flex-col gap-3">
        <Reveal show={step >= 0} variant="rise">
          <div className="rounded-2xl border border-brand-orange/25 bg-brand-orange/5 px-4 py-2 shadow-sm">
            <div className="flex items-center gap-2 font-display text-[12px] text-ink/80">
              <span className="rounded-md bg-white/75 px-2 py-0.5 font-semibold text-ink">Anthropic · 2025 年 10 月推出</span>
              <span className="text-ink/35">|</span>
              <span>2025 年 9 月 · Claude Sonnet 4.5</span>
              <span className="text-ink/35">|</span>
              <span>2025 年 10 月 · Claude Haiku 4.5</span>
              <span className="text-ink/35">|</span>
              <span>2025 年 11 月 · Claude Opus 4.5</span>
            </div>
          </div>
        </Reveal>

        <div className="grid flex-1 grid-cols-[1.05fr_1fr] gap-5">

          {/* ══ 左列：Why Skill → 三要素 → 组织收益 ══ */}
          <div className="flex flex-col gap-3">

          {/* Step 1 · Why Skill：定义 + RAG vs Skill */}
          <Reveal show={step >= 1} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-3 font-serif text-[14px] leading-relaxed text-ink/80">
                同样任务换个人或换提示词，结果质量就飘。
                <strong> Skill 的价值是把"做法"沉淀成可复用标准</strong>，不只是知道答案，而是知道怎么做到位。
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-ink/5 p-3">
                  <div className="font-display text-[13px] font-semibold text-ink/60">RAG</div>
                  <div className="mt-0.5 font-serif text-[12px] text-ink/60">图书馆：解决"知道什么"</div>
                </div>
                <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/10 p-3">
                  <div className="font-display text-[13px] font-semibold text-brand-orange">Skill</div>
                  <div className="mt-0.5 font-serif text-[12px] text-ink/75">SOP：解决"怎么做才对"</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Step 2 · Skill 三要素 */}
          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                Skill 三要素
              </div>
              <div className="space-y-2">
                {SKILL_PARTS.map((p, i) => (
                  <motion.div
                    key={p.num}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${p.bg}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={step >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.35, delay: 0.1 * i, ease }}
                  >
                    <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white/60 font-display text-[13px] font-bold ${p.color}`}>
                      {p.num}
                    </div>
                    <div>
                      <span className={`font-display text-[14px] font-semibold ${p.color}`}>{p.title}</span>
                      <span className="ml-2 font-serif text-[12px] text-ink/60">{p.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Step 4 · 组织收益 */}
          <Reveal show={step >= 4} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                组织收益
              </div>
              <ul className="space-y-2">
                {[
                  "新人上手更快，减少隐性知识损耗",
                  "同类任务输出更一致，可量化评估",
                  "复盘可定位到触发或步骤缺陷",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 font-serif text-[13px] text-ink/75">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-orange/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Step 5 · 典型资产标签 */}
          <Reveal show={step >= 5} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                典型 Skill 资产
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SKILL_LIB.map((s, i) => (
                  <motion.div
                    key={s.name}
                    className="rounded-lg border border-brand-orange/20 bg-brand-orange/8 px-3 py-2"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={step >= 5 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.3, delay: 0.06 * i, ease }}
                  >
                    <div className="font-mono text-[12px] font-semibold text-brand-orange">{s.name}</div>
                    <div className="font-serif text-[11px] text-ink/60">{s.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
          </div>

          {/* ══ 右列：示例 → 生命周期 → 典型资产 ══ */}
          <div className="flex flex-col gap-3">

          {/* Step 3 · CodeBlock 代码 Review Skill 示例 */}
          <Reveal show={step >= 3} variant="slide-left">
            <CodeBlock
              language="yaml"
              caption="SKILL.md 标准格式示例：代码 Review"
              code={`---\nname: code-review\ndescription: >\n  用户请求"评审/审查/检查代码质量/\n  安全检查"时触发\ntools: [github, fetch_url]\n---\n\n## Instructions\n\n### 1. 理解意图\n通读代码，明确作者目标与上下文。\n\n### 2. 按维度检查\n- 可读性、命名与注释\n- 边界条件与异常处理\n- 性能瓶颈与安全漏洞\n\n### 3. 输出格式\n[严重] <问题> → <修改建议>\n[建议] <问题> → <修改建议>`}
            />
          </Reveal>

          {/* Step 4 · 生命周期横向流 */}
          <Reveal show={step >= 4} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-3 font-display text-[12px] tracking-[0.22em] text-ink/45 uppercase">
                生命周期
              </div>
              <div className="flex items-start gap-1">
                {LIFECYCLE.map((lc, i) => (
                  <div key={lc.title} className="flex flex-1 items-start gap-1">
                    <motion.div
                      className="flex-1 text-center"
                      initial={{ opacity: 0, y: 5 }}
                      animate={step >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                      transition={{ duration: 0.3, delay: 0.1 * i, ease }}
                    >
                      <div className="mb-1 font-display text-[15px] font-semibold text-ink">{lc.title}</div>
                      <div className="font-serif text-[11px] leading-snug text-ink/55">{lc.desc}</div>
                    </motion.div>
                    {i < LIFECYCLE.length - 1 && (
                      <div className="mt-1.5 flex-shrink-0 font-display text-[14px] text-ink/25">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          </div>
        </div>
      </div>
    </Slide>
  );
}
