import { useEffect } from "react";
import { useDeck } from "./DeckContext";

/**
 * 在 Slide 组件内使用。声明本页有 totalSteps 个分步，
 * 返回当前 step（0..totalSteps）。
 *
 * 同时把 totalSteps 暴露给 Deck，使 next() 能在最后一个 step 时再切页。
 */
export function usePresenterStep(totalSteps: number): number {
  const deck = useDeck();
  // 把当前页的 totalSteps 通过全局对象暴露给 Deck（避免 props 钻取）
  useEffect(() => {
    (window as unknown as { __DECK_STEPS__?: number }).__DECK_STEPS__ = totalSteps;
    return () => {
      (window as unknown as { __DECK_STEPS__?: number }).__DECK_STEPS__ = 0;
    };
  }, [totalSteps]);
  return Math.min(deck.step, totalSteps);
}
