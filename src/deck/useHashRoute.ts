import { useEffect, useRef } from "react";

/**
 * 解析 URL hash 形如 "#/3/2"：第 3 页（1-based）第 2 步
 * 返回 { index, step }（均 0-based）
 */
export function parseHash(hash: string): { index: number; step: number } | null {
  const match = hash.match(/^#\/(\d+)(?:\/(\d+))?$/);
  if (!match) return null;
  const indexOneBased = Number(match[1]);
  const stepRaw = match[2] != null ? Number(match[2]) : 0;
  if (!Number.isFinite(indexOneBased) || indexOneBased < 1) return null;
  return { index: indexOneBased - 1, step: Math.max(0, stepRaw) };
}

export function buildHash(index: number, step: number): string {
  // hash 中页码采用 1-based，更直观；step 仅在大于 0 时附加
  const indexPart = index + 1;
  return step > 0 ? `#/${indexPart}/${step}` : `#/${indexPart}`;
}

/**
 * 双向同步：
 *  - 监听 hashchange，将外部 URL 变化推回 Deck 状态
 *  - 在 index/step 变化时主动更新 hash
 */
export function useHashRoute(
  index: number,
  step: number,
  onHash: (parsed: { index: number; step: number }) => void,
) {
  const lastWritten = useRef<string>("");

  useEffect(() => {
    const handler = () => {
      const parsed = parseHash(window.location.hash);
      if (parsed && buildHash(parsed.index, parsed.step) !== lastWritten.current) {
        onHash(parsed);
      }
    };
    window.addEventListener("hashchange", handler);
    handler();
    return () => window.removeEventListener("hashchange", handler);
  }, [onHash]);

  useEffect(() => {
    const next = buildHash(index, step);
    if (next !== window.location.hash) {
      lastWritten.current = next;
      history.replaceState(null, "", next);
    }
  }, [index, step]);
}
