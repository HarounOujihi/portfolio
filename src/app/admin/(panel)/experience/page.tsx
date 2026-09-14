import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPeriod } from "@/lib/format";
import { moveExperience, deleteExperience } from "./actions";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
    include: { achievements: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Experience</h1>
        <Link
          href="/admin/experience/new"
          className="flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-neutral-950"
        >
          + New
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {experiences.map((exp, i) => (
          <div key={exp.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex gap-1.5">
              <form action={moveExperience}>
                <input type="hidden" name="id" value={exp.id} />
                <button name="dir" value="up" disabled={i === 0} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm disabled:opacity-30" aria-label="Move up">↑</button>
              </form>
              <form action={moveExperience}>
                <input type="hidden" name="id" value={exp.id} />
                <button name="dir" value="down" disabled={i === experiences.length - 1} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm disabled:opacity-30" aria-label="Move down">↓</button>
              </form>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">
                {exp.jobTitle} — {exp.companyName}
                {exp.published ? "" : <span className="ml-2 rounded-full border border-white/20 px-2 py-0.5 text-xs text-neutral-400">draft</span>}
              </p>
              <p className="text-xs text-neutral-500">
                {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)} · {exp.achievements.length} achievements
              </p>
            </div>
            <Link
              href={`/admin/experience/${exp.id}`}
              className="flex h-9 items-center rounded-full border border-white/20 px-4 text-sm text-neutral-200 hover:border-white/50"
            >
              Edit
            </Link>
            <form action={deleteExperience} onSubmit={(e) => { if (!window.confirm(`Delete ${exp.companyName}?`)) e.preventDefault(); }}>
              <input type="hidden" name="id" value={exp.id} />
              <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-full border border-red-400/40 text-sm text-red-300 hover:border-red-400" aria-label={`Delete ${exp.companyName}`}>✕</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
