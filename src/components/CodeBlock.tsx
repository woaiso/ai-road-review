import { cn } from "@/lib/utils";

/**
 * 简洁的代码展示：
 *  - 不接入 shiki（避免运行时开销），保持 monospace + 暗色背景
 *  - 支持高亮某些行（lineHighlights）
 */
export function CodeBlock({
  code,
  language = "txt",
  highlights,
  className,
  caption,
}: {
  code: string;
  language?: string;
  highlights?: number[];
  className?: string;
  caption?: string;
}) {
  const lines = code.split("\n");
  return (
    <div className={cn("overflow-hidden rounded-xl bg-[#1f1d1b] shadow-md", className)}>
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-white/40">
          {language}
        </div>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[14px] leading-relaxed text-cream/90">
        {lines.map((line, idx) => {
          const lineNo = idx + 1;
          const highlighted = highlights?.includes(lineNo);
          return (
            <div
              key={lineNo}
              className={cn(
                "-mx-5 flex items-start px-5",
                highlighted && "bg-brand-orange/10",
              )}
            >
              <span className="mr-4 inline-block w-6 select-none text-right text-white/30">
                {lineNo}
              </span>
              <code className="whitespace-pre">{line || " "}</code>
            </div>
          );
        })}
      </pre>
      {caption && (
        <div className="border-t border-white/5 px-5 py-2 text-[12px] text-white/45">
          {caption}
        </div>
      )}
    </div>
  );
}
