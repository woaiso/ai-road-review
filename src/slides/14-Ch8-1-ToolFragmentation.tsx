import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/** MCP 三类能力 */
const CAPABILITIES = [
  {
    type: "Tools",
    tag: "AI 可以做什么",
    color: "text-brand-orange",
    borderClass: "border-brand-orange/30 bg-brand-orange/8",
    example: "创建 Issue · 发消息 · 执行操作",
  },
  {
    type: "Resources",
    tag: "AI 可以看什么",
    color: "text-brand-blue",
    borderClass: "border-brand-blue/30 bg-brand-blue/8",
    example: "文件内容 · 数据库记录 · 实时状态",
  },
  {
    type: "Prompts",
    tag: "AI 可以复用什么",
    color: "text-brand-green",
    borderClass: "border-brand-green/30 bg-brand-green/8",
    example: "评审模板 · 报告模板 · 任务入口",
  },
];

/** 渐进式披露四步加载链路 */
const LAZY_STEPS = [
  { num: "1", label: "注入能力索引", desc: "只给精简目录，不展开细节" },
  { num: "2", label: "按任务筛选", desc: "仅保留当前意图相关能力" },
  { num: "3", label: "按需展开 Schema", desc: "命中后再加载参数约束与示例" },
  { num: "4", label: "回注最小结果", desc: "执行后只写回必要数据，不整包返回" },
];

/** MCP 工程三账本 */
const ENG_VALUES = [
  { title: "复用", desc: "一次接入，多端共用", dot: "bg-brand-orange" },
  { title: "治理", desc: "权限与审计集中在 Server 层", dot: "bg-brand-blue" },
  { title: "迁移", desc: "切换模型时接入层改动更小", dot: "bg-brand-green" },
];

/** 自绘 MCP 架构图（inline SVG） */
function McpArchDiagram() {
  const clients = ["Claude", "GPT-4o", "Cursor"];
  const servers = ["GitHub MCP", "Notion MCP", "Slack MCP"];
  const hubCx = 310;
  const hubCy = 110;
  const clientX = 30;
  const serverX = 490;

  return (
    <svg viewBox="0 0 630 230" className="w-full">
      {/* ── 中心 MCP Hub ── */}
      <rect x={hubCx - 75} y={hubCy - 38} width={150} height={76} rx={14}
        fill="#141413" stroke="#d97757" strokeWidth={2.5} />
      <text x={hubCx} y={hubCy - 6} textAnchor="middle"
        fontFamily="Poppins" fontSize={20} fontWeight={700} fill="#faf9f5">
        MCP
      </text>
      <text x={hubCx} y={hubCy + 14} textAnchor="middle"
        fontFamily="Lora" fontSize={12} fill="#cdc7bb">
        Model Context Protocol
      </text>
      <text x={hubCx} y={hubCy + 32} textAnchor="middle"
        fontFamily="Lora" fontSize={11} fill="#d97757">
        统一协议
      </text>

      {/* ── 左侧：AI 客户端 ── */}
      {clients.map((name, i) => {
        const cy = 38 + i * 68;
        return (
          <g key={name}>
            <rect x={clientX} y={cy - 20} width={138} height={42} rx={9}
              fill="#faf9f5" stroke="#cdc7bb" strokeWidth={1.5} />
            <text x={clientX + 69} y={cy + 6} textAnchor="middle"
              fontFamily="Poppins" fontSize={14} fontWeight={600} fill="#141413">
              {name}
            </text>
            {/* 连接线 → Hub */}
            <line x1={clientX + 138} y1={cy} x2={hubCx - 75} y2={hubCy}
              stroke="#d97757" strokeWidth={1.8} opacity={0.5} strokeDasharray="4 3" />
            {/* 箭头 */}
            <polygon
              points={`${hubCx - 79},${hubCy - 5} ${hubCx - 75},${hubCy} ${hubCx - 79},${hubCy + 5}`}
              fill="#d97757" opacity={0.6}
            />
          </g>
        );
      })}

      {/* ── 右侧：MCP Server ── */}
      {servers.map((name, i) => {
        const cy = 38 + i * 68;
        return (
          <g key={name}>
            <rect x={serverX} y={cy - 20} width={138} height={42} rx={9}
              fill="#788c5d" />
            <text x={serverX + 69} y={cy + 6} textAnchor="middle"
              fontFamily="Poppins" fontSize={13} fontWeight={600} fill="#faf9f5">
              {name}
            </text>
            {/* Hub → 连接线 */}
            <line x1={hubCx + 75} y1={hubCy} x2={serverX} y2={cy}
              stroke="#788c5d" strokeWidth={1.8} opacity={0.5} strokeDasharray="4 3" />
            {/* 箭头 */}
            <polygon
              points={`${serverX + 4},${cy - 5} ${serverX},${cy} ${serverX + 4},${cy + 5}`}
              fill="#788c5d" opacity={0.7}
            />
          </g>
        );
      })}

      {/* ── 底部说明 ── */}
      <text x={hubCx} y={218} textAnchor="middle"
        fontFamily="Lora" fontSize={11} fill="#6b6560">
        不再"给每个模型单独接工具"，而是"把能力接进协议生态"
      </text>
    </svg>
  );
}

