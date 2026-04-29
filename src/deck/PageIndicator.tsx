import { chapterColor } from "@/lib/theme";

interface PageIndicatorProps {
  index: number;
  total: number;
  chapter: string;
  title: string;
}

/**
 * 右下页码 + 章节小标 + 当前页标题
 */
export function PageIndicator({ index, total, chapter, title }: PageIndicatorProps) {
  const color = chapterColor[chapter] ?? "#9b8770";
  return (
    <div className="deck-chrome pointer-events-none absolute bottom-6 right-10 z-30 flex items-center gap-4 font-display text-[13px] tracking-wider">
      <span
        className="rounded-full px-3 py-1 text-cream"
        style={{ backgroundColor: color }}
      >
        {chapter}
      </span>
      <span className="text-ink/55">{title}</span>
      <span className="font-mono text-ink/70">
        <span className="text-ink">{String(index + 1).padStart(2, "0")}</span>
        <span className="opacity-50"> / {String(total).padStart(2, "0")}</span>
      </span>
    </div>
  );
}
