import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 数字/指标卡片：用于强调一个核心数字（如 50%、100K、3 步）
 *  - 数字大字号，下方副标
 */
export function StatCard({
  value,
  label,
  hint,
  accent = "#d97757",
  className,
}: {
  value: ReactNode;
  label: ReactNode;
  hint?: ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-ink/8",
        className,
      )}
    >
      <div
        className="absolute left-0 top-0 h-full w-1.5"
        style={{ backgroundColor: accent }}
      />
      <div
        className="font-display text-[56px] leading-none font-semibold"
        style={{ color: accent }}
      >
        {value}
      </div>
      <div className="mt-2 text-[15px] font-display font-medium text-ink/75">{label}</div>
      {hint && <div className="mt-1 text-[12px] text-ink/45">{hint}</div>}
    </motion.div>
  );
}
