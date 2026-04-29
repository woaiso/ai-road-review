import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * Self-Attention 可视化：
 *  - 顶部：整句 token 横排，高亮当前焦点词
 *  - 中部：焦点词对应的 Top 关联词权重条（替代连线，避免遮挡）
 *  - 底部：当前推理结论，配合 step 做讲解推进
 */
const TOKENS = ["小明", "拿起", "桌上", "的", "苹果", "，", "他", "尝试", "咬", "了", "一口"];
type FocusToken = "他" | "咬" | "说____";

const FOCUS_BY_STEP: Record<number, FocusToken> = {
  2: "他",
  3: "咬",
  4: "说____",
  5: "说____",
};

type WeightItem = { token: string; weight: number; note: string };
type CandidateItem = { token: string; score: number };

const WEIGHT_TABLE: Record<FocusToken, WeightItem[]> = {
  他: [
    { token: "小明", weight: 0.88, note: "指代主体" },
    { token: "苹果", weight: 0.34, note: "同句语义" },
    { token: "咬", weight: 0.21, note: "动作关联" },
  ],
  咬: [
    { token: "苹果", weight: 0.91, note: "动作对象" },
    { token: "他", weight: 0.76, note: "动作发出者" },
    { token: "一口", weight: 0.48, note: "动作程度" },
  ],
  说____: [
    { token: "苹果", weight: 0.86, note: "味觉对象" },
    { token: "咬", weight: 0.74, note: "触发体验" },
    { token: "一口", weight: 0.59, note: "体验线索" },
  ],
};

const SUMMARY_BY_FOCUS: Record<FocusToken, string> = {
  他: "代词“他”优先回指到“小明”，完成指代消歧。",
  咬: "“咬”同时读取“他+苹果”，形成主谓宾关系。",
  "说____": "“说____”聚合前文线索，最可能补全为“很甜”。",
};

const CANDIDATES_BY_FOCUS: Record<FocusToken, CandidateItem[]> = {
  他: [
    { token: "小明", score: 0.92 },
    { token: "苹果", score: 0.41 },
    { token: "篮子", score: 0.18 },
  ],
  咬: [
    { token: "苹果", score: 0.89 },
    { token: "桌上", score: 0.38 },
    { token: "小明", score: 0.33 },
  ],
  "说____": [
    { token: "很甜", score: 0.94 },
    { token: "有点酸", score: 0.52 },
    { token: "真脆", score: 0.47 },
    { token: "不错", score: 0.39 },
  ],
};

export function AttentionMatrix({ activeStep = 0 }: { activeStep?: number }) {
  const focus: FocusToken | null = activeStep >= 2 ? FOCUS_BY_STEP[activeStep] ?? "说____" : null;
  const focusLabel = focus ?? "请先进入 Step 2";
  const weights = focus ? WEIGHT_TABLE[focus] : [];
  const candidates = focus ? CANDIDATES_BY_FOCUS[focus] : [];
  const bestCandidate = candidates[0];

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="rounded-xl border border-ink/10 bg-mute-100 px-3 py-2">
        <div className="mb-2 flex items-center justify-between">
          <div className="font-display text-[11px] tracking-[0.16em] text-ink/55 uppercase">Token 视图</div>
          <div className="font-serif text-[13px] text-ink/70">
            焦点词：<span className="font-semibold text-brand-orange">{focusLabel}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {TOKENS.map((tk, idx) => {
            const isFocused = focus === tk;
            return (
              <motion.div
                key={`${tk}-${idx}`}
                className="rounded-md border px-2.5 py-1.5 font-serif text-[14px]"
                animate={{
                  backgroundColor: isFocused ? "#d97757" : "#faf9f5",
                  borderColor: isFocused ? "#d97757" : "#d7d0c5",
                  color: isFocused ? "#faf9f5" : "#23211d",
                }}
                transition={{ duration: 0.25, ease }}
              >
                {tk}
              </motion.div>
            );
          })}
          <motion.div
            className="rounded-md border px-2.5 py-1.5 font-serif text-[14px]"
            animate={{
              backgroundColor: focus === "说____" ? "#d97757" : "#faf9f5",
              borderColor: focus === "说____" ? "#d97757" : "#d7d0c5",
              color: focus === "说____" ? "#faf9f5" : "#23211d",
            }}
            transition={{ duration: 0.25, ease }}
          >
            说____
          </motion.div>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-ink/10 bg-white px-3 py-3">
        <div className="font-display text-[11px] tracking-[0.16em] text-ink/55 uppercase">
          Top 关联词权重（无遮挡模式）
        </div>
        <div className="mt-3 space-y-2.5">
          {weights.length === 0 && (
            <div className="rounded-lg bg-mute-100 px-3 py-2 font-serif text-[14px] text-ink/65">
              Step 1 先讲原理，Step 2 开始展示注意力权重。
            </div>
          )}
          {weights.map((item, idx) => (
            <div key={`${item.token}-${idx}`} className="grid grid-cols-[80px_1fr_68px] items-center gap-2.5">
              <div className="font-serif text-[14px] text-ink/78">{item.token}</div>
              <div className="h-2.5 overflow-hidden rounded-full bg-mute-100">
                <motion.div
                  className="h-full rounded-full bg-brand-orange"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.weight * 100}%` }}
                  transition={{ duration: 0.45, ease, delay: idx * 0.05 }}
                />
              </div>
              <div className="text-right font-mono text-[12px] text-ink/65">{item.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-brand-blue/30 bg-brand-blue/10 px-3 py-2.5 font-serif text-[14px] leading-relaxed text-ink/80">
        {focus ? SUMMARY_BY_FOCUS[focus] : "Self-Attention 会按相关度动态分配“关注预算”，再聚合全句信息。"}
      </div>

      {focus && (
        <div className="rounded-lg border border-brand-green/30 bg-white px-3 py-2.5">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-display text-[11px] tracking-[0.16em] text-ink/55 uppercase">候选词打分</div>
            <div className="font-mono text-[12px] text-ink/65">argmax 匹配度</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {candidates.map((item, idx) => {
              const isBest = idx === 0;
              return (
                <motion.div
                  key={`${item.token}-${idx}`}
                  className="rounded-md border px-2.5 py-1.5"
                  animate={{
                    backgroundColor: isBest ? "#e6f4ef" : "#faf9f5",
                    borderColor: isBest ? "#6b9f86" : "#d7d0c5",
                  }}
                  transition={{ duration: 0.25, ease }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif text-[14px] text-ink/85">{item.token}</span>
                    <span className="font-mono text-[12px] text-ink/65">{item.score.toFixed(2)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {focus === "说____" && bestCandidate && (
            <div className="mt-2 rounded-md bg-brand-green/10 px-2.5 py-1.5 font-serif text-[13px] text-ink/80">
              最终命中：<span className="font-semibold text-brand-green">{bestCandidate.token}</span>
              （匹配度 {bestCandidate.score.toFixed(2)}）
            </div>
          )}
        </div>
      )}
    </div>
  );
}
