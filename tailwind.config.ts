import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// Tailwind 配置：注入 Anthropic 品牌配色与字体；
// 同时给 shadcn/ui 提供基于 CSS 变量的语义颜色（在 globals.css 中定义）
const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        // 直接可用的品牌色（用于自研业务组件）
        cream: "#faf9f5",
        ink: "#141413",
        brand: {
          orange: "#d97757",
          blue: "#6a9bcc",
          green: "#788c5d",
        },
        mute: {
          400: "#b0aea5",
          200: "#e8e6dc",
        },
        // shadcn/ui 语义色（CSS 变量驱动，可在 globals.css 重写）
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Poppins 用于英文标题、Lora 用于英文正文
        // 中文回落到思源宋体/Noto Serif SC 与 PingFang SC
        display: [
          "Poppins",
          "Source Han Sans SC",
          "Noto Sans SC",
          "PingFang SC",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        serif: [
          "Lora",
          "Source Han Serif SC",
          "Noto Serif SC",
          "Songti SC",
          "Georgia",
          "serif",
        ],
        mono: [
          "JetBrains Mono",
          "Menlo",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      aspectRatio: {
        slide: "16 / 9",
      },
      keyframes: {
        // shadcn 默认动画
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // 自定义动效（PPT 专属）
        "draw-line": {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "draw-line": "draw-line 1.2s ease-out forwards",
        shimmer: "shimmer 3s ease-in-out infinite",
        breathe: "breathe 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
