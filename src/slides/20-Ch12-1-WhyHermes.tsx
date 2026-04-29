import { motion } from "framer-motion";
import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { ease } from "@/lib/motion";

/** 三层架构数据 */
const LAYERS = [
  {
    label: "接入层", name: "Gateway",
    desc: "多渠道归一化 · 身份与权限控制",
    color: "#6a9bcc",
  },
  {
    label: "智能层", name: "Agent Core",
    desc: "Prompt 组装 · 模型路由 · Skill/记忆调度",
    color: "#d97757",
  },
  {
    label: "执行层", name: "Backends",
    desc: "终端 / 浏览器 / 文件 / MCP 真实动作",
    color: "#788c5d",
  },
];

/** Hermes-Agent 六大设计原则 */
const DESIGNS = [
  { n: "①", text: "闭环学习：任务后提炼可复用做法" },
  { n: "②", text: "四层记忆：长期事实 / 偏好 / 会话档案 / 外部插件" },
  { n: "③", text: "Skill 按需注入：先索引候选，再命中展开正文" },
  { n: "④", text: "Skill 自动迭代：起草 → 修补 → 复用流水线" },
  { n: "⑤", text: "MCP 优化：按需暴露 · 参数预校验 · 结果标准化" },
  { n: "⑥", text: "智能/执行分离：安全边界更清晰，资源调度更灵活" },
];

/** Harness 六大能力映射 */
const MAPPINGS = [
  { cap: "编排", impl: "多步骤任务循环与路由决策" },
  { cap: "状态", impl: "会话持久化与结构化上下文管理" },
  { cap: "工具协议", impl: "原生工具 + MCP 可插拔接入" },
  { cap: "治理", impl: "分层权限 · 高风险动作拦截" },
  { cap: "观测", impl: "调用链 · 失败点 · 重试轨迹可追踪" },
  { cap: "迭代", impl: "从任务结果反哺 Skill 与策略" },
];

/** 适用 / 边界数据 */
const APPLY = [
  "高频且可复用的复杂流程",
  "多工具联动并要求稳定交付",
  "团队希望沉淀方法并持续优化质量",
];
const RISKS = [
  "系统更强，配置与治理复杂度也更高",
  "自动沉淀需质量门禁，防止坏经验放大",
  "一次性任务不值得引入重框架",
];

