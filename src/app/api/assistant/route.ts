import { createHash } from "node:crypto";
import { z } from "zod";
import { glmChat, isGlmConfigured } from "@/lib/ai/glm";
import { glmToolDefs, executeTool } from "@/lib/ai/tools";
import { systemPromptFor, ASSISTANT_LOW_GROUNDING } from "@/lib/ai/prompts";
import { prisma } from "@/lib/db";
import { limiters } from "@/lib/rate-limit";

export const maxDuration = 60;

const bodySchema = z.object({
  message: z.string().min(1).max(4000),
  mode: z.enum(["GENERAL", "RECRUITER", "ENGINEERING"]).default("GENERAL"),
  sessionId: z.string().min(8).max(64),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(10)
    .optional(),
});

const MAX_ROUNDS = 3;

export async function POST(req: Request) {
  if (!isGlmConfigured()) {
    return Response.json({ error: "Assistant not configured" }, { status: 503 });
  }

  const profile = await prisma.profile.findUnique({ where: { id: "profile" }, select: { assistantEnabled: true } });
  if (profile && !profile.assistantEnabled) {
    return Response.json({ error: "Assistant is currently disabled" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const { mode, sessionId } = parsed.data;

  // Rate limits — IP-level (anti-rotation) + session-level (anti-runaway)
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  if (!(await limiters.chatIp.limit(ip)).success) {
    return Response.json({ error: "Rate limited — try again in a few minutes." }, { status: 429 });
  }
  if (!(await limiters.chatSession.limit(`${ip}:${sessionId}`)).success) {
    return Response.json({ error: "Rate limited — try again in a few minutes." }, { status: 429 });
  }

  const visitorHash = createHash("sha256")
    .update(`${process.env.VISITOR_HASH_SALT ?? ""}:${sessionId}`)
    .digest("hex")
    .slice(0, 32);

  // Conversation + visitor hash (D-P1-4: unique per session+mode)
  const conversation = await prisma.conversation.upsert({
    where: { sessionId_mode: { sessionId, mode } },
    update: {},
    create: { sessionId, mode: mode as never, visitorHash },
  });

  await prisma.message.create({
    data: { conversationId: conversation.id, role: "USER", content: parsed.data.message.slice(0, 4000) },
  });

  // ---- Orchestration loop: up to MAX_ROUNDS GLM calls with tool results ----
  const chat: { role: "user" | "assistant"; content: string }[] = [
    ...parsed.data.history ?? [],
    { role: "user", content: parsed.data.message },
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

  const sources = [...collectedSources];

  await prisma.message
    .create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: answer.slice(0, 8000),
        model: process.env.GLM_MODEL ?? "glm-4.5-air",
        inputTokens: usage.inputTokens || null,
        outputTokens: usage.outputTokens || null,
      },
    })
    .catch(() => {});

  return Response.json({
    answer: answer.slice(0, 8000),
    sources,
    usage,
  });
}
