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
  /**
   * 统一跳转入口：
   * - 先跳页，再关闭面板，避免不同事件路径下行为不一致
   */
  const handleJump = (index: number) => {
    onJump(index);
    onOpenChange(false);
  };

  // 按章节分组
  const groups = new Map<string, Array<{ slide: SlideMeta; index: number }>>();
  slides.forEach((s, index) => {
    if (!groups.has(s.chapter)) groups.set(s.chapter, []);
    groups.get(s.chapter)!.push({ slide: s, index });
  });

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="输入章节或关键词，回车跳转..." />
      <CommandList>
        <CommandEmpty>未找到匹配的幻灯片</CommandEmpty>
        {Array.from(groups.entries()).map(([chapter, items]) => (
          <CommandGroup key={chapter} heading={chapter}>
            {items.map(({ slide, index: idx }) => {
              return (
                <CommandItem
                  key={slide.id}
                  value={`${chapter} ${slide.title} ${slide.id}`}
                  /**
                   * cmdk 常规选择路径（键盘 Enter / 鼠标选择）
                   */
                  onSelect={() => handleJump(idx)}
                  /**
                   * 某些浏览器/焦点时序下，首次点击可能先触发焦点迁移，
                   * 这里阻止默认 mousedown，确保点击直接命中条目。
                   */
                  onMouseDown={(event) => event.preventDefault()}
                  /**
                   * 兜底：即使 onSelect 未触发，也能在点击时完成跳转。
                   */
                  onClick={() => handleJump(idx)}
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
