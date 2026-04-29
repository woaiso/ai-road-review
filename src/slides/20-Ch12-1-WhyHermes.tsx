import { motion } from "framer-motion";
import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { ease } from "@/lib/motion";
import { palette } from "@/lib/theme";

/**
 * 演讲节奏（6 步）：
 *   step 0 – 骨架：4 张灰色卡 + Hermes 淡轮廓
 *   step 1 – MCP 卡片 + 汇流线点亮
 *   step 2 – Agent Loop 卡片 + 汇流线
 *   step 3 – Skill 卡片 + 汇流线
 *   step 4 – Harness 卡片 + 汇流线 + Hermes 激活（身份徽章、三大差异化）
 *   step 5 – Hermes 三层架构展开
 *   step 6 – 底部关键数据/事实行
 */

/* ─── 数据 ────────────────────────────────────────────── */

const SOURCES = [
  {
    step: 1,
    ch: "第八章",
    name: "MCP",
    caption: "统一工具接入契约",
    desc: "多模型共享同一接口",
    hex: palette.blue,
  },
  {
    step: 2,
    ch: "第九章",
    name: "Agent Loop",
    caption: "持续闭环执行任务",
    desc: "规划 → 执行 → 观测 → 修正",
    hex: palette.green,
  },
  {
    step: 3,
    ch: "第十章",
    name: "Skill",
    caption: "把做法沉淀为标准",
    desc: "个人经验 → 团队可复用流程",
    hex: palette.orange,
  },
  {
    step: 4,
    ch: "第十一章",
    name: "Harness",
    caption: "治理与安全外壳",
    desc: "权限 · 审计 · 观测 · 可控",
    hex: "#9b8770",
  },
];

/** 三大差异化特性（来自技术报告 §3.1 / §3.4 / §3.2） */
const DIFFERENTIATORS = [
  {
    icon: "🔄",
    title: "闭环学习飞轮",
    body: "任务完成后自动提炼 Skill，\n越用越强，经验不蒸发",
  },
  {
    icon: "🧠",
    title: "架构保证记忆",
    body: "MEMORY.md 始终注入，\n不依赖 LLM 的启发式判断",
  },
  {
    icon: "⚡",
    title: "智能 / 执行分离",
    body: "AI 运行与代码执行物理隔离，\n安全边界清晰可审计",
  },
];

/** 三层架构（来自技术报告 §3.2） */
const ARCH_LAYERS = [
  {
    label: "接入层",
    name: "Gateway",
    detail: "15+ 平台 · 跨平台持久状态",
    hex: palette.blue,
  },
  {
    label: "智能层",
    name: "AIAgent Core",
    detail: "模型路由 · Skill 引擎 · 四层记忆",
    hex: palette.orange,
  },
  {
    label: "执行层",
    name: "Backends",
    detail: "Terminal(6) · Browser(5) · MCP 动态接入",
    hex: palette.green,
  },
];

/** 底部关键数据（step 6） */
const KEY_FACTS = [
  { label: "GitHub Stars", value: "64,000+", sub: "Nous Research · 2026.02" },
  { label: "Skill 自动生成阈值", value: "5次+", sub: "工具调用后自动触发提炼" },
  { label: "研究任务提速", value: "40%", sub: "积累 Skill 后 vs 全新实例" },
  { label: "额外 token 开销", value: "~20%", sub: "Skill 自我改进的代价" },
];

/* ─── 汇流连线 SVG ──────────────────────────────────────── */

function ConvergeLines({ step }: { step: number }) {
  const W = 800;
  const H = 64;
  // 4 张卡片中心：12.5% / 37.5% / 62.5% / 87.5%
  const srcXs = [W * 0.125, W * 0.375, W * 0.625, W * 0.875];
  const destX = W / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      {srcXs.map((sx, i) => (
        <motion.path
          key={i}
          d={`M ${sx} 2 C ${sx} ${H * 0.7}, ${destX} ${H * 0.3}, ${destX} ${H - 2}`}
          fill="none"
          stroke={SOURCES[i].hex}
          strokeWidth={2.5}
          strokeDasharray="7 4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            step >= SOURCES[i].step
              ? { pathLength: 1, opacity: 0.72 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: 0.5, ease }}
        />
      ))}
      {/* 箭头头部，step >= 4 后出现 */}
      <motion.polygon
        points={`${destX - 7},${H - 16} ${destX},${H - 2} ${destX + 7},${H - 16}`}
        fill={palette.orange}
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 4 ? 0.9 : 0 }}
        transition={{ duration: 0.3, delay: 0.4, ease }}
      />
    </svg>
  );
}

/* ─── 主组件 ─────────────────────────────────────────────── */

