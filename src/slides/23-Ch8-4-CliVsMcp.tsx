import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * 对比矩阵：each row has a "winner" side
 * winner: "cli" | "mcp" | "both"
 */
const COMPARE_ROWS = [
  {
    dim: "接入成本",
    cli: "极低，脚本即可",
    mcp: "中等，需设计 Server",
    winner: "cli" as const,
  },
  {
    dim: "可发现性",
    cli: "无协议，靠约定",
    mcp: "标准声明，自动发现",
    winner: "mcp" as const,
  },
  {
    dim: "跨客户端",
    cli: "弱，各端重复适配",
    mcp: "强，一次接入多端复用",
    winner: "mcp" as const,
  },
  {
    dim: "权限治理",
    cli: "分散，难以统一",
    mcp: "集中在 Server 层可审计",
    winner: "mcp" as const,
  },
  {
    dim: "Token 使用",
    cli: "无结构约束，消耗不可预测",
    mcp: "Schema 明确，渐进加载可控",
    winner: "mcp" as const,
  },
  {
    dim: "适用阶段",
    cli: "原型期 · 个人效率",
    mcp: "生产期 · 多团队协作",
    winner: "both" as const,
  },
];

/** 迁移路径三步 */
const MIGRATION_STEPS = [
  { num: "01", title: "CLI 快速验证", desc: "低成本跑通业务价值" },
  { num: "02", title: "识别高频能力", desc: "稳定、复用、跨团队的 2~3 个动作" },
  { num: "03", title: "协议化为 MCP", desc: "封装成 Server，逐步扩面" },
];

/** 生命周期采用曲线（内联 SVG） */
function AdoptionCurve() {
  return (
    <svg viewBox="0 0 480 130" className="w-full">
      {/* 阶段标注 */}
      <text x={30} y={14} fontFamily="Poppins" fontSize={11} fill="#8a8480">原型期</text>
      <text x={200} y={14} fontFamily="Poppins" fontSize={11} fill="#8a8480">成长期</text>
      <text x={380} y={14} fontFamily="Poppins" fontSize={11} fill="#8a8480">生产期</text>
      {/* 阶段分隔线 */}
      <line x1={180} y1={20} x2={180} y2={115} stroke="#cdc7bb" strokeWidth={1} strokeDasharray="3 3" />
      <line x1={360} y1={20} x2={360} y2={115} stroke="#cdc7bb" strokeWidth={1} strokeDasharray="3 3" />

      {/* CLI 采用面积（橙色，早期高，后期衰减） */}
      <motion.path
        d="M 20 30 C 60 28, 100 32, 180 45 C 240 55, 300 75, 460 95"
        fill="none"
        stroke="#d97757"
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.0, ease }}
      />
      <text x={22} y={44} fontFamily="Poppins" fontSize={12} fontWeight={700} fill="#d97757">CLI</text>

      {/* MCP 采用面积（蓝色，早期低，后期高） */}
      <motion.path
        d="M 20 100 C 80 98, 140 85, 200 65 C 280 40, 360 28, 460 22"
        fill="none"
        stroke="#5b88c0"
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.2, ease }}
      />
      <text x={400} y={26} fontFamily="Poppins" fontSize={12} fontWeight={700} fill="#5b88c0">MCP</text>

      {/* 交叉区域标注 */}
      <rect x={168} y={52} width={90} height={22} rx={6} fill="#141413" opacity={0.85} />
      <text x={213} y={67} textAnchor="middle" fontFamily="Lora" fontSize={11} fill="#faf9f5">
        先 CLI 验证
      </text>

      {/* Y轴标注 */}
      <text x={0} y={35} fontFamily="Lora" fontSize={9} fill="#8a8480" writingMode="tb">适用度</text>
    </svg>
  );
}

