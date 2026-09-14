import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function since30(): Date {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
}

export default async function AdminDashboard() {
  const [projects, published, articles, messages, stats, byType, pageViews] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.article.count({ where: { published: true } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.stat.count(),
    prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      _count: { _all: true },
      where: { createdAt: { gte: since30() }, eventType: { in: ["PAGE_VIEW", "CV_DOWNLOAD", "PROJECT_VIEW"] } },
    }),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: since30() }, eventType: "PAGE_VIEW" } }),
  ]);

  const counts = new Map<string, number>();
  for (const row of byType) counts.set(row.eventType, row._count._all);

  const content = [
    { label: "Projects", value: `${published}/${projects} published`, href: "/admin/projects" },
    { label: "Published articles", value: String(articles), href: "/admin/manage/articles" },
    { label: "New contact messages", value: String(messages), href: "/admin/messages" },
    { label: "Signals stats", value: String(stats), href: "/admin/stats" },
  ];

  const traffic = [
    { label: "Visitors (30d)", value: String(pageViews) },
    { label: "Page views (30d)", value: String(counts.get("PAGE_VIEW") ?? 0) },
    { label: "CV downloads (30d)", value: String(counts.get("CV_DOWNLOAD") ?? 0) },
    { label: "Project views (30d)", value: String(counts.get("PROJECT_VIEW") ?? 0) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>

      <section aria-labelledby="traffic-h" className="mt-8">
        <div className="flex items-center justify-between">
          <h2 id="traffic-h" className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Traffic — last 30 days
          </h2>
          <Link href="/admin/analytics" className="text-sm text-neutral-400 hover:text-white">
            Full analytics →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {traffic.map((c) => (
            <div key={c.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm text-neutral-400">{c.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">{c.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="content-h" className="mt-12">
        <h2 id="content-h" className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Content
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-white/30"
            >
              <p className="text-sm text-neutral-400">{c.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">{c.value}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-10 text-sm text-neutral-500">
        Detailed referrers and activity: <Link href="/admin/analytics" className="underline hover:text-white">Analytics</Link>.
        Signals numbers are edited under <Link href="/admin/stats" className="underline hover:text-white">Signals</Link>.
      </p>
    </div>
  );
}
