import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProjectForm, type ProjectFormData } from "@/components/admin/project-form";

const empty: ProjectFormData = {
  name: "",
  slug: "",
  shortDescription: "",
  longDescription: "",
  role: "Lead developer — full product lifecycle: idea phasing, product iteration, stack decisions, team leadership + hands-on development",
  market: "",
  industry: "SAAS",
  projectType: "WEB_APP",
  status: "LIVE",
  startDate: `${new Date().getFullYear()}-01-01`,
  endDate: "",
  isCurrent: true,
  featured: false,
  published: false,
  liveUrl: "",
  techIds: [],
  challenges: [{ title: "", description: "" }],
  solutions: [{ title: "", description: "" }],
  outcomes: [{ title: "", description: "" }],
};

export default async function NewProjectPage() {
  const techs = await prisma.technology.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-400">
        <Link href="/admin/projects" className="hover:text-white">← Projects</Link>
      </nav>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">New project</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Starts as a draft — flip “Published” when it&apos;s ready for the world.
      </p>
      <div className="mt-8">
        <ProjectForm initial={empty} techs={techs} />
      </div>
    </div>
  );
}
