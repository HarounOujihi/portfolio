import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPeriod } from "@/lib/format";
import { MediaGallery } from "@/components/media-gallery";
import { DiagramCard } from "@/components/diagram-card";
import { DIAGRAMS } from "@/components/diagrams";
import { InvoicePipelineStepper, AssistantStepper } from "@/components/pipeline-stepper";
import { Reveal } from "@/components/reveal";

interface Params {
  params: Promise<{ slug: string }>;
}

/** Project ↔ the experience that produced it (facts, not guesses). */
const RELATED_EXPERIENCE: Record<string, string> = {
  "soldx-studio": "mahd",
};

async function getProject(slug: string, allowPreview: boolean) {
  return prisma.project.findFirst({
    where: { slug, ...(allowPreview ? {} : { published: true }) },
    include: {
      technologies: { include: { technology: true } },
      challenges: { orderBy: { sortOrder: "asc" } },
      solutions: { orderBy: { sortOrder: "asc" } },
      outcomes: { orderBy: { sortOrder: "asc" } },
      externalLinks: { orderBy: { sortOrder: "asc" } },
      media: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug, false);
  if (!project) return { title: "Project not found" };
  return { title: project.name, description: project.shortDescription };
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: Params & { searchParams: Promise<{ preview?: string }> }) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  const allowPreview = Boolean((await searchParams).preview) && Boolean(session);
  const project = await getProject(slug, allowPreview);
  if (!project) notFound();

  const siblings = await prisma.project.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true },
  });
  const idx = siblings.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const primary = project.technologies.filter((pt) => pt.importance === "PRIMARY");
  const secondary = project.technologies.filter((pt) => pt.importance === "SECONDARY");
  const diagram = DIAGRAMS[project.slug];
  const relatedExpSlug = RELATED_EXPERIENCE[project.slug];
  const relatedExperience = relatedExpSlug
    ? await prisma.experience.findUnique({ where: { companySlug: relatedExpSlug } })
    : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-400">
        <Link href="/projects" className="hover:text-neutral-100 hover:underline">
          ← All projects
        </Link>
      </nav>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-neutral-200">
            {project.industry}
          </span>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-neutral-400">
            {project.status}
          </span>
          <span className="text-xs text-neutral-400">
            {formatPeriod(project.startDate, project.endDate, project.isCurrent)}
          </span>
        </div>
        <h1 className="mt-3 text-h2 font-bold tracking-tight">{project.name}</h1>
        <p className="mt-3 text-lead text-neutral-400">{project.shortDescription}</p>
        <p className="mt-4 text-sm text-neutral-400">
          <span className="font-medium text-neutral-200">Role:</span> {project.role}
        </p>
        {project.externalLinks.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {project.externalLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-neutral-200 transition-colors hover:border-white/40"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </header>

      <section aria-label="Overview" className="mt-10">
        <p className="max-w-3xl leading-relaxed text-neutral-200">{project.longDescription}</p>
      </section>

      {project.media.length > 0 && (
        <section aria-labelledby="screenshots" className="mt-12">
          <h2 id="screenshots" className="text-xl font-semibold">
            Screenshots
          </h2>
          <div className="mt-4">
            <MediaGallery items={project.media} />
          </div>
        </section>
      )}

      {diagram && (
        <section aria-labelledby="architecture" className="mt-12">
          <h2 id="architecture" className="text-xl font-semibold">
            Architecture
          </h2>
          <p className="mt-1 text-sm text-neutral-400">Simplified view — tap to expand.</p>
          <div className="mt-4">
            <DiagramCard title={diagram.title}>{diagram.render()}</DiagramCard>
          </div>
        </section>
      )}

      {project.slug === "soldx-studio" && (
        <section aria-labelledby="pipeline" className="mt-12">
          <h2 id="pipeline" className="text-xl font-semibold">
            Inside the invoice pipeline
          </h2>
          <p className="mt-1 text-sm text-neutral-400">Step through how documents become matched records.</p>
          <div className="mt-4">
            <InvoicePipelineStepper />
            <div className="mt-6"><AssistantStepper /></div>
          </div>
        </section>
      )}

      {(primary.length > 0 || secondary.length > 0) && (
        <section aria-labelledby="stack" className="mt-12">
          <h2 id="stack" className="text-xl font-semibold">
            Stack
          </h2>
          <div className="mt-4 space-y-3">
            {primary.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-20 text-xs font-medium uppercase tracking-wide text-neutral-400">Primary</span>
                {primary.map((pt) => (
                  <span key={pt.technology.id} className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium">
                    {pt.technology.name}
                  </span>
                ))}
              </div>
            )}
            {secondary.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-20 text-xs font-medium uppercase tracking-wide text-neutral-400">Secondary</span>
                {secondary.map((pt) => (
                  <span
                    key={pt.technology.id}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-400"
                  >
                    {pt.technology.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {project.challenges.length > 0 && (
        <section aria-labelledby="challenges" className="mt-12">
          <h2 id="challenges" className="text-xl font-semibold">
            Challenges
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.challenges.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.05}>
                <div className="h-full rounded-(--radius-organic) border border-white/15 p-5">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-neutral-400">{c.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {project.solutions.length > 0 && (
        <section aria-labelledby="solutions" className="mt-12">
          <h2 id="solutions" className="text-xl font-semibold">
            Solutions
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.solutions.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.05}>
                <div className="h-full rounded-(--radius-organic-alt) border border-white/15 p-5">
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-neutral-400">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {project.outcomes.length > 0 && (
        <section aria-labelledby="outcomes" className="mt-12">
          <h2 id="outcomes" className="text-xl font-semibold">
            Outcomes
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.outcomes.map((o) => (
              <div key={o.id} className="rounded-(--radius-card) bg-white/[0.04] p-5">
                <h3 className="font-semibold">{o.title}</h3>
                <p className="mt-2 text-sm text-neutral-400">{o.description}</p>
                {o.metric && <p className="mt-3 text-2xl font-bold text-[var(--brand)]">{o.metric}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {relatedExperience && (
        <section aria-labelledby="related" className="mt-12">
          <h2 id="related" className="text-xl font-semibold">
            Related experience
          </h2>
          <Link
            href="/experience"
            className="mt-4 block rounded-(--radius-card) border border-white/15 p-5 transition-colors hover:border-white/40"
          >
            <p className="font-semibold">
              {relatedExperience.jobTitle} — {relatedExperience.companyName}
            </p>
            <p className="mt-1 text-sm text-neutral-400">{relatedExperience.summary}</p>
            <p className="mt-2 text-xs text-neutral-400">
              {formatPeriod(relatedExperience.startDate, relatedExperience.endDate, relatedExperience.isCurrent)}
            </p>
          </Link>
        </section>
      )}

      <nav aria-label="Project navigation" className="mt-16 flex justify-between gap-4 border-t border-white/15 pt-6">
        {prev ? (
          <Link href={`/projects/${prev.slug}`} className="text-sm text-neutral-400 hover:text-neutral-100">
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/projects/${next.slug}`} className="text-sm text-neutral-400 hover:text-neutral-100">
            {next.name} →
          </Link>
        )}
      </nav>
    </main>
  );
}
export const dynamic = "force-dynamic";
