import { formatPeriod } from "@/lib/format";

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
 * Experience timeline — server-rendered, visible without JS.
 * The spine draws via a scroll-driven CSS animation (modern browsers);
 * rows and achievement cards reveal via the global [data-reveal] observer.
 */
export function ExperienceTimeline({ experiences }: { experiences: TimelineExperience[] }) {
  return (
    <ol className="relative mt-12 space-y-12 pl-6 sm:pl-8">
      <span
        aria-hidden="true"
        className="timeline-spine absolute top-0 left-0 h-full w-0.5 origin-top bg-gradient-to-b from-[var(--brand)] via-white/25 to-white/10"
      />
      {experiences.map((exp, i) => (
        <li key={exp.id} className="relative">
          <span
            aria-hidden="true"
            data-reveal
            style={{ transitionDelay: `${Math.min(i * 80, 320)}ms` }}
            className="absolute top-1 -left-[35px] h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--brand)] sm:-left-[43px]"
          />
          <div data-reveal style={{ transitionDelay: `${Math.min(i * 80, 320)}ms` }}>
            <p className="text-sm font-medium text-neutral-400">{exp.period}</p>
            <h2 className="mt-1 text-xl font-semibold">{exp.jobTitle}</h2>
            <p className="text-base font-medium text-neutral-200">{exp.companyName}</p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{exp.summary}</p>
          </div>
          {exp.achievements.length > 0 && (
            <ul className="mt-4 space-y-3">
              {exp.achievements.map((a, j) => (
                <li
                  key={a.id}
                  data-reveal
                  style={{ transitionDelay: `${Math.min(i * 80 + 100 + j * 60, 560)}ms` }}
                  className="rounded-(--radius-card) bg-white/[0.04] p-4"
                >
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="mt-1 text-sm text-neutral-400">{a.description}</p>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