export default function Slide38Ch121WhyHermes() {
  const step = usePresenterStep(7);

  return (
    <Slide
      eyebrow="第十二章 · Hermes 案例"
      title="拼图成塔：前章能力如何组装成 Hermes"
    >
      <div className="flex h-full flex-col gap-0">

        {/* ── 顶部：4 个来源卡片 ── */}
        <div className="grid grid-cols-4 gap-2.5">
          {SOURCES.map((src) => (
            <motion.div
              key={src.name}
              className="rounded-2xl border-2 px-3 py-3 text-center"
              animate={{
                borderColor: step >= src.step ? src.hex : palette.mute200,
                opacity: step >= src.step ? 1 : 0.22,
                background:
                  step >= src.step ? `${src.hex}12` : `${palette.cream}08`,
              }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="font-display text-[10px] tracking-[0.2em] text-ink/40 uppercase">
                {src.ch}
              </div>
              <motion.div
                className="mt-0.5 font-display text-[20px] font-bold leading-tight"
                animate={{ color: step >= src.step ? src.hex : palette.mute400 }}
                transition={{ duration: 0.4, ease }}
              >
                {src.name}
              </motion.div>
              <div className="mt-1 font-serif text-[11.5px] leading-snug text-ink/68">
                {src.caption}
              </div>
              <div className="mt-0.5 font-serif text-[10.5px] text-ink/45">
                {src.desc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── 汇流连线 ── */}
        <ConvergeLines step={step} />

        {/* ── Hermes 核心大盒 ── */}
        <motion.div
          className="mx-auto w-full rounded-3xl border-2 px-5 pt-3 pb-3 shadow-lg"
          animate={{
            borderColor: step >= 4 ? palette.orange : palette.mute200,
            boxShadow:
              step >= 4
                ? `0 0 32px ${palette.orangeAlpha}, 0 4px 16px rgba(0,0,0,0.08)`
                : "0 2px 8px rgba(0,0,0,0.04)",
            opacity: step >= 3 ? 1 : 0.18,
          }}
          transition={{ duration: 0.5, ease }}
        >
          {/* Hermes 标题行 */}
          <div className="mb-2.5 flex items-baseline justify-between">
            <motion.span
              className="font-display text-[28px] font-bold tracking-tight"
              animate={{ color: step >= 4 ? palette.orange : palette.ink }}
              transition={{ duration: 0.4, ease }}
            >
              Hermes Agent
            </motion.span>
            <motion.div
              className="flex items-center gap-2"
              animate={{ opacity: step >= 4 ? 1 : 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <span className="rounded-md bg-ink/8 px-2 py-0.5 font-display text-[11px] text-ink/60">
                Nous Research
              </span>
              <span className="rounded-md bg-ink/8 px-2 py-0.5 font-display text-[11px] text-ink/60">
                2026.02
              </span>
              <span className="rounded-md border border-brand-orange/30 bg-brand-orange/8 px-2 py-0.5 font-display text-[11px] font-semibold text-brand-orange">
                "The Agent That Grows With You"
              </span>
            </motion.div>
          </div>

          {/* 两列：差异化特性 + 三层架构 */}
          <div className="grid grid-cols-[1fr_1fr] gap-3">

            {/* 左：三大差异化 */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -10 }}
              animate={step >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="font-display text-[10.5px] tracking-[0.2em] text-brand-orange uppercase mb-1">
                核心差异化特性
              </div>
              {DIFFERENTIATORS.map((d, i) => (
                <motion.div
                  key={d.title}
                  className="flex items-start gap-3 rounded-xl border border-brand-orange/18 bg-brand-orange/5 px-3 py-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={step >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                  transition={{ duration: 0.32, delay: 0.1 + 0.1 * i, ease }}
                >
                  <span className="text-[22px] leading-none mt-0.5 flex-shrink-0">{d.icon}</span>
                  <div>
                    <div className="font-display text-[14px] font-semibold text-ink">
                      {d.title}
                    </div>
                    <div className="font-serif text-[11px] leading-snug text-ink/60 whitespace-pre-line">
                      {d.body}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* 右：三层架构 */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={step >= 5 ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="font-display text-[10.5px] tracking-[0.2em] text-ink/45 uppercase mb-1">
                三层架构
              </div>
              {/* 垂直堆叠架构层 */}
              <div className="flex flex-col gap-1.5">
                {ARCH_LAYERS.map((layer, i) => (
                  <motion.div
                    key={layer.name}
                    className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
                    style={{
                      borderColor: `${layer.hex}45`,
                      background: `${layer.hex}0e`,
                    }}
                    initial={{ opacity: 0, x: 8 }}
                    animate={step >= 5 ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
                    transition={{ duration: 0.35, delay: 0.1 * i, ease }}
                  >
                    {/* 层标签竖条 */}
                    <div
                      className="flex-shrink-0 w-1 self-stretch rounded-full"
                      style={{ background: layer.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="font-display text-[10px] tracking-widest uppercase"
                          style={{ color: `${layer.hex}aa` }}
                        >
                          {layer.label}
                        </span>
                        <span
                          className="font-display text-[15px] font-semibold"
                          style={{ color: layer.hex }}
                        >
                          {layer.name}
                        </span>
                      </div>
                      <div className="font-serif text-[11px] text-ink/55">
                        {layer.detail}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── 底部：关键数据行（step 6） ── */}
        <Reveal show={step >= 6} variant="rise">
          <div className="mt-2.5 grid grid-cols-4 gap-2.5">
            {KEY_FACTS.map((f, i) => (
              <motion.div
                key={f.label}
                className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-center shadow-sm"
                initial={{ opacity: 0, y: 6 }}
                animate={step >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.3, delay: 0.07 * i, ease }}
              >
                <div className="font-display text-[22px] font-bold text-brand-orange">
                  {f.value}
                </div>
                <div className="font-display text-[11px] font-semibold text-ink/70">
                  {f.label}
                </div>
                <div className="font-serif text-[10px] text-ink/45">{f.sub}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* ── Step 7：Skill 加载逻辑 + MCP 工作逻辑 ── */}
        <Reveal show={step >= 7} variant="rise">
          <div className="mt-2.5 grid grid-cols-2 gap-3">

            {/* ── Skill 加载逻辑 ── */}
            <div className="rounded-2xl border border-brand-orange/25 bg-brand-orange/5 p-3.5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <div className="font-display text-[10.5px] tracking-[0.2em] text-brand-orange uppercase">
                  Skill 加载逻辑
                </div>
                <div className="flex gap-1.5">
                  {["skill_list", "skill_view", "skill_manage"].map((cmd) => (
                    <span
                      key={cmd}
                      className="rounded-md border border-brand-orange/30 bg-white/70 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand-orange"
                    >
                      {cmd}
                    </span>
                  ))}
                </div>
              </div>
              {/* 三步渐进披露流 */}
              <div className="flex items-stretch gap-0">
                {[
                  {
                    tool: "skill_list",
                    phase: "① Session 启动",
                    desc: "注入精简候选列表\n（名称 + 描述，不展开正文）",
                    bg: "bg-brand-orange/10",
                  },
                  {
                    tool: "skill_view",
                    phase: "② 命中匹配",
                    desc: "读取摘要 / 完整\nSKILL.md 正文",
                    bg: "bg-brand-orange/15",
                  },
                  {
                    tool: "skill_manage",
                    phase: "③ 资产管理",
                    desc: "安装 · 更新 · 删除\nSkill 资产库",
                    bg: "bg-brand-orange/20",
                  },
                ].map((s, i, arr) => (
                  <div key={s.tool} className="flex flex-1 items-stretch gap-0">
                    <div className={`flex flex-1 flex-col rounded-xl px-2.5 py-2 ${s.bg}`}>
                      <div className="font-mono text-[10px] font-bold text-brand-orange">
                        {s.tool}
                      </div>
                      <div className="mt-0.5 font-display text-[11px] font-semibold text-ink/70">
                        {s.phase}
                      </div>
                      <div className="mt-0.5 font-serif text-[10.5px] leading-snug text-ink/55 whitespace-pre-line">
                        {s.desc}
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex items-center px-1 font-display text-[13px] text-brand-orange/40">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded-lg bg-white/60 px-2.5 py-1.5 font-serif text-[10.5px] text-ink/55">
                渐进式披露原则：控成本 · 提命中精度 · 减少无关内容占用 token
              </div>
            </div>

            {/* ── MCP 工作逻辑 ── */}
            <div className="rounded-2xl border border-brand-blue/25 bg-brand-blue/5 p-3.5 shadow-sm">
              <div className="mb-2 font-display text-[10.5px] tracking-[0.2em] text-brand-blue uppercase">
                MCP 工作逻辑（加载 → 执行）
              </div>
              {/* 四步流 */}
              <div className="space-y-1.5">
                {[
                  {
                    n: "①",
                    label: "注入能力索引",
                    desc: "Session 启动时只推送精简目录（Server 名 + 工具列表），不展开参数 Schema",
                    color: "text-brand-blue",
                    bg: "bg-brand-blue/10",
                  },
                  {
                    n: "②",
                    label: "按任务筛选",
                    desc: "Agent 根据意图从索引中命中相关工具，过滤无关 Server",
                    color: "text-brand-blue",
                    bg: "bg-brand-blue/10",
                  },
                  {
                    n: "③",
                    label: "按需展开 Schema & 预校验",
                    desc: "命中后才加载完整参数约束；调用前在本地验证参数类型与必填项",
                    color: "text-brand-blue",
                    bg: "bg-brand-blue/10",
                  },
                  {
                    n: "④",
                    label: "执行 & 结果标准化回注",
                    desc: "调用 MCP Server 执行；只回注必要结果字段，不整包返回以节省 token",
                    color: "text-brand-blue",
                    bg: "bg-brand-blue/10",
                  },
                ].map((row) => (
                  <div
                    key={row.n}
                    className={`flex items-start gap-2 rounded-lg px-2.5 py-1.5 ${row.bg}`}
                  >
                    <span className={`flex-shrink-0 font-display text-[13px] font-bold ${row.color}`}>
                      {row.n}
                    </span>
                    <div>
                      <span className={`font-display text-[12px] font-semibold ${row.color}`}>
                        {row.label}
                      </span>
                      <span className="ml-1.5 font-serif text-[11px] text-ink/58">
                        {row.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded-lg bg-white/60 px-2.5 py-1.5 font-serif text-[10.5px] text-ink/55">
                支持动态接入任意 MCP Server · 执行层与智能层物理分离，调用结果可审计
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Slide>
  );
}
