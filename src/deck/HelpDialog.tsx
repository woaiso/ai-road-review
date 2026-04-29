import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS: Array<{ keys: string; desc: string }> = [
  { keys: "→  Space  Enter  PageDown", desc: "下一步 / 下一页" },
  { keys: "←  Backspace  PageUp", desc: "上一步 / 上一页" },
  { keys: "Home / End", desc: "跳到首页 / 末页" },
  { keys: "Esc", desc: "进入或退出概览" },
  { keys: "G", desc: "打开跳页命令面板" },
  { keys: "F", desc: "切换全屏" },
  { keys: "?", desc: "显示此帮助" },
];

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">键盘快捷键</DialogTitle>
          <DialogDescription>
            演讲时使用键盘控制，更专注更流畅。
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid grid-cols-1 gap-2">
          {SHORTCUTS.map((s) => (
            <div
              key={s.keys}
              className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2"
            >
              <code className="font-mono text-[13px] text-ink/80">{s.keys}</code>
              <span className="text-sm text-ink/70">{s.desc}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
