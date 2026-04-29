import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 关键术语高亮：橙色下划线（CSS 渐变背景）+ 入场强调动画
 *  - 默认在视口出现时绘制下划线
 */
export function KeyTerm({
  children,
  className,
  variant = "underline",
}: {
  children: ReactNode;
  className?: string;
  variant?: "underline" | "solid" | "outline";
}) {
  if (variant === "solid") {
    return (
      <motion.span
        initial={{ backgroundSize: "0% 100%" }}
        animate={{ backgroundSize: "100% 100%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "rounded px-1.5 text-cream",
          "bg-no-repeat bg-left",
          className,
        )}
        style={{
          backgroundImage: "linear-gradient(90deg, #d97757, #cc6644)",
        }}
      >
        {children}
      </motion.span>
    );
  }
  if (variant === "outline") {
    return (
      <span
        className={cn(
          "rounded-md border border-brand-orange/60 bg-brand-orange/5 px-2 py-0.5 text-brand-orange",
          className,
        )}
      >
        {children}
      </span>
    );
  }
  return <span className={cn("underline-brand", className)}>{children}</span>;
}
