import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Vite 配置：开启 React 插件，并配置 @ 路径别名指向 src/
// base 设为仓库名，以确保 GitHub Pages 子路径下资源引用正确
export default defineConfig({
  base: "/ai-road-review/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
