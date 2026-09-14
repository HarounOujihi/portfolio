import Link from "next/link";

interface ProjectCardData {
  slug: string;
  name: string;
  shortDescription: string;
  industry: string;
  status: string;
  technologies: string[];
}

/** Organic-radius project card — design-system §1.2. Server Component. */
export function ProjectCard({
  project,
  heading: Tag = "h3",
}: {
  project: ProjectCardData;
  /** h3 on home (under an h2); h2 on /projects (directly under the page h1) */
  heading?: "h2" | "h3";
}) {
  return (
    <article className="flex h-full flex-col rounded-(--radius-organic) border border-white/15 bg-white/[0.04] p-6 transition-shadow hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <Tag className="text-lg font-semibold">
          <Link href={`/projects/${project.slug}`} className="hover:underline">
            {project.name}
          </Link>
        </Tag>
        <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-neutral-200">
          {project.industry}
        </span>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">{project.shortDescription}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-neutral-400"
          >
            {tech}
          </span>
        ))}
      </div>
      {project.status === "MAINTENANCE" && (
        <p className="mt-3 text-xs font-medium text-neutral-400">Active maintenance contract</p>
      )}
    </article>
  );
}
