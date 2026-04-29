import type { Variants, Transition } from "framer-motion";

/**
 * 通用过渡参数（缓动/时长统一），保证全场动效观感一致
 */
export const ease = [0.22, 1, 0.36, 1] as const;
export const transitionFast: Transition = { duration: 0.35, ease };
export const transitionBase: Transition = { duration: 0.55, ease };
export const transitionSlow: Transition = { duration: 0.8, ease };

/**
 * 元素自下而上淡入：用于内容块入场
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: transitionBase },
};

/**
 * 元素自左滑入：用于卡片队列、对比栏
 */
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: transitionBase },
};

/**
 * 缩放淡入：用于强调元素（数字、关键术语）
 */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: transitionFast },
};

/**
 * 子元素依次出现的容器（与 fadeUp 等子 variants 配合）
 */
export const stagger = (delayChildren = 0.05, staggerChildren = 0.08): Variants => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { delayChildren, staggerChildren },
  },
});

/**
 * 切页过渡（AnimatePresence 包装当前 Slide）
 */
export const slideSwap: Variants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.35, ease } },
};
