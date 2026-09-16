import { createHash } from "node:crypto";
import { z } from "zod";
import { isGlmConfigured } from "@/lib/ai/glm";
import { runAssistant, type AssistantMode } from "@/lib/ai/assistant-core";
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

  const startedAt = Date.now(); // wall-clock for the assistant reply (p50 on /engineering)

  // Conversation + visitor hash (D-P1-4: unique per session+mode)
  const conversation = await prisma.conversation.upsert({
    where: { sessionId_mode: { sessionId, mode } },
    update: {},
    create: { sessionId, mode: mode as never, visitorHash },
  });

  await prisma.message.create({
    data: { conversationId: conversation.id, role: "USER", content: parsed.data.message.slice(0, 4000) },
  });

  // Orchestration lives in assistant-core — the exact code path the eval suite exercises.
  const { answer, sources, usage } = await runAssistant({
    mode: mode as AssistantMode,
    message: parsed.data.message,
    history: parsed.data.history,
  });

  await prisma.message
    .create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: answer.slice(0, 8000),
        model: process.env.GLM_MODEL ?? "glm-4.5-air",
        latencyMs: Date.now() - startedAt,
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
