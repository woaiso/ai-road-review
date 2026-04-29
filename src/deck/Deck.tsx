import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { SlideMeta } from "./types";
import { DeckContext, type DeckContextValue } from "./DeckContext";
import { ProgressBar } from "./ProgressBar";
import { PageIndicator } from "./PageIndicator";
import { Overview } from "./Overview";
import { JumpPalette } from "./JumpPalette";
import { HelpDialog } from "./HelpDialog";
import { useKeyBindings } from "./useKeyBindings";
import { useHashRoute, parseHash } from "./useHashRoute";
import { clamp } from "@/lib/utils";

interface DeckProps {
  slides: SlideMeta[];
}

/**
 * 画布完全使用浏览器原生 CSS 响应式：
 *  - 没有任何 transform: scale
 *  - 画布尺寸 = 100vw × 100vh
 *  - 内部所有 px 单位由 PostCSS 在编译时换算成 vw（基于 1920 设计稿）
 *  - 视口宽度变化时，整张幻灯片按 vw 等比流动，是真正的 CSS 响应式
 */

/**
 * 顶层 Deck 容器：
 *  - 统一布局、进度条、页码、概览、命令面板
 *  - 监听键盘 / hash，集中管理 index/step
 */
export function Deck({ slides }: DeckProps) {
  // 初始化时尝试从 URL hash 还原位置
  const initial = useMemo(() => {
    const parsed = parseHash(window.location.hash);
    return parsed ?? { index: 0, step: 0 };
  }, []);

  const [index, setIndex] = useState(initial.index);
  const [step, setStep] = useState(initial.step);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const safeIndex = clamp(index, 0, slides.length - 1);
  const current = slides[safeIndex];
  const totalSteps = current.steps ?? 1;

  /**
   * 用 ref 跟踪"最新"的 index/step。
   *
   * 之前 next/prev 的实现里，先 setStep 再 setTimeout(setIndex(...))，
   * 在快速连按方向键时会出现：
   *   - 第一次按：step 已到 limit → 不变 → 安排 setTimeout 推进 index
   *   - 第二次按（state 还没刷新）：step 仍在 limit → 又安排一个 setTimeout
   *   - 两个 setTimeout 都执行 → index 连跳两格 → 中间页被跳过
   * 这里改成同步路径，用 ref 立刻反映最新意图，从而不会重复推进。
   */
  const stateRef = useRef({ index: safeIndex, step });
  useEffect(() => {
    stateRef.current = { index: safeIndex, step };
  }, [safeIndex, step]);

  // ── step 边界语义 ─────────────────────────────────────────────
  // `SlideMeta.steps` 表示"页内 fragment 数量"（与 usePresenterStep 的注释一致：
  //  返回 step ∈ [0..totalSteps]）。
  //  → step=0 是"未触发任何 fragment"的初始态；
  //  → step=N 是"第 N 个 fragment 已触发"的终态；
  //  → 共 (steps + 1) 个有效 state，最大可达 step = steps（不是 steps - 1）。
  // 历史 bug：之前 stepLimit = steps - 1，导致几乎所有 slide 的"末尾 callout / 总结卡"
  //         （写法是 `step >= steps`）永远不显示。已通过下面统一的 stepLimit = steps 修复。
  const getStepLimit = useCallback(
    (slideIndex: number) => slides[slideIndex]?.steps ?? 1,
    [slides],
  );

  // 切页时重置 step；若指定 step 则使用指定值
  const goTo = useCallback(
    (nextIndex: number, nextStep = 0) => {
      const clamped = clamp(nextIndex, 0, slides.length - 1);
      const stepLimit = getStepLimit(clamped);
      const clampedStep = clamp(nextStep, 0, Math.max(0, stepLimit));
      stateRef.current = { index: clamped, step: clampedStep };
      setIndex(clamped);
      setStep(clampedStep);
    },
    [slides, getStepLimit],
  );

  // next() 优先消化页内 fragment，再切页（同步推进，避免 setTimeout 引发的重复跳页）
  const next = useCallback(() => {
    const { index: i, step: s } = stateRef.current;
    const stepLimit = getStepLimit(i);
    if (s < stepLimit) {
      const ns = s + 1;
      stateRef.current = { index: i, step: ns };
      setStep(ns);
      return;
    }
    if (i < slides.length - 1) {
      const ni = i + 1;
      stateRef.current = { index: ni, step: 0 };
      setIndex(ni);
      setStep(0);
    }
  }, [slides, getStepLimit]);

  const prev = useCallback(() => {
    const { index: i, step: s } = stateRef.current;
    if (s > 0) {
      const ns = s - 1;
      stateRef.current = { index: i, step: ns };
      setStep(ns);
      return;
    }
    if (i > 0) {
      const ni = i - 1;
      // 回到上一页时直接定位到该页的"完整终态"，便于讲者倒回时看到完整内容
      const ns = getStepLimit(ni);
      stateRef.current = { index: ni, step: ns };
      setIndex(ni);
      setStep(ns);
    }
  }, [slides, getStepLimit]);

  const setStepDirect = useCallback(
    (nextStep: number) => {
      const ns = clamp(nextStep, 0, totalSteps);
      stateRef.current = { ...stateRef.current, step: ns };
      setStep(ns);
    },
    [totalSteps],
  );

  const toggleOverview = useCallback(
    (open?: boolean) => setOverviewOpen((curr) => open ?? !curr),
    [],
  );
  const toggleJump = useCallback(
    (open?: boolean) => setJumpOpen((curr) => open ?? !curr),
    [],
  );
  const toggleHelp = useCallback(
    (open?: boolean) => setHelpOpen((curr) => open ?? !curr),
    [],
  );

  // 与 URL hash 双向同步
  useHashRoute(safeIndex, step, ({ index: i, step: s }) => {
    const ni = clamp(i, 0, slides.length - 1);
    const stepLimit = getStepLimit(ni);
    const ns = clamp(s, 0, Math.max(0, stepLimit));
    stateRef.current = { index: ni, step: ns };
    setIndex(ni);
    setStep(ns);
  });

  const state = { index: safeIndex, step, overviewOpen, jumpOpen, helpOpen };
  const actions = {
    goTo,
    next,
    prev,
    setStep: setStepDirect,
    toggleOverview,
    toggleJump,
    toggleHelp,
  };

  // 键盘快捷键
  useKeyBindings(state, actions);

  const ctxValue: DeckContextValue = { ...state, ...actions, slides };

  const SlideComponent = current.component;
  const dark = current.dark ?? false;

  return (
    <DeckContext.Provider value={ctxValue}>
      <div
        className={`relative h-screen w-screen overflow-hidden ${dark ? "bg-ink" : "bg-cream"}`}
      >
        {/* 画布：100vw × 100vh，PostCSS 把所有 px 换成 vw 后天然响应式，无 scale */}
        <div
          className="deck-canvas absolute inset-0"
          style={{ backgroundColor: dark ? "#141413" : "#faf9f5" }}
        >
          {/*
           * 不加 initial={false}：
           *  - AnimatePresence 的 initial={false} 会通过 PresenceContext 向下传播，
           *    导致首次加载时子树内所有 motion 的入场动画被静默，体验"死板"。
           *  - 保留默认行为（initial=true）意味着首页加载时 Slide 的整体淡入 + 子元素
           *    的编排动画都会播放；后续翻页进出动画一致。
           */}
          <AnimatePresence mode="wait">
            <div key={current.id} className="absolute inset-0">
              <SlideComponent />
            </div>
          </AnimatePresence>

          <ProgressBar current={safeIndex} total={slides.length} />
          <PageIndicator
            index={safeIndex}
            total={slides.length}
            chapter={current.chapter}
            title={current.title}
          />
        </div>

        {/* 全局浮层 */}
        <Overview
          open={overviewOpen}
          slides={slides}
          current={safeIndex}
          onSelect={(i) => {
            goTo(i, 0);
            setOverviewOpen(false);
          }}
          onClose={() => setOverviewOpen(false)}
        />
        <JumpPalette
          open={jumpOpen}
          onOpenChange={setJumpOpen}
          slides={slides}
          onJump={(i) => goTo(i, 0)}
        />
        <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />

        {/* 提示 */}
        <div className="deck-chrome pointer-events-none absolute bottom-6 left-10 z-30 font-display text-[12px] tracking-wider text-ink/40">
          ← → 翻页 · Esc 概览 · G 跳页 · ? 帮助
        </div>
      </div>
    </DeckContext.Provider>
  );
}
