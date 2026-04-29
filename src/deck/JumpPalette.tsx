import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { SlideMeta } from "./types";

interface JumpPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slides: SlideMeta[];
  onJump: (index: number) => void;
}

/**
 * 跳页命令面板（按 G 触发）
 *  - 支持搜索章节名 / 标题
 *  - 选中后立即跳转
 */
export function JumpPalette({ open, onOpenChange, slides, onJump }: JumpPaletteProps) {
  // 按章节分组
  const groups = new Map<string, SlideMeta[]>();
  slides.forEach((s) => {
    if (!groups.has(s.chapter)) groups.set(s.chapter, []);
    groups.get(s.chapter)!.push(s);
  });

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="输入章节或关键词，回车跳转..." />
      <CommandList>
        <CommandEmpty>未找到匹配的幻灯片</CommandEmpty>
        {Array.from(groups.entries()).map(([chapter, items]) => (
          <CommandGroup key={chapter} heading={chapter}>
            {items.map((slide) => {
              const idx = slides.indexOf(slide);
              return (
                <CommandItem
                  key={slide.id}
                  value={`${chapter} ${slide.title} ${slide.id}`}
                  onSelect={() => {
                    onJump(idx);
                    onOpenChange(false);
                  }}
                >
                  <span className="mr-3 inline-block w-8 font-mono text-xs text-ink/40">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span>{slide.title}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
