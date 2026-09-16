import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected SaaS, ERP, fintech, edtech, and government platforms — multi-tenant architecture with production AI features.",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    include: { technologies: { include: { technology: true } } },
  });

  const industries = [...new Set(projects.map((p) => p.industry))].sort();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-h2 font-bold tracking-tight">Projects</h1>

      <ProjectsExplorer
        projects={projects.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          shortDescription: p.shortDescription,
          industry: p.industry,
          status: p.status,
          technologies: p.technologies.map((pt) => pt.technology.name).slice(0, 4),
        }))}
        industries={industries}
      />
    </main>
  );
}
export const dynamic = "force-dynamic";
