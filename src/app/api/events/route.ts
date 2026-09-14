import { z } from "zod";
import { prisma } from "@/lib/db";
import { limiters } from "@/lib/rate-limit";

const schema = z.object({
  eventType: z.enum([
    "PAGE_VIEW",
    "CV_DOWNLOAD",
    "PROJECT_VIEW",
    "ARTICLE_VIEW",
    "AI_OPEN",
    "AI_QUESTION",
    "JOB_MATCH_RUN",
    "CONTACT_CLICK",
    "CONTACT_SUBMIT",
    "GITHUB_CLICK",
    "LINKEDIN_CLICK",
  ]),
  sessionId: z.string().uuid().max(64),
  entityType: z.string().max(40).optional(),
  entityId: z.string().max(120).optional(),
  referrer: z.string().max(300).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid event" }, { status: 400 });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  const limit = await limiters.events.limit(ip);
  if (!limit.success) return Response.json({ ok: true }); // silently drop floods

  await prisma.analyticsEvent.create({
    data: {
      sessionId: parsed.data.sessionId,
      eventType: parsed.data.eventType,
      entityType: parsed.data.entityType,
      entityId: parsed.data.entityId,
      metadata: parsed.data.referrer ? { referrer: parsed.data.referrer } : undefined,
    },
  });

  return Response.json({ ok: true });
}
