import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * 智能大厦：11 层从下到上逐层点亮
 * 演示优化：
 * - 保留楼层说明文字，并提高字号保证投屏可读性
 * - 顶部增加愿景光束，强调 Agentic AI -> AGI 的叙事收束
 *
 * step:
 *   0 -> 全部灰色（基准）
 *   1..11 -> 依次点亮（最底层先亮）
 */
// 对齐源文《AI演进之路：从生成式AI到Agentic_AI》第一章 1.1 的演进路线：
// GenAI + Prompt -> Context + Thinking -> RAG -> Tool/MCP -> Agent -> Agent Skill -> Harness -> Agentic AI + AGI
const FLOORS = [
  // 范式层（顶层）：品牌橙梯度，强调愿景收束
  { id: 1, name: "AGI", desc: "长期愿景层", color: "#c7684a" },
  { id: 2, name: "Agentic AI", desc: "目标驱动的范式跃迁", color: "#d97757" },
  // 工程层：铜棕色，表达稳定运行与治理
  { id: 3, name: "Harness", desc: "工程化 Agent 运行时", color: "#b8795f" },
  // 执行智能层：暖棕梯度，表达“会做事 + 会沉淀经验”
  { id: 4, name: "Agent Skill", desc: "经验封装为可复用执行手册", color: "#996d5a" },
  { id: 5, name: "Agent", desc: "自主完成多步任务", color: "#aa755f" },
  // 能力接入层：绿色梯度，表达“连通外部能力/知识”
  { id: 6, name: "Tool / MCP", desc: "函数调用与协议化接入", color: "#7f9462" },
  { id: 7, name: "RAG", desc: "外部知识检索", color: "#95a86f" },
  // 认知层：蓝色梯度，表达“上下文 + 思考”
  { id: 8, name: "Thinking", desc: "深度思考与反思", color: "#7ea5cf" },
  { id: 9, name: "Context", desc: "上下文工程", color: "#6a90bb" },
  // 地基层：中性色，表达“模型基础能力”
  { id: 10, name: "Prompt", desc: "提示词驱动", color: "#8f7f6a" },
  { id: 11, name: "GenAI", desc: "Transformer / LLM 基座", color: "#58564f" },
];

export function AITower({ activeLevel = 0 }: { activeLevel?: number }) {
  // activeLevel: 0..11，表示已点亮层数（从底向上）
  const totalFloors = FLOORS.length;
  // 统一楼层几何参数，确保最底层与地面/阴影严格对齐
  const floorHeight = 50;
  const floorStep = 58;
  const topOffset = 100;
  return (
    <div className="relative flex h-full w-full items-end justify-center">
      <svg
        viewBox="0 0 760 760"
        className="h-[82vh] min-h-[760px] w-auto"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="towerBeam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97757" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#d97757" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 地面 */}
        <line x1="70" y1="736" x2="690" y2="736" stroke="#cdc7bb" strokeWidth="2" />
        {/* 地基阴影 */}
        <ellipse cx="380" cy="744" rx="230" ry="7" fill="#000" opacity="0.08" />

        {FLOORS.map((floor, idx) => {
          // floor.id 1=顶层（AGI），11=底层（GenAI）
          const fromBottom = totalFloors - idx; // 1..N from bottom
          const isActive = activeLevel >= fromBottom;
          const y = topOffset + idx * floorStep;
          const width = 430 + idx * 19;
          const x = 380 - width / 2;
          return (
            <g key={floor.id}>
              <motion.rect
                x={x}
                y={y}
                width={width}
                height={floorHeight}
                rx={8}
                initial={{ opacity: 0.25, fill: "#e9e3d6" }}
                animate={{
                  opacity: isActive ? 1 : 0.25,
                  fill: isActive ? floor.color : "#e9e3d6",
                }}
                transition={{ duration: 0.5, ease, delay: isActive ? 0.05 : 0 }}
                stroke="#000"
                strokeOpacity={0.06}
              />
              <motion.text
                x={x + 22}
                y={y + 35}
                fontFamily="Poppins, sans-serif"
                fontSize="22"
                fontWeight={600}
                animate={{ fill: isActive ? "#faf9f5" : "#8a8478" }}
              >
                {floor.name}
              </motion.text>
              <motion.text
                x={x + width - 20}
                y={y + 32}
                fontFamily="Lora, serif"
                fontSize="16"
                textAnchor="end"
                animate={{
                  fill: isActive ? "rgba(250,249,245,0.88)" : "#9f988b",
                }}
              >
                {floor.desc}
              </motion.text>
            </g>
          );
        })}

        {/* 顶部光束：顶层点亮后增强“愿景层”视觉收束 */}
        {activeLevel >= totalFloors && (
          <>
            <motion.polygon
              points="328,74 432,74 464,8 296,8"
              fill="url(#towerBeam)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.12, 0.42, 0.2] }}
              transition={{ duration: 1.8, ease, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.circle
              cx="380"
              cy="76"
              r="36"
              fill="#d97757"
              initial={{ opacity: 0, r: 6 }}
              animate={{ opacity: [0, 0.24, 0.14], r: [6, 36, 32] }}
              transition={{ duration: 1.6, ease, repeat: Infinity, repeatType: "reverse" }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
