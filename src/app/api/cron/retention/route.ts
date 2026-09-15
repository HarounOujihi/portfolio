import { prisma } from "@/lib/db";

/**
 * Daily retention (Phase 11): keeps the free-tier DB bounded forever.
 * - AnalyticsEvent older than 180 days → deleted
 * - Message older than 180 days → deleted (Conversation shells remain as
 *   anonymized history; Studio pattern: roll up signal, drop content)
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventCutoff = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
  const messageCutoff = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);

  const [events, messages] = await Promise.all([
    prisma.analyticsEvent.deleteMany({ where: { createdAt: { lt: eventCutoff } } }),
    prisma.message.deleteMany({ where: { createdAt: { lt: messageCutoff } } }),
  ]);

  return Response.json({ ok: true, purgedEvents: events.count, purgedMessages: messages.count });
}
