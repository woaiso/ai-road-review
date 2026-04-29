import type { ComponentType } from "react";

/**
 * 单张幻灯片的元数据
 *  - id：URL hash 与 Overview 中的稳定标识
 *  - title：右下角页码旁边显示
 *  - chapter：章节归属（用于章节配色与分组）
 *  - steps：页内 fragment 数量（默认 1，表示无分步）
 *  - dark：是否使用深色背景（封面/章节封面）
 *  - component：实际渲染组件
 */
export interface SlideMeta {
  id: string;
  title: string;
  chapter: string;
  steps?: number;
  dark?: boolean;
  component: ComponentType;
}

/** Deck 全局状态（提供给所有 hooks/UI 消费） */
export interface DeckState {
  index: number;
  step: number;
  overviewOpen: boolean;
  jumpOpen: boolean;
  helpOpen: boolean;
}

export interface DeckActions {
  goTo: (index: number, step?: number) => void;
  next: () => void;
  prev: () => void;
  setStep: (step: number) => void;
  toggleOverview: (open?: boolean) => void;
  toggleJump: (open?: boolean) => void;
  toggleHelp: (open?: boolean) => void;
}
