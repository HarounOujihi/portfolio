import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/reveal";
import { SkillGroup } from "@/components/about/about-motion";

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
  const [profile, skills, education, certifications, projects, industries] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "profile" } }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] }),
    prisma.education.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.certification.findMany({ orderBy: { issueDate: "desc" } }),
    prisma.project.count({ where: { published: true } }),
    prisma.project.findMany({ where: { published: true }, select: { industry: true }, distinct: ["industry"] }),
  ]);

  if (!profile) notFound();

  const grouped = new Map<string, typeof skills>();
  for (const skill of skills) {
    const list = grouped.get(skill.category) ?? [];
    list.push(skill);
    grouped.set(skill.category, list);
  }

  const years = profile.yearsExperience ?? 12;
  const stats = [
    { value: years, suffix: "+", label: "years shipping software" },
    { value: projects, suffix: "", label: "projects published here" },
    { value: industries.length, suffix: "", label: "industries served" },
    { value: skills.length, suffix: "", label: "documented skills" },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      {/* hero */}
      <section aria-label="Profile" className="flex flex-col gap-8 sm:flex-row sm:items-center">
        {profile.avatarUrl && (
          <div className="relative h-28 w-28 shrink-0">
            <span
              aria-hidden="true"
              className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[var(--brand)]/60 via-transparent to-[var(--brand)]/30"
            />
            <Image
              src={profile.avatarUrl}
              alt={profile.fullName}
              width={112}
              height={112}
              className="relative h-28 w-28 rounded-full border border-white/20 object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-h2 font-bold tracking-tight">{profile.fullName}</h1>
          <p className="mt-1 text-lg text-neutral-300">{profile.headline}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {profile.availability && (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
                {profile.availability}
              </span>
            )}
            {profile.location && (
              <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-neutral-300">
                {profile.location}
              </span>
            )}
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-neutral-300">
              {profile.email}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                className="inline-flex h-11 items-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-neutral-950 transition-opacity hover:opacity-90"
              >
                Download CV
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center rounded-full border border-white/20 px-6 text-sm text-neutral-200 transition-colors hover:border-white/50"
              >
                LinkedIn ↗
              </a>
            )}
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center rounded-full border border-white/20 px-6 text-sm text-neutral-200 transition-colors hover:border-white/50"
              >
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {/* career stats */}
      <section aria-label="Career in numbers" className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-(--radius-card) border border-white/15 p-4">
            <p className="text-3xl font-bold tracking-tight">
              <CountUp value={s.value} suffix={s.suffix} duration={1.3} />
            </p>
            <p className="mt-1 text-xs leading-snug text-neutral-400">{s.label}</p>
          </div>
        ))}
      </section>

      {/* bio */}
      <Reveal className="mt-12">
        <section aria-label="Bio">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--brand)]">The story so far</p>
          <div className="mt-4 max-w-3xl space-y-4">
            {profile.longBio
              .split(/\r?\n\r?\n/)
              .filter((para) => para.trim())
              .map((para, i) => (
                <p key={i} className="leading-relaxed text-neutral-200">
                  {para.trim()}
                </p>
              ))}
          </div>
        </section>
      </Reveal>

      {/* industries */}
      <Reveal className="mt-14">
        <section aria-labelledby="industries">
          <h2 id="industries" className="text-xl font-semibold">
            Industries served
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {industries.map((p) => (
              <span
                key={p.industry}
                className="flex h-9 items-center rounded-full border border-white/15 px-3.5 text-sm text-neutral-200"
              >
                {p.industry.charAt(0) + p.industry.slice(1).toLowerCase().replace("_", " ")}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      {/* skills */}
      <section aria-labelledby="skills" className="mt-14">
        <h2 id="skills" className="text-xl font-semibold">
          What I work with
        </h2>
        <div className="mt-6 space-y-8">
          {[...grouped.entries()].map(([category, list]) => (
            <SkillGroup
              key={category}
              label={SKILL_CATEGORY_LABEL[category] ?? category}
              items={list.map((skill) => ({
                name: skill.name,
                note: LEVEL_LABEL[skill.level] ?? skill.level,
              }))}
            />
          ))}
        </div>
      </section>

      {/* education */}
      <Reveal className="mt-14">
        <section aria-labelledby="education">
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
      </Reveal>

      {certifications.length > 0 && (
        <Reveal className="mt-14">
          <section aria-labelledby="certifications">
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
        </Reveal>
      )}
    </main>
  );
}
export const dynamic = "force-dynamic";
