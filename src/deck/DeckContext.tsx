import { createContext, useContext } from "react";
import type { DeckActions, DeckState, SlideMeta } from "./types";

/**
 * Deck Context：在 Deck 组件树中提供全局状态与 actions
 * 任何子组件可通过 useDeck() 读取当前页/step/各种弹窗开关
 */
export interface DeckContextValue extends DeckState, DeckActions {
  slides: SlideMeta[];
}

export const DeckContext = createContext<DeckContextValue | null>(null);

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeck 必须在 <Deck> 内使用");
  return ctx;
}
