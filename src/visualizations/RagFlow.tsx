import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * RAG 工作流：用户问题 → 向量化 → 检索 → 拼接上下文 → LLM → 回答
 * step: 0..6 控制流程进度
 */
const STEPS = [
  { id: 1, x: 80,   label: "用户问题",   sub: "Query" },
  { id: 2, x: 280,  label: "Embedding",  sub: "向量化" },
  { id: 3, x: 480,  label: "向量库",     sub: "Top-K 检索" },
  { id: 4, x: 680,  label: "上下文拼接", sub: "Prompt + Docs" },
  { id: 5, x: 880,  label: "LLM",        sub: "生成回答" },
  { id: 6, x: 1080, label: "回答 + 引用", sub: "可溯源" },
];

// 每一步都绑定同一个业务案例的中间结果，演示时更容易“跟得上”。
const STEP_EXAMPLES = [
  {
    id: 1,
    title: "收到问题",
    lines: ["上海出差住宿费上限是多少？", "机场往返打车能报销吗？"],
  },
  {
    id: 2,
    title: "问题向量化",
    lines: ["提取语义：差旅、住宿上限、打车报销", "把问题编码为检索向量 q_vec"],
  },
  {
    id: 3,
    title: "检索 Top-K 条款",
    lines: ["命中：差旅制度 4.2（住宿上限）", "命中：差旅制度 6.1（交通报销）"],
  },
  {
    id: 4,
    title: "拼接上下文",
    lines: ["Prompt = 用户问题 + 条款片段", "要求：只基于给定条款回答并附出处"],
  },
  {
    id: 5,
    title: "LLM 生成草答",
    lines: ["住宿费上限 500 元/晚", "机场往返打车可报销（需发票）"],
  },
  {
    id: 6,
    title: "输出最终答案",
    lines: ["答案 + 引用：制度 2026-Q1 第 4.2 / 6.1 节", "满足可解释、可审计"],
  },
] as const;

function getExample(activeStep: number) {
  const safeStep = Math.max(1, Math.min(STEP_EXAMPLES.length, activeStep));
  return STEP_EXAMPLES[safeStep - 1];
}

export function RagFlow({ activeStep = 0 }: { activeStep?: number }) {
  const example = getExample(activeStep);

  return (
    <svg viewBox="0 0 1200 360" className="h-full w-full">
      {/* 主轴线 */}
      <line x1={80} y1={180} x2={1140} y2={180} stroke="#e9e3d6" strokeWidth={2} />
      <motion.line
        x1={80}
        y1={180}
        x2={1140}
        y2={180}
        stroke="#d97757"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.min(1, activeStep / STEPS.length) }}
        transition={{ duration: 0.7, ease }}
      />

      {STEPS.map((s) => {
        const active = activeStep >= s.id;
        return (
          <g key={s.id}>
            <motion.rect
              x={s.x - 70}
              y={140}
              width={140}
              height={80}
              rx={12}
              animate={{
                fill: active ? "#faf9f5" : "#f3eee2",
                stroke: active ? "#d97757" : "#cdc7bb",
              }}
              strokeWidth={2}
              transition={{ duration: 0.4, ease }}
            />
            <motion.text
              x={s.x}
              y={172}
              textAnchor="middle"
              fontFamily="Poppins"
              fontSize={16}
              fontWeight={600}
              animate={{ fill: active ? "#141413" : "#a8a194" }}
            >
              {s.label}
            </motion.text>
            <motion.text
              x={s.x}
              y={194}
              textAnchor="middle"
              fontFamily="Lora"
              fontSize={12}
              animate={{ fill: active ? "#d97757" : "#bfb8a8" }}
            >
              {s.sub}
            </motion.text>
            {/* 数字标号 */}
            <motion.circle
              cx={s.x - 70}
              cy={140}
              r={14}
              animate={{ fill: active ? "#d97757" : "#cdc7bb" }}
            />
            <text
              x={s.x - 70}
              y={144}
              textAnchor="middle"
              fontFamily="Poppins"
              fontWeight={700}
              fontSize={13}
              fill="#faf9f5"
            >
              {s.id}
            </text>
          </g>
        );
      })}

      {/* 知识库示意 */}
      <g opacity={activeStep >= 3 ? 1 : 0.25}>
        <motion.rect
          x={410}
          y={232}
          width={140}
          height={52}
          rx={8}
          fill="#788c5d"
          opacity={0.85}
          animate={{ y: activeStep >= 3 ? 232 : 245, opacity: activeStep >= 3 ? 0.9 : 0 }}
          transition={{ duration: 0.4, ease }}
        />
        <text
          x={480}
          y={260}
          textAnchor="middle"
          fontFamily="Poppins"
          fontSize={13}
          fontWeight={600}
          fill="#faf9f5"
        >
          📚 Knowledge
        </text>
      </g>

      {/* 当前步骤的案例解释卡 */}
      <motion.g
        animate={{ opacity: activeStep >= 1 ? 1 : 0.25, y: activeStep >= 1 ? 0 : 8 }}
        transition={{ duration: 0.35, ease }}
      >
        <rect x={80} y={294} width={1060} height={56} rx={10} fill="#f3eee2" stroke="#d8d0c2" />
        <text x={104} y={317} fontFamily="Poppins" fontSize={11} letterSpacing="0.16em" fill="#9b8770">
          当前步骤示例 · {example.title}
        </text>
        <text x={104} y={338} fontFamily="Lora" fontSize={14} fill="#2a2926">
          {example.lines[0]}
        </text>
        <text x={620} y={338} fontFamily="Lora" fontSize={14} fill="#2a2926">
          {example.lines[1]}
        </text>
      </motion.g>
    </svg>
  );
}
