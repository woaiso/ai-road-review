import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * Fragment 包装：
 *  - 用法：<Reveal show={step >= 1}>...</Reveal>
 *  - 默认 fade + 上推动画
 */
export function Reveal({
  show,
  children,
  delay = 0,
  className,
  variant = "rise",
}: {
  show: boolean;
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "rise" | "fade" | "scale" | "slide-left" | "slide-right";
}) {
  const variants = {
    rise: { hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0 } },
    fade: { hidden: { opacity: 0 }, shown: { opacity: 1 } },
    scale: { hidden: { opacity: 0, scale: 0.96 }, shown: { opacity: 1, scale: 1 } },
    "slide-left": { hidden: { opacity: 0, x: 24 }, shown: { opacity: 1, x: 0 } },
    "slide-right": { hidden: { opacity: 0, x: -24 }, shown: { opacity: 1, x: 0 } },
  } as const;
  const v = variants[variant];
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          className={className}
          initial="hidden"
          animate="shown"
          exit="hidden"
          variants={v}
          transition={{ duration: 0.45, ease, delay }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
