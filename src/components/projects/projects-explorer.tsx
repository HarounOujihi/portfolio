"use client";

import { AnimatePresence, motion } from "motion/react";
import { ProjectCard } from "@/components/project-card";
import { useState } from "react";

export interface ExplorerProject {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  industry: string;
  status: string;
  technologies: string[];
}

/**
 * Project explorer — client-side industry filtering with layout animations:
 * cards glide to their new positions instead of re-rendering cold, and the
 * active pill slides between filters. Reduced-motion users get instant swaps
 * via the global MotionConfig.
 */
export function ProjectsExplorer({
  projects,
  industries,
  initialIndustry,
}: {
  projects: ExplorerProject[];
  industries: string[];
  initialIndustry?: string;
}) {
  const [industry, setIndustry] = useState<string | null>(initialIndustry ?? null);
  const visible = industry ? projects.filter((p) => p.industry === industry) : projects;

  return (
    <>
      <nav aria-label="Filter by industry" className="mt-6 flex flex-wrap gap-2">
        <FilterPill label="All" active={industry === null} onClick={() => setIndustry(null)} />
        {industries.map((ind) => (
          <FilterPill key={ind} label={ind} active={industry === ind} onClick={() => setIndustry(ind)} />
        ))}
      </nav>

      {visible.length === 0 ? (
        <p className="mt-12 text-lead text-neutral-400">No projects in this category yet.</p>
      ) : (
        <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3), ease: "easeOut" }}
                whileHover={{ y: -4 }}
              >
                <ProjectCard
                  project={{
                    slug: project.slug,
                    name: project.name,
                    shortDescription: project.shortDescription,
                    industry: project.industry,
                    status: project.status,
                    technologies: project.technologies,
                  }}
                  heading="h2"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex h-11 items-center rounded-full border px-4 text-sm transition-colors ${
        active ? "border-neutral-900 bg-white text-neutral-950" : "border-white/20 text-neutral-200 hover:border-white/40"
      }`}
    >
      {label}
    </button>
  );
}
