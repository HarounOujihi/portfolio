import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPeriod } from "@/lib/format";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "10+ years across SaaS, ERP, fintech, education, and government platforms — lead developer roles owning the full product lifecycle.",
};

export default async function ExperiencePage() {
  const experiences = await prisma.experience.findMany({
    where: { published: true },
    orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
    include: { achievements: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-h2 font-bold tracking-tight">Experience</h1>
      <p className="mt-2 text-lead text-neutral-400">
        Full product lifecycle ownership — architecture, backend, frontend, and delivery.
      </p>

      <ol className="relative mt-12 space-y-12 border-l-2 border-white/15 pl-6 sm:pl-8">
        {experiences.map((exp) => (
          <li key={exp.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[35px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--brand)] sm:-left-[43px]"
            />
            <p className="text-sm font-medium text-neutral-400">
              {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
              {exp.location ? ` · ${exp.location}` : ""}
            </p>
            <h2 className="mt-1 text-xl font-semibold">{exp.jobTitle}</h2>
            <p className="text-base font-medium text-neutral-200">{exp.companyName}</p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{exp.summary}</p>
            {exp.achievements.length > 0 && (
              <ul className="mt-4 space-y-3">
                {exp.achievements.map((a) => (
                  <li key={a.id} className="rounded-(--radius-card) bg-white/[0.04] p-4">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="mt-1 text-sm text-neutral-400">{a.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </main>
  );
}
