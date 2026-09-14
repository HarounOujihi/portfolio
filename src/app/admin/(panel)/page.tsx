import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [projects, published, articles, messages, stats] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.article.count({ where: { published: true } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.stat.count(),
  ]);

  const cards = [
    { label: "Projects", value: `${published}/${projects} published`, href: "/admin/projects" },
    { label: "Published articles", value: String(articles), href: "/admin" },
    { label: "New contact messages", value: String(messages), href: "/admin" },
    { label: "Signals stats", value: String(stats), href: "/admin/stats" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
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
      <p className="mt-10 text-sm text-neutral-400">
        Home → Signals numbers are edited under Signals. Project order on the home bento follows the
        Projects list ordering controls.
      </p>
    </div>
  );
}
export const dynamic = "force-dynamic";
