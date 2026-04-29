import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * 上下文窗口横向条形对比：不同模型的窗口规模
 * step: 0..3 控制依次显示
 */
const MODELS = [
  { name: "GPT-3 (2020)",            tokens: 4096,    color: "#a8a194" },
  { name: "GPT-4 Turbo (2023)",      tokens: 128_000, color: "#9b8770" },
  { name: "Claude 3.5 (2024)",       tokens: 200_000, color: "#6a9bcc" },
  { name: "Gemini 1.5 Pro (2024)",   tokens: 1_000_000, color: "#788c5d" },
  { name: "Magic.dev LTM-2 (2024)",  tokens: 100_000_000, color: "#d97757" },
];

const MAX_TOKENS = 100_000_000;

function fmt(t: number) {
  if (t >= 1_000_000) return `${(t / 1_000_000).toFixed(0)}M`;
  if (t >= 1000) return `${(t / 1000).toFixed(0)}K`;
  return `${t}`;
}

export function ContextWindowBar({ activeStep = 0 }: { activeStep?: number }) {
  return (
    <svg viewBox="0 0 1300 460" className="h-full w-full">
      {MODELS.map((m, idx) => {
        const visible = activeStep >= idx + 1;
        const y = 30 + idx * 80;
        // 用对数缩放避免最后一项把前面挤成 0
        const ratio = Math.log10(m.tokens) / Math.log10(MAX_TOKENS);
        const w = ratio * 980;
        return (
          <g key={m.name}>
            <text
              x={20}
              y={y + 38}
              fontFamily="Poppins"
              fontSize={17}
              fontWeight={600}
              fill="#141413"
              opacity={visible ? 1 : 0.3}
            >
              {m.name}
            </text>
            <rect x={300} y={y + 10} width={980} height={50} rx={6} fill="#efeae0" />
            <motion.rect
              x={300}
              y={y + 10}
              height={50}
              rx={6}
              fill={m.color}
              initial={{ width: 0 }}
              animate={{ width: visible ? w : 0 }}
              transition={{ duration: 0.7, ease }}
            />
            <motion.text
              x={300 + w + 12}
              y={y + 42}
              fontFamily="Poppins"
              fontSize={18}
              fontWeight={700}
              fill={m.color}
              initial={{ opacity: 0 }}
              animate={{ opacity: visible ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {fmt(m.tokens)}
            </motion.text>
          </g>
        );
      })}
      <text
        x={300}
        y={450}
        fontFamily="Lora"
        fontSize={12}
        fill="#a8a194"
      >
        * 横向尺度采用对数缩放，仅作量级直观对比
      </text>
    </svg>
  );
}
