import { glmChat, isGlmConfigured } from "@/lib/ai/glm";
import { glmToolDefs, executeTool } from "@/lib/ai/tools";
import { systemPromptFor, ASSISTANT_LOW_GROUNDING } from "@/lib/ai/prompts";

/**
 * Assistant orchestration core (Phase 5 loop, extracted in Phase 7).
 * Pure model + tools — no persistence, no rate limiting. Both the public
 * /api/assistant route and the eval runner use this exact code path, so
 * eval results always reflect production behavior.
 */

export type AssistantMode = "GENERAL" | "RECRUITER" | "ENGINEERING";

const MAX_ROUNDS = 3;

export async function runAssistant(input: {
  mode: AssistantMode;
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}): Promise<{
  answer: string;
  sources: string[];
  usage: { inputTokens: number; outputTokens: number };
}> {
  const { mode, message } = input;
  const chat: { role: "user" | "assistant"; content: string }[] = [
    ...(input.history ?? []),
    { role: "user", content: message },
  ];

  const toolDefs = glmToolDefs();
  const collectedSources = new Set<string>();
  let answer = "";
  const usage = { inputTokens: 0, outputTokens: 0 };

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const completion = await glmChat(await systemPromptFor(mode), chat, toolDefs);
    usage.inputTokens += completion.usage.inputTokens;
    usage.outputTokens += completion.usage.outputTokens;

    if (completion.toolCalls.length === 0) {
      answer = completion.text;
      break;
    }

    // Execute the requested tools, feed results back as a user message
    const results = [] as { tool: string; data: unknown }[];
    for (const call of completion.toolCalls) {
      const out = await executeTool(call.name, call.arguments);
      results.push({ tool: call.name, data: out ?? { error: "unknown tool" } });
      if (out) for (const src of out.sources) collectedSources.add(src);
    }
    chat.push({ role: "assistant", content: `[runs tools: ${completion.toolCalls.map((c) => c.name).join(", ")}]` });
    chat.push({ role: "user", content: `Tool results (JSON): ${JSON.stringify(results)}` });
    answer = completion.text; // intermediate text — overwritten by later rounds
  }

  if (!answer) answer = ASSISTANT_LOW_GROUNDING;

  return { answer, sources: [...collectedSources], usage };
}

export { isGlmConfigured };
