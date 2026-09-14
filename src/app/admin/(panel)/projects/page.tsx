import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProjectOrderButtons, ProjectToggle, ProjectDeleteButton } from "./row-actions";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true, industry: true, status: true, featured: true, published: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-neutral-950"
        >
          + New project
        </Link>
      </div>
      <p className="mt-2 text-sm text-neutral-400">
        Order controls the home bento — the first project takes the big card. Home only shows
        <span className="text-neutral-200"> Published</span>; the star marks it featured.
      </p>

      <div className="mt-8 space-y-3">
        {projects.map((p, i) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
          >
            <ProjectOrderButtons id={p.id} index={i} total={projects.length} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">
                {p.name}{" "}
                {!p.published && (
                  <span className="ml-1 rounded-full border border-white/20 px-2 py-0.5 text-xs text-neutral-400">
                    draft
                  </span>
                )}
              </p>
              <p className="text-xs text-neutral-400">
                {p.industry} · {p.status} · /{p.slug}
              </p>
            </div>
            <ProjectToggle id={p.id} field="featured" value={p.featured} label="★ Featured" />
            <ProjectToggle id={p.id} field="published" value={p.published} label="Published" />
            <Link
              href={`/admin/projects/${p.id}`}
              className="flex h-9 items-center rounded-full border border-white/20 px-4 text-sm text-neutral-200 hover:border-white/50"
            >
              Edit
            </Link>
            <ProjectDeleteButton id={p.id} name={p.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
