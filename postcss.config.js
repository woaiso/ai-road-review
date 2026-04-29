/**
 * PostCSS 配置
 *
 * 关键：postcss-px-to-viewport-8-plugin 把所有 px 自动换算成 vw。
 *  - viewportWidth = 1920：所有 px 按 1920 宽设计稿换算 (1px = 1/1920 * 100vw)
 *  - 浏览器宽度变化时，所有元素按视口宽度等比响应（真·CSS 响应式，无 transform: scale）
 *  - 给需要"物理像素"的元素加 .px-fixed 类即可绕过换算
 */
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import pxToViewport from "postcss-px-to-viewport-8-plugin";

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
    pxToViewport({
      viewportWidth: 1920,
      unitPrecision: 5,
      viewportUnit: "vw",
      fontViewportUnit: "vw",
      selectorBlackList: ["html", "body", ".px-fixed"],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      exclude: [/node_modules/],
    }),
  ],
};
