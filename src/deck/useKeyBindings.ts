import { useEffect } from "react";
import type { DeckActions, DeckState } from "./types";

/**
 * 全局快捷键绑定
 *  - ←/PageUp/Backspace：上一步（先回 fragment，再跳页）
 *  - →/Space/Enter/PageDown：下一步
 *  - Home/End：首尾页
 *  - Esc：切换概览模式
 *  - F：切换全屏
 *  - G：跳转命令面板
 *  - ?：帮助弹窗
 *
 * 内部已避开输入框场景，避免污染 cmdk 命令面板等输入交互
 */
export function useKeyBindings(state: DeckState, actions: DeckActions) {
  useEffect(() => {
    function shouldIgnore(event: KeyboardEvent): boolean {
      const target = event.target as HTMLElement | null;
      if (!target) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (target.isContentEditable) return true;
      return false;
    }

    function onKey(event: KeyboardEvent) {
      if (shouldIgnore(event)) return;

      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
        case "Enter":
          event.preventDefault();
          actions.next();
          break;
        case "ArrowLeft":
        case "PageUp":
        case "Backspace":
          event.preventDefault();
          actions.prev();
          break;
        case "Home":
          event.preventDefault();
          actions.goTo(0, 0);
          break;
        case "End":
          event.preventDefault();
          actions.goTo(Number.MAX_SAFE_INTEGER, 0);
          break;
        case "Escape":
          if (state.jumpOpen) {
            actions.toggleJump(false);
          } else if (state.helpOpen) {
            actions.toggleHelp(false);
          } else {
            actions.toggleOverview();
          }
          break;
        case "f":
        case "F":
          event.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen().catch(() => {});
          }
          break;
        case "g":
        case "G":
          event.preventDefault();
          actions.toggleJump(true);
          break;
        case "?":
        case "/":
          if (event.key === "?" || (event.key === "/" && event.shiftKey)) {
            event.preventDefault();
            actions.toggleHelp();
          }
          break;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, actions]);
}
