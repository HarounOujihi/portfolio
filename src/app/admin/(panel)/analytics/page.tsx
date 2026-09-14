import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const EVENT_LABEL: Record<string, string> = {
  PAGE_VIEW: "Page view",
  CV_DOWNLOAD: "CV download",
  PROJECT_VIEW: "Project view",
  ARTICLE_VIEW: "Article view",
  AI_OPEN: "AI opened",
  AI_QUESTION: "AI question",
  JOB_MATCH_RUN: "Job-match run",
  CONTACT_CLICK: "Contact click",
  CONTACT_SUBMIT: "Contact submit",
  GITHUB_CLICK: "GitHub click",
  LINKEDIN_CLICK: "LinkedIn click",
};

function hostFrom(metadata: unknown): string {
  if (metadata && typeof metadata === "object" && "referrer" in metadata) {
    try {
      return new URL(String((metadata as { referrer: string }).referrer)).host || "direct";
    } catch {
      return "direct";
    }
  }
  return "direct";
}

function since30(): Date {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
}

export default async function AdminAnalyticsPage() {
  const since = since30();

  const [byType, sessions, recent, pageViews] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      _count: { _all: true },
      where: { createdAt: { gte: since } },
      orderBy: { _count: { eventType: "desc" } },
    }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: since }, eventType: "PAGE_VIEW" },
      select: { sessionId: true },
    }),
    prisma.analyticsEvent.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: since }, eventType: "PAGE_VIEW" },
      select: { metadata: true },
    }),
  ]);

  const counts = new Map<string, number>();
  for (const row of byType) counts.set(row.eventType, row._count._all);

  const uniqueSessions = new Set(sessions.map((s) => s.sessionId)).size;
  const cvDownloads = counts.get("CV_DOWNLOAD") ?? 0;
  const projectViews = counts.get("PROJECT_VIEW") ?? 0;

  const referrers = new Map<string, number>();
  for (const pv of pageViews) {
    const host = hostFrom(pv.metadata);
    referrers.set(host, (referrers.get(host) ?? 0) + 1);
  }
  const topReferrers = [...referrers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const cards = [
    { label: "Unique visitors (30d)", value: String(uniqueSessions) },
    { label: "Page views (30d)", value: String(counts.get("PAGE_VIEW") ?? 0) },
    { label: "CV downloads (30d)", value: String(cvDownloads) },
    { label: "Project views (30d)", value: String(projectViews) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Anonymous, session-scoped — no cookies, no personal data. Last 30 days.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-neutral-400">{c.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{c.value}</p>
          </div>
        ))}
      </div>

      <section aria-labelledby="referrers-h" className="mt-12">
        <h2 id="referrers-h" className="text-xl font-semibold">
          Where visitors came from
        </h2>
        <ul className="mt-4 space-y-2">
          {topReferrers.map(([host, count]) => (
            <li key={host} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm">
              <span className="truncate">{host}</span>
              <span className="font-semibold text-[var(--brand)]">{count}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="recent-h" className="mt-12">
        <h2 id="recent-h" className="text-xl font-semibold">
          Recent activity
        </h2>
        <div className="mt-4 overflow-x-auto rounded-3xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Session</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((e) => (
                <tr key={e.id} className="border-b border-white/5">
                  <td className="px-4 py-3 text-neutral-400">{e.createdAt.toLocaleString("en")}</td>
                  <td className="px-4 py-3 font-medium">{EVENT_LABEL[e.eventType] ?? e.eventType}</td>
                  <td className="px-4 py-3 text-neutral-400">{e.entityId ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-400">{e.sessionId.slice(0, 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
