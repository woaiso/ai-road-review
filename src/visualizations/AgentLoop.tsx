import { motion } from "framer-motion";
import { Brain, Wrench, Database } from "lucide-react";
import { ease } from "@/lib/motion";

/**
 * Agent 三要素循环：模型 ⇄ 工具 ⇄ 记忆
 * step:
 *   0 -> 仅显示三个节点
 *   1 -> 点亮模型
 *   2 -> 加上工具
 *   3 -> 加上记忆
 *   4 -> 圆形循环箭头流动
 */
const NODES = [
  { id: "model",  label: "模型推理", desc: "Plan / Decide", icon: Brain,    color: "#d97757", angle: -90 },
  { id: "tool",   label: "工具执行", desc: "Act on World",   icon: Wrench,   color: "#788c5d", angle: 30 },
  { id: "memory", label: "记忆/上下文", desc: "Observe & Recall", icon: Database, color: "#6a9bcc", angle: 150 },
];

const RADIUS = 180;
const CX = 400;
const CY = 280;

function pos(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: CX + RADIUS * Math.cos(rad), y: CY + RADIUS * Math.sin(rad) };
}

export function AgentLoop({ activeStep = 0 }: { activeStep?: number }) {
  const nodeActive = (idx: number) => activeStep >= idx + 1;
  const loopActive = activeStep >= 4;

  return (
    <svg viewBox="0 0 800 560" className="h-full w-full">
      {/* 中央目标 */}
      <motion.circle
        cx={CX}
        cy={CY}
        r={36}
        fill="#141413"
        animate={{ r: loopActive ? 42 : 36 }}
        transition={{ duration: 0.4, ease }}
      />
      <text
        x={CX}
        y={CY + 6}
        textAnchor="middle"
        fontFamily="Poppins"
        fontSize={16}
        fill="#faf9f5"
        fontWeight={600}
      >
        Goal
      </text>

      {/* 圆形循环弧（流动效果） */}
      {loopActive && (
        <motion.circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="#d97757"
          strokeWidth={3}
          strokeDasharray="14 10"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />
      )}

      {/* 节点之间的连线 */}
      {loopActive &&
        NODES.map((node, i) => {
          const next = NODES[(i + 1) % NODES.length];
          const a = pos(node.angle);
          const b = pos(next.angle);
          return (
            <motion.line
              key={`${node.id}->${next.id}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#d97757"
              strokeWidth={1.5}
              strokeOpacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
            />
          );
        })}

      {/* 三个节点 */}
      {NODES.map((node, idx) => {
        const p = pos(node.angle);
        const active = nodeActive(idx);
        const Icon = node.icon;
        return (
          <g key={node.id}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={64}
              animate={{
                fill: active ? node.color : "#efeae0",
                scale: active ? 1 : 0.9,
              }}
              transition={{ duration: 0.4, ease }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            />
            <foreignObject x={p.x - 18} y={p.y - 18} width={36} height={36}>
              <Icon
                size={36}
                strokeWidth={1.6}
                color={active ? "#faf9f5" : "#9b8770"}
              />
            </foreignObject>
            <text
              x={p.x}
              y={p.y + 96}
              textAnchor="middle"
              fontFamily="Poppins"
              fontSize={20}
              fontWeight={600}
              fill={active ? "#141413" : "#a8a194"}
            >
              {node.label}
            </text>
            <text
              x={p.x}
              y={p.y + 118}
              textAnchor="middle"
              fontFamily="Lora"
              fontSize={13}
              fill={active ? "#5a544a" : "#bfb8a8"}
            >
              {node.desc}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
