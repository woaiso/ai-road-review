import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
// Vite 配置：开启 React 插件，并配置 @ 路径别名指向 src/
export default defineConfig({
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
