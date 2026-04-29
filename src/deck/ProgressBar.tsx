import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

/**
 * 顶部 2px 细线进度
 * 单独保留 deck-chrome 类便于打印时隐藏
 */
export function ProgressBar({ current, total }: ProgressBarProps) {
  const ratio = total <= 1 ? 1 : (current + 1) / total;
  return (
    <div className="deck-chrome pointer-events-none absolute inset-x-0 top-0 z-30 h-[3px] bg-mute-200/60">
      <motion.div
        className="h-full bg-gradient-to-r from-brand-orange via-[#cc6644] to-brand-orange/70"
        animate={{ width: `${ratio * 100}%` }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
