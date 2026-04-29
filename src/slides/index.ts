import type { SlideMeta } from "@/deck/types";

import Cover from "./01-Cover";
import Slide02Preface from "./02-Preface";
import Slide03Ch11EvolutionMap from "./03-Ch1-1-EvolutionMap";
import Slide04Ch12WhyParadigmShift from "./04-Ch1-2-WhyParadigmShift";
import Slide05Ch21WhatIsLLM from "./05-Ch2-1-WhatIsLLM";
import Slide06Ch22Transformer from "./06-Ch2-2-Transformer";
import Slide07Ch23SelfAttention from "./07-Ch2-3-SelfAttention";
import Slide08Ch31ContextWindow from "./08-Ch3-1-ContextWindow";
import Slide09Ch32LostInMiddle from "./09-Ch3-2-LostInMiddle";
import Slide10Ch41PromptContract from "./10-Ch4-1-PromptContract";
import Slide11Ch51ThinkingModes from "./11-Ch5-1-ThinkingModes";
import Slide12Ch61KnowledgeLimits from "./12-Ch6-1-KnowledgeLimits";
import Slide13Ch71OutOfSandbox from "./13-Ch7-1-OutOfSandbox";
import Slide14Ch81McpOverview from "./14-Ch8-1-ToolFragmentation";
import Slide15Ch84CliVsMcp from "./15-Ch8-4-CliVsMcp";
import Slide16Ch92AgentLoop from "./16-Ch9-2-AgentLoop";
import Slide17Ch101SkillOverview from "./17-Ch10-1-WhySkill";
import Slide18Ch105SkillVsMcp from "./18-Ch10-5-SkillVsMcp";
import Slide19Ch111HarnessOverview from "./19-Ch11-1-WhatIsHarness";
import Slide20Ch121WhyHermes from "./20-Ch12-1-WhyHermes";
import Slide21Ch131ResultLoop from "./21-Ch13-1-ResultLoop";
import Slide22Postscript from "./22-Postscript";

export const slides: SlideMeta[] = [
  { id: "cover", title: "封面", chapter: "序", dark: true, steps: 0, component: Cover },
  {
    id: "preface",
    title: '银行客服三十年：从「按 1 按 2」到「替你办完」',
    chapter: "序",
    steps: 4,
    component: Slide02Preface,
  },
  { id: "ch1-1", title: "智能大厦：技术栈的层叠地图", chapter: "第一章", steps: 11, component: Slide03Ch11EvolutionMap },
  { id: "ch1-2", title: "拐点已至：为什么说「范式跃迁」发生在此刻", chapter: "第一章", steps: 6, component: Slide04Ch12WhyParadigmShift },
  { id: "ch2-1", title: "续写引擎：一个会预测下一句的概率模型", chapter: "第二章", steps: 3, component: Slide05Ch21WhatIsLLM },
  { id: "ch2-2", title: "Token：把语言切成可计算的积木", chapter: "第二章", steps: 4, component: Slide06Ch22Transformer },
  { id: "ch2-3", title: "自注意力机制：模型如何动态聚焦一句话", chapter: "第二章", steps: 4, component: Slide07Ch23SelfAttention },
  { id: "ch3-1", title: "上下文窗口：模型的「工作台」", chapter: "第三章", steps: 3, component: Slide08Ch31ContextWindow },
  { id: "ch3-2", title: "Lost in the Middle：中间信息为何更容易「消失」", chapter: "第三章", steps: 2, component: Slide09Ch32LostInMiddle },
  { id: "ch4-1", title: "一句话讲透 Prompt：清晰指令，稳定结果", chapter: "第四章", steps: 5, component: Slide10Ch41PromptContract },
  { id: "ch5-1", title: "从快思考到慢思考：何时更准、何时更贵", chapter: "第五章", steps: 5, component: Slide11Ch51ThinkingModes },
  { id: "ch6-1", title: "知识边界与 RAG：先查文档，再组织回答", chapter: "第六章", steps: 5, component: Slide12Ch61KnowledgeLimits },
  { id: "ch7-1", title: "Tool / 工具：让模型从「说」变成「做」", chapter: "第七章", steps: 5, component: Slide13Ch71OutOfSandbox },
  { id: "ch8-1", title: "统一契约：从碎片化接入到协议化生态", chapter: "第八章", steps: 6, component: Slide14Ch81McpOverview },
  { id: "ch8-4", title: "两条工程路线：快接入 vs 可治理（CLI vs MCP）", chapter: "第八章", steps: 5, component: Slide15Ch84CliVsMcp },
  { id: "ch9-1", title: "从 Generative AI 到 Agent 智能体：多步自主决策", chapter: "第九章", steps: 5, component: Slide16Ch92AgentLoop },
  { id: "ch10-1", title: "Skill / 技能：把「做法」沉淀成可复制的流程标准", chapter: "第十章", steps: 5, component: Slide17Ch101SkillOverview },
  { id: "ch10-5", title: "分工边界：流程封装 × 能力接入", chapter: "第十章", steps: 4, component: Slide18Ch105SkillVsMcp },
  { id: "ch11-1", title: "Harness：约束智能体，放行业务结果", chapter: "第十一章", steps: 6, component: Slide19Ch111HarnessOverview },
  { id: "ch12-1", title: "拼图成塔：前章能力如何组装成 Hermes", chapter: "第十二章", steps: 8, component: Slide20Ch121WhyHermes },
  { id: "ch13-1", title: "三个阶段 · 三个洞察 · 三条实践", chapter: "第十三章", steps: 3, component: Slide21Ch131ResultLoop },
  { id: "postscript", title: "写在最后：此刻，是分水岭", chapter: "尾声", dark: true, steps: 4, component: Slide22Postscript },
];
