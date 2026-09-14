import Anthropic from "@anthropic-ai/sdk";

/**
 * GLM provider — the Anthropic SDK pointed at z.ai's Anthropic-compatible
 * endpoint (same one Claude Code uses; the paas/v4 endpoint has separate
 * billing). Ported from Studio's production glm.ts (P5, D-P4-1 adjacency).
 *
 * Non-streaming by design: z.ai's SSE stream is not compatible with the
 * AI SDK's Anthropic provider (verified — stream ends without a finish
 * chunk), while non-streaming works reliably.
 */

const MODEL = process.env.GLM_MODEL || "glm-4.5-air";
const BASE_URL = process.env.GLM_BASE_URL?.includes("/anthropic")
  ? process.env.GLM_BASE_URL
  : "https://api.z.ai/api/anthropic";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.GLM_API_KEY;
    if (!apiKey) throw new Error("GLM_API_KEY is not set");
    _client = new Anthropic({ apiKey, baseURL: BASE_URL });
  }
  return _client;
}

export function isGlmConfigured(): boolean {
  return typeof process.env.GLM_API_KEY === "string" && process.env.GLM_API_KEY.length > 0;
}

export interface GlmToolDef {
  name: string;
  description: string;
  input_schema: { type: "object"; properties: Record<string, unknown>; required?: string[] };
}

export interface GlmMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GlmCompletionResult {
  text: string;
  toolCalls: { name: string; arguments: Record<string, unknown> }[];
  usage: { inputTokens: number; outputTokens: number };
}

/** Non-streaming Messages API call — parses text and tool_use blocks. */
export async function glmChat(
  system: string,
  messages: GlmMessage[],
  tools?: GlmToolDef[],
): Promise<GlmCompletionResult> {
  const params: Record<string, unknown> = {
    model: MODEL,
    max_tokens: 2048,
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  };
  if (tools && tools.length > 0) params.tools = tools;

  const response = await getClient().messages.create(params as never);

  let text = "";
  const toolCalls: { name: string; arguments: Record<string, unknown> }[] = [];

  for (const block of response.content) {
    if (block.type === "text") text += block.text;
    if (block.type === "tool_use") {
      toolCalls.push({ name: block.name, arguments: block.input as Record<string, unknown> });
    }
  }

  return {
    text,
    toolCalls,
    usage: {
      inputTokens: response.usage?.input_tokens ?? 0,
      outputTokens: response.usage?.output_tokens ?? 0,
    },
  };
}
