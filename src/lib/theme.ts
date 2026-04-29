/**
 * 设计 token 集中表（与 tailwind.config.ts 的 colors 对齐）
 * 在 SVG / Framer Motion 中需要常量引用时使用，避免硬编码颜色
 */
export const palette = {
  cream: "#faf9f5",
  ink: "#141413",
  orange: "#d97757",
  blue: "#6a9bcc",
  green: "#788c5d",
  mute200: "#e8e6dc",
  mute400: "#b0aea5",
  /** 半透明：用于阴影、悬停、底色等 */
  orangeAlpha: "rgba(217, 119, 87, 0.18)",
  blueAlpha: "rgba(106, 155, 204, 0.18)",
  greenAlpha: "rgba(120, 140, 93, 0.18)",
  inkAlpha: "rgba(20, 20, 19, 0.06)",
} as const;

/** 章节配色：13 章 + 序章/尾声，用于章节标识、概览模式分组色 */
export const chapterColor: Record<string, string> = {
  序: palette.mute400,
  第一章: "#9b8770",
  第二章: palette.orange,
  第三章: "#c98a4a",
  第四章: palette.blue,
  第五章: "#7e9eb6",
  第六章: palette.green,
  第七章: "#a09155",
  第八章: "#a07857",
  第九章: "#9c6c5b",
  第十章: "#7a8556",
  第十一章: "#5d7a6f",
  第十二章: palette.ink,
  第十三章: "#3a4a68",
  尾声: palette.ink,
};
