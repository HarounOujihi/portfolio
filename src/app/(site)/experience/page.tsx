import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPeriod } from "@/lib/format";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";

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

      <ExperienceTimeline
        experiences={experiences.map((exp) => ({
          id: exp.id,
          companySlug: exp.companySlug,
          jobTitle: exp.jobTitle,
          companyName: exp.companyName,
          location: exp.location,
          period: formatPeriod(exp.startDate, exp.endDate, exp.isCurrent),
          summary: exp.summary,
          achievements: exp.achievements.map((a) => ({ id: a.id, title: a.title, description: a.description })),
        }))}
      />
    </main>
  );
}
export const revalidate = 60;
