import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CopyReportButton } from "./copy-button";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const SECTIONS = [
  { key: "strong", title: "Strong matches", cls: "border-emerald-400/30" },
  { key: "partial", title: "Partial matches", cls: "border-white/10" },
  { key: "gaps", title: "Gaps — honestly stated", cls: "border-white/10" },
] as const;

export default async function JobMatchResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await prisma.jobMatchAnalysis.findUnique({ where: { shareSlug: slug } });
  if (!row) notFound();

  void prisma.jobMatchAnalysis
    .update({ where: { id: row.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  const strong = row.strongMatches as { area: string; evidence: string }[];
  const partial = row.partialMatches as { area: string; note: string }[];
  const gaps = row.gaps as { area: string; note: string }[];

  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--brand)]">Job match report</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl">{row.extractedRequirements ? String((row.extractedRequirements as { jobTitle?: string }).jobTitle ?? "Fit analysis") : "Fit analysis"}</h1>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-[var(--brand)]">
          <span className="text-4xl font-bold tracking-tighter">{row.overallScore}</span>
          <span className="text-xs text-neutral-400">/ 100</span>
        </div>
        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Honest fit — evidence over hope</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-300">{row.summary}</p>
        </div>
      </div>

      {[
        { title: "Strong matches", items: strong.map((s) => ({ head: s.area, body: s.evidence })), cls: "border-emerald-400/30" },
        { title: "Partial matches", items: partial.map((p) => ({ head: p.area, body: p.note })), cls: "border-white/10" },
        { title: "Gaps — honestly stated", items: gaps.map((g) => ({ head: g.area, body: g.note })), cls: "border-white/10" },
      ].map((sec) =>
        sec.items.length > 0 ? (
          <section key={sec.title} aria-label={sec.title} className="mt-12">
            <h2 className="text-xl font-semibold">{sec.title}</h2>
            <div className={`mt-4 space-y-4 rounded-3xl border ${sec.cls} p-6`}>
              {sec.items.map((item, i) => (
                <div key={i}>
                  <p className="font-medium">{item.head}</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-400">{item.body}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null,
      )}

      <section className="mt-12 rounded-3xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">See the evidence yourself</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/projects" className="flex h-11 items-center rounded-full border border-white/20 px-5 text-sm hover:border-white/50">
            All projects
          </Link>
          <Link href="/experience" className="flex h-11 items-center rounded-full border border-white/20 px-5 text-sm hover:border-white/50">
            Experience
          </Link>
          <Link href="/contact" className="flex h-11 items-center rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-neutral-950">
            Contact Haroun
          </Link>
        </div>
      </section>

      <div className="mt-12 flex items-center justify-between text-xs text-neutral-400">
        <p>
          Generated {row.createdAt.toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })} by a GLM
          model against Haroun&apos;s real portfolio data — no claims without evidence.
        </p>
        <CopyReportButton />
      </div>
    </main>
  );
}
