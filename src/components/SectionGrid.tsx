import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 通用两栏 / N 栏布局
 *  - 给具体 slide 用作并排展示左右内容
 */
export function SectionGrid({
  children,
  cols = 2,
  gap = "gap-10",
  className,
}: {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  gap?: string;
  className?: string;
}) {
  const colMap = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" } as const;
  return (
    <div className={cn("grid h-full", colMap[cols], gap, className)}>{children}</div>
  );
}