export default function Slide20Ch81McpOverview() {
  const step = usePresenterStep(6);

  return (
    <Slide
      eyebrow="第八章 · MCP（Model Context Protocol）"
      title="统一契约：从碎片化接入到协议化生态"
    >
      <div className="flex h-full flex-col gap-3">
        <Reveal show={step >= 0} variant="rise">
          <div className="rounded-2xl border border-brand-orange/25 bg-brand-orange/5 px-4 py-3 shadow-sm">
            <div className="mb-1 font-display text-[12px] tracking-[0.2em] text-brand-orange uppercase">
              协议来源
            </div>
            <div className="grid grid-cols-[1.3fr_auto_auto_2fr] items-center gap-3">
              <div className="font-display text-[18px] font-semibold text-ink">
                Model Context Protocol (MCP)
              </div>
              <div className="rounded-md bg-white/75 px-2.5 py-1 font-display text-[12px] font-semibold text-ink/80">
                Anthropic
              </div>
              <div className="rounded-md bg-white/75 px-2.5 py-1 font-display text-[12px] font-semibold text-ink/70">
                2024 年 11 月
              </div>
              <div className="font-serif text-[12px] text-ink/68">
                标准化连接层：解决 AI 如何接入外部数据（如 GitHub、Slack、本地文件）的“插座”问题。
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid flex-1 grid-cols-[1.15fr_1fr] gap-5">

          {/* ══ 左列：问题 + 架构图 + 结论 ══ */}
          <div className="flex flex-col gap-3">

          {/* Step 1 · 碎片化困局 */}
          <Reveal show={step >= 1} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                现实困境
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {[
                  "接 OpenAI 一套函数协议",
                  "接 Claude 再写一套格式",
                  "接其他模型重复鉴权映射",
                  "业务没变，适配代码膨胀",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 font-serif text-[13px] text-ink/78">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-orange/70" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-2.5 rounded-xl bg-ink/5 px-3 py-2 font-serif text-[13px] text-ink/60 italic">
                🔌 就像各国插座标准不同：电器没变，每天都在找转换头。
              </div>
            </div>
          </Reveal>

          {/* Step 2 · MCP 架构图（自绘） */}
          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white px-5 pt-3 pb-1 shadow-sm">
              <div className="mb-1 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                MCP 统一接入架构
              </div>
              <McpArchDiagram />
            </div>
          </Reveal>

          {/* Step 6 · USB 结论 */}
          <Reveal show={step >= 6} variant="rise">
            <Callout tone="insight" title="USB 类比">
              MCP 之于 AI 生态，类似 USB 之于硬件：单点普通，规模化后价值巨大。
              IDE、Agent 平台、SaaS 工具正在加速跟进协议。
            </Callout>
          </Reveal>
          </div>

          {/* ══ 右列：三类能力 + 渐进式披露 + 工程三账本 ══ */}
          <div className="flex flex-col gap-3">

          {/* Step 3 · 三类能力 */}
          <Reveal show={step >= 3} variant="slide-left">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                MCP 三类能力
              </div>
              <div className="space-y-2">
                {CAPABILITIES.map((cap, i) => (
                  <motion.div
                    key={cap.type}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${cap.borderClass}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={step >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                    transition={{ duration: 0.4, delay: 0.1 * i, ease }}
                  >
                    <div className="flex-1">
                      <div className={`font-display text-[16px] font-semibold ${cap.color}`}>{cap.type}</div>
                      <div className="font-display text-[11px] tracking-wide text-ink/50">{cap.tag}</div>
                    </div>
                    <div className="rounded-lg bg-white/60 px-2 py-1 font-serif text-[11px] text-ink/65">
                      {cap.example}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Step 4 · 渐进式披露与按需加载 */}
          <Reveal show={step >= 4} variant="rise">
            <div className="rounded-2xl border border-brand-blue/25 bg-brand-blue/5 p-4 shadow-sm">
              <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-brand-blue uppercase">
                渐进式披露 · 按需加载
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LAZY_STEPS.map((s, i) => (
                  <motion.div
                    key={s.num}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, y: 5 }}
                    animate={step >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                    transition={{ duration: 0.35, delay: 0.08 * i, ease }}
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-brand-blue/20 font-display text-[11px] font-bold text-brand-blue">
                      {s.num}
                    </div>
                    <div>
                      <div className="font-display text-[13px] font-semibold text-ink">{s.label}</div>
                      <div className="font-serif text-[11px] text-ink/60">{s.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-2 rounded-lg bg-white/50 px-3 py-1.5 font-serif text-[11px] text-ink/60">
                收益：控成本 · 提稳定 · 便治理——减少无关能力描述占用 token
              </div>
            </div>
          </Reveal>

          {/* Step 5 · 工程三账本 */}
          <Reveal show={step >= 5} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-2 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                工程三账本
              </div>
              <div className="space-y-2">
                {ENG_VALUES.map((v, i) => (
                  <motion.div
                    key={v.title}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 5 }}
                    animate={step >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                    transition={{ duration: 0.3, delay: 0.1 * i, ease }}
                  >
                    <div className={`h-2 w-2 flex-shrink-0 rounded-full ${v.dot}`} />
                    <span className="font-display text-[14px] font-semibold text-ink">{v.title}</span>
                    <span className="font-serif text-[12px] text-ink/60">{v.desc}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-2 rounded-lg bg-ink/5 px-3 py-1.5 font-serif text-[12px] text-ink/55">
                落地建议：先挑 2～3 个高频稳定能力 MCP 化，跑通后再扩面。
              </div>
            </div>
          </Reveal>
          </div>
        </div>
      </div>
    </Slide>
  );
}
