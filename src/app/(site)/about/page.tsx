import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "About",
  description:
    "Lead full-stack engineer — 10+ years building SaaS and ERP platforms with applied AI/LLM integration in production.",
};

const SKILL_CATEGORY_LABEL: Record<string, string> = {
  LANGUAGE: "Languages",
  FRAMEWORK: "Frameworks",
  DATABASE: "Databases",
  INFRASTRUCTURE: "Infrastructure & Cloud",
  AI_ML: "AI & Automation",
  ARCHITECTURE: "Architecture",
  LEADERSHIP: "Leadership",
  OTHER: "Other",
};

const LEVEL_LABEL: Record<string, string> = {
  FAMILIAR: "Familiar",
  PROFICIENT: "Proficient",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

export default async function AboutPage() {
  const [profile, skills, education, certifications] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "profile" } }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] }),
    prisma.education.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.certification.findMany({ orderBy: { issueDate: "desc" } }),
  ]);

  if (!profile) notFound();

  const grouped = new Map<string, typeof skills>();
  for (const skill of skills) {
    const list = grouped.get(skill.category) ?? [];
    list.push(skill);
    grouped.set(skill.category, list);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-h2 font-bold tracking-tight">About</h1>

      <section aria-label="Bio" className="mt-8">
        <p className="max-w-3xl whitespace-pre-line leading-relaxed text-neutral-200">{profile.longBio}</p>
      </section>

      <section aria-labelledby="skills" className="mt-14">
        <h2 id="skills" className="text-xl font-semibold">
          Skills
        </h2>
        <div className="mt-6 space-y-8">
          {[...grouped.entries()].map(([category, list]) => (
            <div key={category}>
              <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-400">
                {SKILL_CATEGORY_LABEL[category] ?? category}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {list.map((skill) => (
                  <li
                    key={skill.id}
                    title={skill.years ? `${skill.years} years` : undefined}
                    className="flex h-9 items-center gap-2 rounded-full border border-white/15 px-3.5 text-sm"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-xs text-neutral-400">{LEVEL_LABEL[skill.level]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="education" className="mt-14">
        <h2 id="education" className="text-xl font-semibold">
          Education
        </h2>
        <ul className="mt-4 space-y-3">
          {education.map((edu) => (
            <li key={edu.id} className="rounded-(--radius-card) bg-white/[0.04] p-4">
              <p className="font-medium">
                {edu.degree}
                {edu.field ? ` — ${edu.field}` : ""}
              </p>
              <p className="text-sm text-neutral-400">
                {edu.institution}
                {edu.startDate ? ` · ${edu.startDate.getUTCFullYear()}–${edu.endDate?.getUTCFullYear() ?? ""}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {certifications.length > 0 && (
        <section aria-labelledby="certifications" className="mt-14">
          <h2 id="certifications" className="text-xl font-semibold">
            Certifications
          </h2>
          <ul className="mt-4 space-y-3">
            {certifications.map((cert) => (
              <li key={cert.id} className="rounded-(--radius-card) bg-white/[0.04] p-4">
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-neutral-400">
                  {cert.issuer} · {cert.issueDate.getUTCFullYear()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
