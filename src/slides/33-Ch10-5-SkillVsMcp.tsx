import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/** Token 成本对比数据：Skill / MCP 对 context 占用的影响 */
const TOKEN_ROWS = [
  {
    label: "无 Skill（每次写详细指令）",
    pct: 95,
    barClass: "bg-brand-orange",
    tag: "高",
    tagClass: "text-brand-orange",
  },
  {
    label: "有 Skill（引用模板，精简上下文）",
    pct: 32,
    barClass: "bg-brand-green",
    tag: "低",
    tagClass: "text-brand-green",
  },
  {
    label: "MCP 全量 Schema 塞进上下文",
    pct: 78,
    barClass: "bg-brand-orange",
    tag: "较高",
    tagClass: "text-brand-orange",
  },
  {
    label: "MCP 渐进式披露（按需加载）",
    pct: 28,
    barClass: "bg-brand-green",
    tag: "低",
    tagClass: "text-brand-green",
  },
];

/** 真实场景选型 */
const SCENARIOS = [
  {
    title: "数仓 SQL 分析",
    skill: "统一口径、指标定义、SQL 模板",
    mcp: "连接 Hive / Spark / Trino 执行",
    tag: "Skill + MCP",
    tagClass: "bg-brand-blue/15 text-brand-blue",
  },
  {
    title: "创建 Redmine 任务",
    skill: "字段映射规范（有规范则加）",
    mcp: "调用 Redmine API 创建 Issue",
    tag: "优先 MCP",
    tagClass: "bg-brand-green/15 text-brand-green",
  },
  {
    title: "Git Flow 分支管理",
    skill: "命名规则、基线选取、关联任务号",
    mcp: "执行真实 git 动作、推送远端",
    tag: "Skill + MCP",
    tagClass: "bg-brand-blue/15 text-brand-blue",
  },
  {
    title: "Code Review",
    skill: "严重级别、风险分类、结论模板",
    mcp: "拉 PR / 读 diff / 回写评论",
    tag: "Skill + MCP",
    tagClass: "bg-brand-blue/15 text-brand-blue",
  },
];

/** 组合流程示例（发版复盘） */
const COMBO_STEPS = [
  { icon: "📦", action: "读发布记录", layer: "MCP Resource", color: "text-brand-green" },
  { icon: "📊", action: "抓告警与指标", layer: "MCP Tool", color: "text-brand-green" },
  { icon: "📝", action: "按模板输出结论", layer: "Skill 格式", color: "text-brand-orange" },
];

export default function Slide33Ch105SkillVsMcp() {
  const step = usePresenterStep(4);

  return (
    <Slide
      eyebrow="第十章 · Skill 与 MCP"
      title="分工边界：流程封装 × 能力接入"
    >
      <div className="grid h-full grid-cols-[1.05fr_1fr] gap-5">

        {/* ══ 左列：定义对比 + Token 成本可视化 ══ */}
        <div className="flex flex-col gap-4">

          {/* Step 1 · Skill vs MCP 定义 */}
          <Reveal show={step >= 1} variant="rise">
            <div className="grid grid-cols-2 gap-3">
              {/* Skill */}
              <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/8 p-4">
                <div className="mb-1 font-display text-[12px] tracking-[0.2em] text-brand-orange uppercase">Skill</div>
                <div className="mb-2 font-display text-[18px] font-semibold text-ink leading-tight">
                  这件事<br />怎么做才标准
                </div>
                <ul className="space-y-1 font-serif text-[12px] text-ink/70">
                  <li>· 流程标准化</li>
                  <li>· 输出结构统一</li>
                  <li>· 经验可复用</li>
                </ul>
              </div>
              {/* MCP */}
              <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/8 p-4">
                <div className="mb-1 font-display text-[12px] tracking-[0.2em] text-brand-blue uppercase">MCP</div>
                <div className="mb-2 font-display text-[18px] font-semibold text-ink leading-tight">
                  能不能稳定<br />连外部系统做
                </div>
                <ul className="space-y-1 font-serif text-[12px] text-ink/70">
                  <li>· 工具协议化接入</li>
                  <li>· 参数与权限治理</li>
                  <li>· 跨客户端复用</li>
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Step 2 · Token 成本对比可视化 */}
          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-3 font-display text-[12px] tracking-[0.22em] text-ink/50 uppercase">
                Token 成本对比（相对上下文占用）
              </div>
              <div className="space-y-3">
                {TOKEN_ROWS.map((row, i) => (
                  <div key={row.label}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-serif text-[12px] text-ink/70">{row.label}</span>
                      <span className={`font-display text-[12px] font-semibold ${row.tagClass}`}>
                        {row.tag}
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-ink/8">
                      <motion.div
                        className={`h-full rounded-full ${row.barClass}`}
                        initial={{ width: 0 }}
                        animate={step >= 2 ? { width: `${row.pct}%` } : { width: 0 }}
                        transition={{ duration: 0.7, delay: 0.12 * i, ease }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-ink/5 px-3 py-1.5 font-serif text-[11px] text-ink/55">
                Skill 精简指令 token；MCP 渐进式加载减少 Schema 占用 → 组合最优
              </div>
            </div>
          </Reveal>
        </div>

        {/* ══ 右列：场景选型 + 组合示例 ══ */}
        <div className="flex flex-col gap-4">

          {/* Step 3 · 真实场景选型 */}
          <Reveal show={step >= 3} variant="slide-left">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-3 font-display text-[12px] tracking-[0.22em] text-ink/50 uppercase">
                真实场景选型
              </div>
              <div className="space-y-2.5">
                {SCENARIOS.map((s, i) => (
                  <motion.div
                    key={s.title}
                    className="rounded-xl border border-ink/8 px-3 py-2.5"
                    initial={{ opacity: 0, x: 10 }}
                    animate={step >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                    transition={{ duration: 0.35, delay: 0.08 * i, ease }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-[14px] font-semibold text-ink">{s.title}</span>
                      <span className={`rounded-full px-2 py-0.5 font-display text-[11px] font-semibold ${s.tagClass}`}>
                        {s.tag}
                      </span>
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-x-3">
                      <div className="font-serif text-[11px] text-brand-orange/80">
                        <span className="font-semibold">Skill：</span>{s.skill}
                      </div>
                      <div className="font-serif text-[11px] text-brand-blue/80">
                        <span className="font-semibold">MCP：</span>{s.mcp}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Step 4 · 组合示例 + 结论 */}
          <Reveal show={step >= 4} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-ink/50 uppercase">
                组合示例：发版复盘
              </div>
              <div className="flex items-stretch gap-2">
                {COMBO_STEPS.map((s, i) => (
                  <motion.div
                    key={s.action}
                    className="flex flex-1 flex-col items-center rounded-xl bg-ink/4 px-2 py-3 text-center"
                    initial={{ opacity: 0, y: 6 }}
                    animate={step >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                    transition={{ duration: 0.35, delay: 0.1 * i, ease }}
                  >
                    <span className="text-[20px]">{s.icon}</span>
                    <div className="mt-1 font-display text-[12px] font-semibold text-ink">{s.action}</div>
                    <div className={`mt-0.5 font-display text-[11px] font-semibold ${s.color}`}>{s.layer}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal show={step >= 4} variant="rise">
            <Callout tone="insight" title="默认推荐">
              <strong>Skill 定义流程，MCP 提供动作。</strong>
              <br />
              <span className="text-[13px] text-ink/60">
                只要做法统一 → Skill；只要外部执行 → MCP；两者皆需 → 组合（默认推荐）。
              </span>
            </Callout>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
