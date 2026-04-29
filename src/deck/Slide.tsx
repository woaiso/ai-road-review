import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

interface SlideProps {
  children: ReactNode;
  /** 可选标题（如未提供，子组件需自行渲染标题区） */
  title?: ReactNode;
  /** 可选副标题 */
  eyebrow?: ReactNode;
  /** 整页背景色覆盖（用于章节封面页） */
  background?: string;
  /**
   * 背景渲染槽：渲染于内容容器之前、不受 padding 约束
   *  - 用于封面/章节页这类需要"出血"铺满整张画布的渐变背景
   *  - 避免在 children 里写 `absolute inset-0`：children 会被包在带 padding
   *    的容器内，inset-0 只能覆盖内容区，不能覆盖整页
   */
  backdrop?: ReactNode;
  /** 文本色调反转（深色背景） */
  dark?: boolean;
  /** 是否隐藏底部页脚区域（封面/章节封面页一般隐藏） */
  bare?: boolean;
  /** 内容区额外样式 */
  className?: string;
}

/**
 * 单页幻灯片基础容器
 *  - 固定 1920x1080 设计基准
 *  - 提供顶部 eyebrow / 主标题 / 内容区分层
 *  - 默认浅色奶油底，深色页可通过 dark/background 覆盖
 *  - 内置入场动画（淡入 + 微 slide-up）
 */
export function Slide({
  children,
  title,
  eyebrow,
  background,
  backdrop,
  dark,
  bare,
  className,
}: SlideProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease }}
      className={cn(
        "relative h-full w-full overflow-hidden",
        dark ? "text-cream" : "text-ink",
      )}
      style={background ? { backgroundColor: background } : undefined}
    >
      {/* backdrop：满幅出血层（不受内容 padding 约束） */}
      {backdrop}

      {/* 装饰：右上品牌斜线 */}
      {!bare && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-0 h-72 w-[600px] rotate-[12deg] opacity-[0.04]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #d97757 30%, #d97757 70%, transparent)",
          }}
        />
      )}

      <div
        className={cn(
          "relative flex h-full w-full flex-col px-24 py-20",
          bare && "px-0 py-0",
          className,
        )}
      >
        {(eyebrow || title) && (
          <header className="mb-10 flex flex-col gap-3">
            {eyebrow && (
              <div className="flex items-center gap-3 font-display text-base font-medium tracking-wide text-brand-orange/95">
                {eyebrow}
              </div>
            )}
            {title && (
              <h1
                className={cn(
                  "font-display font-semibold leading-tight",
                  "text-[64px]",
                  dark ? "text-cream" : "text-ink",
                )}
              >
                {title}
              </h1>
            )}
          </header>
        )}

        <div className="relative flex-1 min-h-0">{children}</div>
      </div>
    </motion.section>
  );
}