export default function Slide38Ch121WhyHermes() {
  const step = usePresenterStep(5);

  return (
    <Slide
      eyebrow="第十二章 · Hermes 案例"
      title="从方法论到工程案例：Hermes 解剖"
    >
      <div className="grid h-full grid-cols-[1fr_1fr] gap-5">
        {/* ── 左列 ─────────────────────────────── */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Step 1 · 为何 Hermes */}
          <Reveal show={step >= 1} variant="rise">
            <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-2 font-display text-[11px] tracking-[0.2em] text-brand-orange uppercase">
                为什么单独拆解 Hermes
              </div>
              <p className="font-serif text-[13px] leading-relaxed text-ink/75 mb-2">
                用一个真实系统验证"方法如何落地为设计"，三大差异点：
              </p>
              <div className="flex gap-2">
                {["持续学习\n经验不蒸发", "结构化记忆\n不硬塞上下文", "智能/执行解耦\n效率+安全并进"].map((t, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-lg border border-ink/10 p-2 text-center"
                    style={{ borderTop: `3px solid #d97757` }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 5 }}
                    transition={{ duration: 0.3, delay: 0.08 * i, ease }}
                  >
                    <div className="font-serif text-[11px] leading-snug text-ink/75 whitespace-pre-line">{t}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Step 2 · 三层架构 */}
          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-3 font-display text-[11px] tracking-[0.2em] text-brand-orange uppercase">
                三层责任链
              </div>
              <div className="flex items-stretch gap-0">
                {LAYERS.map((L, i) => (
                  <motion.div
                    key={L.name}
                    className="flex flex-1 flex-col"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: step >= 2 ? 1 : 0, x: step >= 2 ? 0 : -8 }}
                    transition={{ duration: 0.32, delay: 0.09 * i, ease }}
                  >
                    <div
                      className="rounded-l-lg px-3 py-2 text-white text-center"
                      style={{
                        background: L.color,
                        borderRadius: i === 0 ? "8px 0 0 8px" : i === 2 ? "0 8px 8px 0" : "0",
                      }}
                    >
                      <div className="font-display text-[10px] opacity-80 tracking-widest">{L.label}</div>
                      <div className="font-display text-[14px] font-semibold">{L.name}</div>
                    </div>
                    <div className="flex-1 border border-t-0 border-ink/10 px-2 py-2"
                      style={{
                        borderRadius: i === 0 ? "0 0 0 8px" : i === 2 ? "0 0 8px 0" : "0",
                        borderLeft: i > 0 ? "none" : undefined,
                      }}
                    >
                      <p className="font-serif text-[10.5px] leading-relaxed text-ink/65">{L.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-2 font-serif text-[11px] text-ink/55">
                智能层快速迭代，执行层独立扩展，分层隔离更易审计。
              </p>
            </div>
          </Reveal>

          {/* Step 3 · Agent 设计原则 */}
          <Reveal show={step >= 3} variant="rise">
            <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-2 font-display text-[11px] tracking-[0.2em] text-brand-orange uppercase">
                Hermes-Agent 六大设计
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {DESIGNS.map((d, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step >= 3 ? 1 : 0 }}
                    transition={{ duration: 0.25, delay: 0.06 * i, ease }}
                  >
                    <span className="font-display text-[11px] text-brand-orange flex-shrink-0 mt-px">{d.n}</span>
                    <span className="font-serif text-[11px] leading-relaxed text-ink/70">{d.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── 右列 ─────────────────────────────── */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Step 4 · Harness 映射 */}
          <Reveal show={step >= 4} variant="rise">
            <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-2 font-display text-[11px] tracking-[0.2em] text-brand-orange uppercase">
                Harness 能力映射
              </div>
              <table className="w-full border-collapse font-serif text-[12px]">
                <thead>
                  <tr className="border-b border-ink/10">
                    <th className="py-1 text-left font-display text-[10px] tracking-widest text-ink/45 w-[28%]">能力面</th>
                    <th className="py-1 text-left font-display text-[10px] tracking-widest text-ink/45">Hermes 实现</th>
                  </tr>
                </thead>
                <tbody>
                  {MAPPINGS.map((m, i) => (
                    <motion.tr
                      key={m.cap}
                      className="border-b border-ink/6"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: step >= 4 ? 1 : 0, x: step >= 4 ? 0 : 8 }}
                      transition={{ duration: 0.25, delay: 0.06 * i, ease }}
                    >
                      <td className="py-1 pr-2 font-semibold text-brand-orange">{m.cap}</td>
                      <td className="py-1 text-ink/70">{m.impl}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Step 5 · 适用 + 边界 + 结论 */}
          <Reveal show={step >= 5} variant="rise">
            <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-1.5 font-display text-[10px] tracking-[0.18em] text-[#788c5d] uppercase">适用场景</div>
                  <ul className="space-y-1">
                    {APPLY.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5 font-serif text-[11px] text-ink/70">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#788c5d]" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-1.5 font-display text-[10px] tracking-[0.18em] text-[#cc785c] uppercase">边界与风险</div>
                  <ul className="space-y-1">
                    {RISKS.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5 font-serif text-[11px] text-ink/70">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#cc785c]" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal show={step >= 5} variant="rise">
            <Callout>
              先在 1-2 条高频流程做 PoC，确认"沉淀收益 &gt; 维护成本"后再扩面。
              Hermes 让 Harness 六大能力在真实系统中形成<strong>可持续闭环</strong>。
            </Callout>
          </Reveal>

          {/* 小组探索空白卡片 */}
          <Reveal show={step >= 5} variant="rise">
            <div className="rounded-xl border-2 border-dashed border-ink/20 bg-transparent p-5 flex flex-col items-center justify-center gap-2 min-h-[88px]">
              <div className="font-display text-[13px] tracking-[0.18em] text-ink/40 uppercase">小组探索</div>
              <p className="font-serif text-[17px] text-ink/60 text-center leading-relaxed">
                Hermes Skill / MCP 机制与原理
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
