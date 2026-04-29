import type { ReactNode } from "react";
import { Sparkles, AlertTriangle, Info, Quote, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutTone = "insight" | "warn" | "info" | "quote" | "tip";

const TONE: Record<
  CalloutTone,
  { icon: typeof Sparkles; bg: string; border: string; iconColor: string; title: string }
> = {
  insight: {
    icon: Sparkles,
    bg: "bg-brand-orange/8",
    border: "border-brand-orange/40",
    iconColor: "text-brand-orange",
    title: "INSIGHT",
  },
  warn: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-300",
    iconColor: "text-amber-600",
    title: "注意",
  },
  info: {
    icon: Info,
    bg: "bg-brand-blue/8",
    border: "border-brand-blue/40",
    iconColor: "text-brand-blue",
    title: "提示",
  },
  quote: {
    icon: Quote,
    bg: "bg-mute-100",
    border: "border-ink/15",
    iconColor: "text-ink/60",
    title: "引用",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-brand-green/8",
    border: "border-brand-green/40",
    iconColor: "text-brand-green",
    title: "TIP",
  },
};

/**
 * 强调块：用于"洞察 / 引用 / 提示"
 *  - 不同 tone 对应 Anthropic 调色板中不同色相
 */
export function Callout({
  tone = "insight",
  title,
  children,
  className,
}: {
  tone?: CalloutTone;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const t = TONE[tone];
  const Icon = t.icon;
  return (
    <div className={cn("rounded-xl border-l-4 px-6 py-4", t.bg, t.border, className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-1 h-5 w-5 shrink-0", t.iconColor)} />
        <div className="flex-1">
          <div
            className={cn(
              "mb-1 font-display text-[12px] font-semibold uppercase tracking-[0.18em]",
              t.iconColor,
            )}
          >
            {title ?? t.title}
          </div>
          <div className="text-[18px] leading-relaxed text-ink/85">{children}</div>
        </div>
      </div>
    </div>
  );
}
