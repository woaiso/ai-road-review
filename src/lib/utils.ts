import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并多个 className，自动消除 Tailwind 冲突
 * 这是 shadcn/ui 约定的工具，所有组件都会引用
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 限制数值在 [min, max] 区间内 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
