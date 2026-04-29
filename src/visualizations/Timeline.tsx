import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * 范式跃迁时间线（6 个里程碑）
 * step: 0..6 控制点亮里程碑数量
 */
const MILESTONES = [
  { year: "2012", title: "Deep Learning", subtitle: "ImageNet 时代开启", color: "#9b8770" },
  { year: "2017", title: "Transformer", subtitle: "可扩展预训练范式成型", color: "#7e9270" },
  { year: "2022", title: "ChatGPT", subtitle: "对话式 AI 走向大众", color: "#6a9bcc" },
  { year: "2024", title: "Agent", subtitle: "多步任务与工具调用", color: "#788c5d" },
  { year: "2025", title: "Harness", subtitle: "可靠、可观测、可治理", color: "#c28663" },
  { year: "2026", title: "Agentic AI", subtitle: "规模化落地拐点", color: "#d97757" },
];

export function Timeline({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 1500 400" className="h-full w-full">
        {/* 轴线 */}
        <line x1="80" y1="220" x2="1420" y2="220" stroke="#cdc7bb" strokeWidth="3" />
        <motion.line
          x1="80"
          y1="220"
          x2="1420"
          y2="220"
          stroke="#d97757"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength:
              activeIndex <= 0 ? 0 : Math.min(1, activeIndex / MILESTONES.length),
          }}
          transition={{ duration: 0.8, ease }}
        />

        {MILESTONES.map((m, idx) => {
          const x = 80 + ((1420 - 80) * (idx + 0.5)) / MILESTONES.length;
          const isActive = activeIndex >= idx + 1;
          return (
            <g key={m.year}>
              <motion.circle
                cx={x}
                cy={220}
                r={isActive ? 18 : 10}
                animate={{
                  fill: isActive ? m.color : "#e9e3d6",
                  r: isActive ? 18 : 10,
                }}
                transition={{ duration: 0.4, ease }}
                stroke="#faf9f5"
                strokeWidth={4}
              />
              {/* 上方：年份 */}
              <motion.text
                x={x}
                y={170}
                textAnchor="middle"
                fontFamily="Poppins, sans-serif"
                fontSize={28}
                fontWeight={700}
                animate={{ fill: isActive ? m.color : "#a8a194" }}
              >
                {m.year}
              </motion.text>
              {/* 下方：标题与副标 */}
              <motion.text
                x={x}
                y={275}
                textAnchor="middle"
                fontFamily="Poppins, sans-serif"
                fontSize={20}
                fontWeight={600}
                animate={{ fill: isActive ? "#141413" : "#a8a194" }}
              >
                {m.title}
              </motion.text>
              <motion.text
                x={x}
                y={302}
                textAnchor="middle"
                fontFamily="Lora, serif"
                fontSize={15}
                animate={{ fill: isActive ? "#5a544a" : "#bfb8a8" }}
              >
                {m.subtitle}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