export default function Slide23Ch84CliVsMcp() {
  const step = usePresenterStep(5);

  return (
    <Slide
      eyebrow="第八章 · CLI 与 MCP"
      title="两条工程路线：快接入 vs 可治理"
    >
      <div className="grid h-full grid-cols-[1.1fr_1fr] gap-5">

        {/* ══ 左列：两派特征 + 对比矩阵 ══ */}
        <div className="flex flex-col gap-4">

          {/* Step 1 · 两派特征 */}
          <div className="grid grid-cols-2 gap-3">
            <Reveal show={step >= 1} variant="slide-right">
              <div className="rounded-2xl border border-brand-orange/35 bg-brand-orange/8 p-4">
                <div className="mb-1 font-display text-[11px] tracking-[0.25em] text-brand-orange uppercase">
                  CLI 流派
                </div>
                <div className="mb-3 font-display text-[22px] font-semibold leading-tight text-ink">
                  快接入<br />低门槛
                </div>
                <ul className="space-y-1.5 font-serif text-[13px] text-ink/72">
                  <li>· 原型期、一次性任务</li>
                  <li>· 直调命令脚本，启动快</li>
                  <li>· 跨端复用弱，治理分散</li>
                </ul>
              </div>
            </Reveal>
            <Reveal show={step >= 1} variant="slide-left" delay={0.06}>
              <div className="rounded-2xl border border-brand-blue/35 bg-brand-blue/8 p-4">
                <div className="mb-1 font-display text-[11px] tracking-[0.25em] text-brand-blue uppercase">
                  MCP 流派
                </div>
                <div className="mb-3 font-display text-[22px] font-semibold leading-tight text-ink">
                  可发现<br />可治理
                </div>
                <ul className="space-y-1.5 font-serif text-[13px] text-ink/72">
                  <li>· 生产期、多团队协作</li>
                  <li>· 结构化契约，跨端稳定</li>
                  <li>· 权限、审计、边界管控</li>
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Step 2 · 可视化对比矩阵（色格标注优势方） */}
          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-sm">
              {/* 表头 */}
              <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-ink/10 pb-2">
                <div className="font-display text-[12px] font-semibold text-brand-orange">CLI</div>
                <div className="font-display text-[11px] tracking-widest text-ink/35 uppercase">维度</div>
                <div className="text-right font-display text-[12px] font-semibold text-brand-blue">MCP</div>
              </div>
              {/* 每行对比 */}
              <div className="space-y-1.5">
                {COMPARE_ROWS.map((row, i) => (
                  <motion.div
                    key={row.dim}
                    className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"
                    initial={{ opacity: 0, y: 4 }}
                    animate={step >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                    transition={{ duration: 0.3, delay: 0.07 * i, ease }}
                  >
                    {/* CLI 值 */}
                    <div
                      className={`rounded-lg px-2.5 py-1.5 font-serif text-[12px] ${
                        row.winner === "cli"
                          ? "bg-brand-orange/15 font-semibold text-brand-orange"
                          : "text-ink/55"
                      }`}
                    >
                      {row.cli}
                    </div>
                    {/* 维度标签 */}
                    <div className="w-[68px] text-center font-display text-[11px] font-semibold text-ink/50">
                      {row.dim}
                    </div>
                    {/* MCP 值 */}
                    <div
                      className={`rounded-lg px-2.5 py-1.5 text-right font-serif text-[12px] ${
                        row.winner === "mcp"
                          ? "bg-brand-blue/15 font-semibold text-brand-blue"
                          : row.winner === "both"
                          ? "bg-brand-green/12 text-brand-green/80"
                          : "text-ink/55"
                      }`}
                    >
                      {row.mcp}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ══ 右列：采用曲线 + 迁移路径 + 澄清 + 结论 ══ */}
        <div className="flex flex-col gap-4">

          {/* Step 3 · 生命周期采用曲线 */}
          <Reveal show={step >= 3} variant="slide-left">
            <div className="rounded-2xl border border-ink/10 bg-white px-5 pt-3 pb-2 shadow-sm">
              <div className="mb-1 font-display text-[12px] tracking-[0.22em] text-ink/45 uppercase">
                采用阶段分布
              </div>
              <AdoptionCurve />
            </div>
          </Reveal>

          {/* Step 4 · 迁移路径（横向连线流） */}
          <Reveal show={step >= 4} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-3 font-display text-[12px] tracking-[0.22em] text-brand-orange uppercase">
                推荐迁移路径
              </div>
              <div className="flex items-start gap-1">
                {MIGRATION_STEPS.map((s, i) => (
                  <div key={s.num} className="flex flex-1 items-start gap-1">
                    <motion.div
                      className="flex-1"
                      initial={{ opacity: 0, y: 6 }}
                      animate={step >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                      transition={{ duration: 0.35, delay: 0.12 * i, ease }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-ink font-display text-[12px] font-bold text-cream">
                          {s.num}
                        </div>
                        <div className="font-display text-[13px] font-semibold text-ink">{s.title}</div>
                        <div className="mt-0.5 font-serif text-[11px] leading-snug text-ink/55">{s.desc}</div>
                      </div>
                    </motion.div>
                    {/* 连接箭头 */}
                    {i < MIGRATION_STEPS.length - 1 && (
                      <div className="mt-3 flex-shrink-0 font-display text-[16px] text-ink/25">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Step 4 · 澄清误区 */}
          <Reveal show={step >= 4} variant="rise" delay={0.1}>
            <div className="rounded-2xl border border-brand-green/25 bg-brand-green/8 px-4 py-3">
              <div className="mb-1 font-display text-[12px] font-semibold text-brand-green">
                ⚠ 常见误解
              </div>
              <p className="font-serif text-[12px] leading-relaxed text-ink/72">
                "用了 MCP 就不能用 CLI"——这是错的。本地 MCP Server 往往就是 stdio 启动，Server
                内部完全可以封装 CLI 命令。MCP 约束的是<strong>对模型暴露什么契约</strong>，不是禁止命令行。
              </p>
            </div>
          </Reveal>

          {/* Step 5 · 结论 */}
          <Reveal show={step >= 5} variant="rise">
            <Callout tone="insight" title="如何选择">
              单人短周期低风险 → 优先 CLI；多团队高风险跨应用 → 优先 MCP；
              <br />
              <strong>最优路径：先 CLI 验证价值，再把高频能力协议化为 MCP。</strong>
            </Callout>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
