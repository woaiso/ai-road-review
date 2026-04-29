import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";
/**
 * Harness 六大能力架构图（内联 SVG）
 *
 * 布局：
 *   可观测性（顶部横跨）
 *   上下文管理 ──── Agent Loop ──── Tool 注册表
 *   记忆存储   ────     核心    ──── 安全沙箱
 *              └──── Checkpoint ────┘
 */
function HarnessArchDiagram({ show }: { show: boolean }) {
  const C = { x: 285, y: 138 };   // Agent Loop 中心
  const boxes = [
    { x: 30,  y: 90,  w: 118, h: 52, title: "上下文管理", sub: "工作记忆 / 摘要压缩", color: "#6a9bcc", lx: 148, ly: 116 },
    { x: 30,  y: 165, w: 118, h: 52, title: "记忆存储",   sub: "短期 + 长期向量库",  color: "#9b8770", lx: 148, ly: 191 },
    { x: 430, y: 90,  w: 118, h: 52, title: "Tool 注册表", sub: "工具花名册 / 权限标记", color: "#788c5d", lx: 430, ly: 116 },
    { x: 430, y: 165, w: 118, h: 52, title: "安全沙箱",   sub: "权限墙 / 高危操作审批", color: "#788c5d", lx: 430, ly: 191 },
    { x: 205, y: 248, w: 158, h: 46, title: "Checkpoint", sub: "断点续传 / 任务恢复",  color: "#cc785c", lx: 284, ly: 248 },
  ];

  return (
    <svg viewBox="0 0 578 308" className="w-full">
      {/* 可观测性：顶部横跨 */}
      <motion.rect
        x={8} y={8} width={562} height={46} rx={10}
        fill="#6a9bcc18" stroke="#6a9bcc" strokeWidth={1.5} strokeDasharray="5 3"
        initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.5, ease }}
      />
      <motion.text
        x={289} y={25} textAnchor="middle" fontFamily="Poppins" fontSize={13} fontWeight={600} fill="#6a9bcc"
        initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.5, ease }}
      >
        可观测性
      </motion.text>
      <motion.text
        x={289} y={41} textAnchor="middle" fontFamily="Lora" fontSize={10} fill="#6a9bcc99"
        initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.5, ease }}
      >
        日志 · 追踪 · 回放（横跨整个运行时）
      </motion.text>

      {/* 连接线：各能力 ↔ Agent Loop */}
      {boxes.map((b, i) => (
        <motion.line
          key={`line-${i}`}
          x1={b.lx} y1={b.ly}
          x2={C.x}  y2={C.y}
          stroke={b.color} strokeWidth={1.6} strokeDasharray="4 3" opacity={0.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: show ? 1 : 0, opacity: show ? 0.5 : 0 }}
          transition={{ duration: 0.5, delay: 0.08 * i, ease }}
        />
      ))}

      {/* Agent Loop：中心深色核 */}
      <motion.rect
        x={190} y={90} width={190} height={98} rx={14}
        fill="#141413" stroke="#d97757" strokeWidth={2}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.85 }}
        style={{ transformOrigin: `${C.x}px ${C.y}px` }}
        transition={{ duration: 0.45, ease }}
      />
      <motion.text
        x={C.x} y={128} textAnchor="middle" fontFamily="Poppins" fontSize={15} fontWeight={700} fill="#faf9f5"
        initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.45, ease }}
      >
        Agent Loop
      </motion.text>
      <motion.text
        x={C.x} y={148} textAnchor="middle" fontFamily="Lora" fontSize={11} fill="#cdc7bb"
        initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.45, ease }}
      >
        感知 → 规划
      </motion.text>
      <motion.text
        x={C.x} y={164} textAnchor="middle" fontFamily="Lora" fontSize={11} fill="#cdc7bb"
        initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.45, ease }}
      >
        执行 → 观察
      </motion.text>

      {/* 六大能力外围盒 */}
      {boxes.map((b, i) => (
        <motion.g
          key={b.title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6 }}
          transition={{ duration: 0.35, delay: 0.1 + 0.08 * i, ease }}
        >
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={10}
            fill="white" stroke={b.color} strokeWidth={1.8} />
          <rect x={b.x} y={b.y} width={b.w} height={5} rx={3}
            fill={b.color} />
          <text x={b.x + b.w / 2} y={b.y + 22} textAnchor="middle"
            fontFamily="Poppins" fontSize={13} fontWeight={600} fill="#141413">
            {b.title}
          </text>
          <text x={b.x + b.w / 2} y={b.y + 38} textAnchor="middle"
            fontFamily="Lora" fontSize={10} fill="#6b6560">
            {b.sub}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/** 主流 Harness 方案 */
const FRAMEWORKS = [
  { name: "Claude Code",       tag: "Anthropic 原生", scene: "代码 / 系统设计" },
  { name: "OpenAI Agents SDK", tag: "OpenAI 生态",   scene: "快速原型" },
  { name: "LangGraph",         tag: "图工作流",       scene: "复杂分支编排" },
  { name: "AutoGen",           tag: "微软研究",       scene: "多 Agent 对话" },
  { name: "mcp-agent",         tag: "模型无关",       scene: "跨模型 / 开放生态" },
];

/** 三级风险色码 */
const RISK_LEVELS = [
  { dot: "#7da97a", level: "低风险", op: "只读 / 内部查询",  rule: "完全自动 · 事后审计",       example: "检索资料、生成草稿、创建测试分支" },
  { dot: "#d4a24c", level: "中风险", op: "内部副作用",       rule: "关键节点提醒 · 可批量审",   example: "合并代码、发外部通知、修改共享配置" },
  { dot: "#cc5544", level: "高风险", op: "对外 / 不可逆",    rule: "必须人审 · 二次确认",       example: "生产部署、批量删除、资金相关动作" },
];

export default function Slide34Ch111HarnessOverview() {
  const step = usePresenterStep(6);

  return (
    <Slide
      eyebrow="第十一章 · Harness / 运行时层"
      title="Harness：约束智能体，放行业务结果"
    >
      <div className="flex h-full flex-col gap-3">

        {/* ══ Step 1 · 类比引入：大模型是马，Harness 是马具 ══ */}
        <Reveal show={step >= 1} variant="rise">
          <div className="rounded-2xl border border-brand-orange/25 bg-brand-orange/5 px-6 py-4 shadow-sm">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8">

              {/* 左：裸马（无马具） */}
              <div className="flex items-center gap-4">
                <div className="text-[52px] leading-none select-none">🐎</div>
                <div>
                  <p className="font-display text-[15px] font-semibold text-ink">大模型</p>
                  <p className="mt-1 font-serif text-[13px] leading-relaxed text-ink/60">
                    一匹跑得极快、力大无穷的马<br />
                    能力惊人，但没有方向感<br />
                    随时可能冲出边界
                  </p>
                </div>
              </div>

              {/* 中：加号 + Harness 徽章 + 箭头 */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="font-display text-[22px] text-ink/30">+</span>
                <div className="rounded-xl border border-brand-orange/40 bg-white px-4 py-2 text-center shadow-sm">
                  <p className="font-mono text-[13px] font-bold text-brand-orange">Harness</p>
                  <p className="font-serif text-[11px] text-brand-orange/70">马嚼·缰绳·马鞍</p>
                </div>
                <motion.span
                  className="font-display text-[22px] text-brand-orange"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >→</motion.span>
              </div>

              {/* 右：装备马具后 */}
              <div className="flex items-center gap-4">
                <div className="text-[52px] leading-none select-none">🏇</div>
                <div>
                  <p className="font-display text-[15px] font-semibold text-brand-orange">可驾驭的智能体</p>
                  <p className="mt-1 font-serif text-[13px] leading-relaxed text-ink/60">
                    <span className="text-ink/80 font-medium">马嚼子</span> → 约束行为边界<br />
                    <span className="text-ink/80 font-medium">缰绳</span> → 上下文与记忆管理<br />
                    <span className="text-ink/80 font-medium">马鞍</span> → 执行框架 → 业务价值
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ══ Steps 2-6 · 主体内容（原 Steps 1-5 后移） ══ */}
        <div className="flex-1 grid grid-cols-[1.05fr_1fr] gap-5 min-h-0">

          {/* ── 左列：定义 + 六大能力 ── */}
          <div className="flex flex-col gap-3">

            {/* Step 2 · 定义卡 */}
            <Reveal show={step >= 2} variant="rise">
              <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-brand-orange/15 px-3 py-1.5">
                    <span className="font-mono text-[12px] font-semibold text-brand-orange">
                      感知 → 规划 → 工具调用 → 观察 → 循环
                    </span>
                  </div>
                </div>
                <p className="mb-2 font-serif text-[14px] leading-relaxed text-ink/80">
                  Harness 是<strong>运行时层抽象</strong>：连接上层目标与下层模型 / 工具 / 存储 / 权限系统，
                  让 Agent Loop 在约束内可控地运行。
                </p>
                <div className="rounded-xl bg-ink/5 px-3 py-2 font-serif text-[13px] text-ink/60 italic">
                  💼 类比：100 人公司靠口头管理不行——考勤、审批、回放、审计这套体系就是 Harness。
                </div>
              </div>
            </Reveal>

            {/* Step 3 · 六大能力架构图 */}
            <Reveal show={step >= 3} variant="rise">
              <div className="rounded-2xl border border-ink/10 bg-white px-4 pt-3 pb-2 shadow-sm">
                <div className="mb-1 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                  六大能力面 · 架构关系
                </div>
                <HarnessArchDiagram show={step >= 3} />
              </div>
            </Reveal>
          </div>

          {/* ── 右列：主流方案 + 三级风险 + 选型建议 ── */}
          <div className="flex flex-col gap-3">

            {/* Step 4 · 主流方案 */}
            <Reveal show={step >= 4} variant="slide-left">
              <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
                <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                  主流方案（按场景选，没有银弹）
                </div>
                <div className="space-y-1.5">
                  {FRAMEWORKS.map((f, i) => (
                    <motion.div
                      key={f.name}
                      className="flex items-center justify-between rounded-lg border border-ink/8 px-3 py-2"
                      initial={{ opacity: 0, x: 8 }}
                      animate={step >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
                      transition={{ duration: 0.3, delay: 0.07 * i, ease }}
                    >
                      <div>
                        <span className="font-display text-[14px] font-semibold text-ink">{f.name}</span>
                        <span className="ml-2 font-serif text-[12px] text-ink/55">适合：{f.scene}</span>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-brand-orange">{f.tag}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Step 5 · Human-in-the-Loop 三级风险 */}
            <Reveal show={step >= 5} variant="rise">
              <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
                <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                  Human-in-the-Loop · 三级风险
                </div>
                <div className="space-y-1.5">
                  {RISK_LEVELS.map((r, i) => (
                    <motion.div
                      key={r.level}
                      className="flex items-start gap-3 rounded-xl bg-ink/3 px-3 py-2.5"
                      initial={{ opacity: 0, x: 8 }}
                      animate={step >= 5 ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
                      transition={{ duration: 0.3, delay: 0.1 * i, ease }}
                    >
                      <span
                        className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: r.dot, boxShadow: `0 0 6px ${r.dot}88` }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-[13px] font-semibold text-ink">{r.level}</span>
                          <span className="font-mono text-[11px] text-ink/45">{r.op}</span>
                          <span className="font-serif text-[11px] text-ink/55">{r.rule}</span>
                        </div>
                        <div className="font-serif text-[11px] text-ink/50">{r.example}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Step 6 · 选型建议 */}
            <Reveal show={step >= 6} variant="rise">
              <Callout tone="insight" title="选型建议">
                先看约束（合规/私有化/审计强度）；再看模式（IDE辅助/流水线/多Agent编排）；
                小范围 PoC 验证闭环后再扩面；<strong>保持协议层可迁移，避免强绑定单平台</strong>。
              </Callout>
            </Reveal>
          </div>
        </div>
      </div>
    </Slide>
  );
}
