import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SlideMeta } from "./types";
import { chapterColor } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface OverviewProps {
  open: boolean;
  slides: SlideMeta[];
  current: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

/**
 * Esc 触发的概览模式
 *  - 缩略图网格，按章节分组
 *  - 点击直达，再次 Esc 退出
 */
export function Overview({ open, slides, current, onSelect, onClose }: OverviewProps) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-40 flex flex-col bg-cream/95 backdrop-blur-md"
    >
      <header className="flex items-center justify-between px-12 py-6">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-brand-orange">
            Overview
          </div>
          <h2 className="font-display text-2xl text-ink">幻灯片总览</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-display text-ink/70 hover:bg-ink/5"
        >
          Esc 关闭
        </button>
      </header>

      <ScrollArea className="flex-1 px-12 pb-12">
        <div className="grid grid-cols-4 gap-6">
          {slides.map((slide, idx) => {
            const color = chapterColor[slide.chapter] ?? "#9b8770";
            const active = idx === current;
            return (
              <button
                key={slide.id}
                onClick={() => onSelect(idx)}
                className={cn(
                  "group relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-white p-5 text-left shadow-sm transition-all",
                  "hover:-translate-y-0.5 hover:shadow-md",
                  active
                    ? "border-brand-orange ring-2 ring-brand-orange/40"
                    : "border-ink/10",
                )}
              >
                <div
                  className="absolute left-0 top-0 h-full w-1"
                  style={{ backgroundColor: color }}
                />
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest">
                  <span style={{ color }}>{slide.chapter}</span>
                  <span className="font-mono text-ink/40">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="font-display text-lg leading-snug text-ink">
                  {slide.title}
                </div>
                {slide.steps && slide.steps > 1 && (
                  <div className="text-[11px] text-ink/40">
                    {slide.steps} 个分步
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
