import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected SaaS, ERP, fintech, edtech, and government platforms — multi-tenant architecture with production AI features.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const { industry } = await searchParams;

  const projects = await prisma.project.findMany({
    where: { published: true, ...(industry ? { industry: industry as never } : {}) },
    orderBy: { sortOrder: "asc" },
    include: { technologies: { include: { technology: true } } },
  });

  const industries = [...new Set(projects.map((p) => p.industry))];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-h2 font-bold tracking-tight">Projects</h1>

      {/* Industry filter — server-side via searchParams; wrapping chip row on mobile */}
      <nav aria-label="Filter by industry" className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/projects"
          className={`flex h-11 items-center rounded-full border px-4 text-sm transition-colors ${
            !industry
              ? "border-neutral-900 bg-white text-neutral-950"
              : "border-white/20 text-neutral-200 hover:border-white/40"
          }`}
        >
          All
        </Link>
        {industries.map((ind) => (
          <Link
            key={ind}
            href={`/projects?industry=${ind}`}
            className={`flex h-11 items-center rounded-full border px-4 text-sm transition-colors ${
              industry === ind
                ? "border-neutral-900 bg-white text-neutral-950"
                : "border-white/20 text-neutral-200 hover:border-white/40"
            }`}
          >
            {ind}
          </Link>
        ))}
      </nav>

      {projects.length === 0 ? (
        <p className="mt-12 text-lead text-neutral-400">No projects in this category yet.</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              heading="h2"
              project={{
                slug: project.slug,
                name: project.name,
                shortDescription: project.shortDescription,
                industry: project.industry,
                status: project.status,
                technologies: project.technologies.map((pt) => pt.technology.name).slice(0, 4),
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
export const dynamic = "force-dynamic";
