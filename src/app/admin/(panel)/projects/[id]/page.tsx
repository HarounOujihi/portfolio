import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProjectForm, type ProjectFormData } from "@/components/admin/project-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      technologies: { select: { technologyId: true } },
      challenges: { orderBy: { sortOrder: "asc" } },
      solutions: { orderBy: { sortOrder: "asc" } },
      outcomes: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!project) notFound();

  const techs = await prisma.technology.findMany({ orderBy: { sortOrder: "asc" } });

  const iso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
  const initial: ProjectFormData = {
    id: project.id,
    name: project.name,
    slug: project.slug,
    shortDescription: project.shortDescription,
    longDescription: project.longDescription,
    role: project.role,
    market: project.market ?? "",
    industry: project.industry,
    projectType: project.projectType,
    status: project.status,
    startDate: iso(project.startDate),
    endDate: iso(project.endDate),
    isCurrent: project.isCurrent,
    featured: project.featured,
    published: project.published,
    liveUrl: project.liveUrl ?? "",
    techIds: project.technologies.map((pt) => pt.technologyId),
    challenges: project.challenges.map((c) => ({ title: c.title, description: c.description })),
    solutions: project.solutions.map((s) => ({ title: s.title, description: s.description })),
    outcomes: project.outcomes.map((o) => ({ title: o.title, description: o.description })),
  };

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-400">
        <Link href="/admin/projects" className="hover:text-white">← Projects</Link>
      </nav>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">Edit — {project.name}</h1>
      <div className="mt-8">
        <ProjectForm initial={initial} techs={techs} />
      </div>
    </div>
  );
}
