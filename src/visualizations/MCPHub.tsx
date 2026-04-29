import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * MCP 中心化路由：左侧多个 Agent，右侧多个工具/数据源，通过 MCP Hub 统一连接
 *  - step 0：Agent 与 工具 散落，没有连线
 *  - step 1：MCP Hub 出现
 *  - step 2：Agent → Hub
 *  - step 3：Hub → Tools
 */
const AGENTS = [
  { id: "claude", name: "Claude", y: 80 },
  { id: "cursor", name: "Cursor", y: 200 },
  { id: "vscode", name: "VS Code", y: 320 },
];
const TOOLS = [
  { id: "github", name: "GitHub", y: 60 },
  { id: "fs",     name: "FileSystem", y: 150 },
  { id: "db",     name: "Database",   y: 240 },
  { id: "slack",  name: "Slack",      y: 330 },
];

export function MCPHub({ activeStep = 0 }: { activeStep?: number }) {
  const showHub = activeStep >= 1;
  const showLeftLines = activeStep >= 2;
  const showRightLines = activeStep >= 3;

  return (
    <svg viewBox="0 0 1200 440" className="h-full w-full">
      {/* Hub */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: showHub ? 1 : 0, scale: showHub ? 1 : 0.6 }}
        transition={{ duration: 0.45, ease }}
        style={{ transformOrigin: "600px 220px" }}
      >
        <circle cx={600} cy={220} r={70} fill="#141413" />
        <circle cx={600} cy={220} r={70} fill="none" stroke="#d97757" strokeWidth={2} />
        <text
          x={600}
          y={215}
          textAnchor="middle"
          fontFamily="Poppins"
          fontSize={22}
          fontWeight={700}
          fill="#faf9f5"
        >
          MCP
        </text>
        <text
          x={600}
          y={238}
          textAnchor="middle"
          fontFamily="Lora"
          fontSize={12}
          fill="#cdc7bb"
        >
          Hub
        </text>
      </motion.g>

      {/* Agents 左 */}
      {AGENTS.map((a) => (
        <g key={a.id}>
          <rect
            x={80}
            y={a.y - 30}
            width={170}
            height={60}
            rx={10}
            fill="#faf9f5"
            stroke="#cdc7bb"
            strokeWidth={1.5}
          />
          <text
            x={165}
            y={a.y + 6}
            textAnchor="middle"
            fontFamily="Poppins"
            fontSize={18}
            fontWeight={600}
            fill="#141413"
          >
            {a.name}
          </text>
          {showLeftLines && (
            <motion.line
              x1={250}
              y1={a.y}
              x2={530}
              y2={220}
              stroke="#d97757"
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.6, ease }}
            />
          )}
        </g>
      ))}

      {/* Tools 右 */}
      {TOOLS.map((t) => (
        <g key={t.id}>
          <rect
            x={950}
            y={t.y - 22}
            width={170}
            height={50}
            rx={10}
            fill="#788c5d"
          />
          <text
            x={1035}
            y={t.y + 8}
            textAnchor="middle"
            fontFamily="Poppins"
            fontSize={16}
            fontWeight={600}
            fill="#faf9f5"
          >
            {t.name}
          </text>
          {showRightLines && (
            <motion.line
              x1={670}
              y1={220}
              x2={950}
              y2={t.y}
              stroke="#788c5d"
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.6, ease }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
