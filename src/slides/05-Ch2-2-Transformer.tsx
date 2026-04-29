import { Slide } from "@/deck/Slide";
import { Reveal } from "@/components/Reveal";
import { Callout } from "@/components/Callout";
import { usePresenterStep } from "@/deck/usePresenterStep";
import { motion } from "framer-motion";

const CN_TOKENS = ["我", "爱", "北京", "天安门"];
const EN_TOKENS = ["Hello", " World"];
const TOKEN_IDS = [1520, 887, 6421, 19432];
const EMBEDDING_EXAMPLES = ["[0.41, -0.22, 0.87, ...]", "[0.09, 0.76, -0.18, ...]", "[-0.27, 0.61, 0.12, ...]", "[0.73, -0.08, 0.35, ...]"];

// 用二维散点承接“高维空间直觉”，让观众更容易理解 Embedding。
const SPACE_POINTS = [
  { word: "国王", x: 120, y: 84, group: "royal" },
  { word: "女王", x: 176, y: 118, group: "royal" },
  { word: "猫", x: 344, y: 184, group: "pet" },
  { word: "狗", x: 398, y: 206, group: "pet" },
  { word: "苹果", x: 548, y: 86, group: "fruit" },
  { word: "香蕉", x: 602, y: 122, group: "fruit" },
];

const GROUP_COLOR: Record<string, string> = {
  royal: "#6a9bcc",
  pet: "#788c5d",
  fruit: "#d97757",
};

export default function Slide05Ch22Transformer() {
  const step = usePresenterStep(4);

  return (
    <Slide eyebrow="第二章 · Transformer" title="Token：把语言切成可计算的积木">
      <div className="grid h-full grid-cols-[1.05fr_1fr] gap-8">
        <div className="flex flex-col gap-4">
          <Reveal show={step >= 1} variant="rise">
            <Callout tone="info" title="一句话定义">
              AI 不直接处理“文字”，它处理的是 <span className="font-semibold text-ink">Token</span>：
              可以理解成语言的积木块。
            </Callout>
          </Reveal>

          <Reveal show={step >= 2} variant="rise">
            <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
              <div className="font-display text-[11px] tracking-[0.18em] text-brand-orange uppercase">
                Step 1 · Token：把语言切成积木块
              </div>
              <div className="mt-3 space-y-3">
                <div className="font-serif text-[14px] text-ink/72">
                  “我爱北京天安门” 可能被切成：
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {CN_TOKENS.map((token) => (
                    <span
                      key={token}
                      className="rounded-md border border-brand-orange/35 bg-brand-orange/10 px-3 py-1.5 font-mono text-[16px] text-brand-orange"
                    >
                      {token}
                    </span>
                  ))}
                </div>
                <div className="font-serif text-[14px] text-ink/72">
                  “Hello World” 可能是：
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {EN_TOKENS.map((token) => (
                    <span
                      key={token}
                      className="rounded-md border border-brand-blue/35 bg-brand-blue/10 px-3 py-1.5 font-mono text-[16px] text-brand-blue"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal show={step >= 3} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-[#1f1d1b] p-5 text-cream shadow-md">
              <div className="font-display text-[11px] tracking-[0.18em] text-brand-orange uppercase">
                Step 2 · Token ID -&gt; Embedding
              </div>
              <div className="mt-3 space-y-2.5 font-mono text-[13px] leading-relaxed">
                {CN_TOKENS.map((token, idx) => (
                  <div key={token} className="grid grid-cols-[78px_72px_1fr] items-center gap-2">
                    <span className="text-brand-orange">{token}</span>
                    <span className="text-brand-blue/90">{TOKEN_IDS[idx]}</span>
                    <span className="text-cream/80">{EMBEDDING_EXAMPLES[idx]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-1 font-serif text-[12px] text-cream/60">
                <div>Token 数量会直接影响：上下文窗口上限、推理时延、API 计费。</div>
                <div>工程里经常会把 Token 当作“精度与成本”的共同刻度。</div>
              </div>
            </div>
          </Reveal>

          <Reveal show={step >= 4} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="font-display text-[11px] tracking-[0.18em] text-brand-orange uppercase">
                Token 工程含义
              </div>
              <div className="mt-2 space-y-1.5 font-serif text-[14px] leading-relaxed text-ink/72">
                <div>上下文上限本质是“最多可容纳多少 Token”。</div>
                <div>推理速度常用 Token/s 衡量，Token 越多总体时延越高。</div>
                <div>主流 API 通常按输入/输出 Token 计费。</div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="space-y-4">
          <Reveal show={step >= 3} variant="scale">
            <div className="rounded-2xl border border-ink/8 bg-white p-4 shadow-sm">
              <div className="font-display text-[11px] tracking-[0.18em] text-brand-orange uppercase">
                Embedding 直觉类比
              </div>
              <div className="mt-2 font-serif text-[14px] leading-relaxed text-ink/72">
                想象一个语义空间：意思相近的词，位置也更接近。
              </div>
              <svg viewBox="0 0 700 270" className="mt-3 w-full">
                {Array.from({ length: 8 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1={0}
                    y1={i * 34}
                    x2={700}
                    y2={i * 34}
                    stroke="#ece7dd"
                    strokeWidth={1}
                  />
                ))}
                {Array.from({ length: 15 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 50}
                    y1={0}
                    x2={i * 50}
                    y2={270}
                    stroke="#ece7dd"
                    strokeWidth={1}
                  />
                ))}
                {SPACE_POINTS.map((p, idx) => (
                  <motion.g
                    key={p.word}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.24, delay: idx * 0.05 }}
                  >
                    <circle cx={p.x} cy={p.y} r={8} fill={GROUP_COLOR[p.group]} />
                    <text x={p.x + 12} y={p.y + 5} fontSize={15} fontWeight={600} fill="#141413">
                      {p.word}
                    </text>
                  </motion.g>
                ))}
              </svg>
              <div className="mt-2 rounded-lg bg-cream px-3 py-2 font-serif text-[13px] text-ink/66">
                直觉：词义越接近，在空间里的距离通常越近。
              </div>
            </div>
          </Reveal>

          <Reveal show={step >= 4} variant="rise">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="font-display text-[11px] tracking-[0.18em] text-brand-orange uppercase">
                过渡到下一页
              </div>
              <div className="mt-2 font-serif text-[14px] leading-relaxed text-ink/72">
                有了 Token 与 Embedding，下一步问题是：模型如何在整句里动态聚焦关键线索？
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
