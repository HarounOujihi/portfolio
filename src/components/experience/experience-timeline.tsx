"use client";

import { motion } from "motion/react";

export interface TimelineExperience {
  id: string;
  companySlug: string;
  jobTitle: string;
  companyName: string;
  location: string | null;
  period: string;
  summary: string;
  achievements: { id: string; title: string; description: string }[];
}

/**
 * Experience timeline — the spine draws itself down the page while rows and
 * achievement cards stagger in. Reduced-motion users get static content.
 */
export function ExperienceTimeline({ experiences }: { experiences: TimelineExperience[] }) {
  return (
    <ol className="relative mt-12 space-y-12 pl-6 sm:pl-8">
      {/* drawing spine */}
      <motion.span
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-0.5 origin-top bg-gradient-to-b from-[var(--brand)] via-white/25 to-white/10"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      {experiences.map((exp, i) => (
        <motion.li
          key={exp.id}
          className="relative"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: Math.min(i * 0.08, 0.3), ease: "easeOut" }}
        >
          <motion.span
            aria-hidden="true"
            className="absolute top-1 -left-[35px] h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--brand)] sm:-left-[43px]"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 + Math.min(i * 0.08, 0.3) }}
          />
          <p className="text-sm font-medium text-neutral-400">{exp.period}</p>
          <h2 className="mt-1 text-xl font-semibold">{exp.jobTitle}</h2>
          <p className="text-base font-medium text-neutral-200">{exp.companyName}</p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">{exp.summary}</p>
          {exp.achievements.length > 0 && (
            <ul className="mt-4 space-y-3">
              {exp.achievements.map((a, j) => (
                <motion.li
                  key={a.id}
                  className="rounded-(--radius-card) bg-white/[0.04] p-4"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: 0.1 + j * 0.06, ease: "easeOut" }}
                >
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="mt-1 text-sm text-neutral-400">{a.description}</p>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.li>
      ))}
    </ol>
  );
}
