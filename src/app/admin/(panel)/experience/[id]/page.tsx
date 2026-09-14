import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { saveExperience } from "../actions";
import { AchievementsRepeater } from "@/components/admin/achievements-repeater";

export const metadata: Metadata = { title: "Edit experience", robots: { index: false } };

const input = "h-11 w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 text-sm outline-none focus:border-[var(--brand)]";
const area = "w-full rounded-xl border border-white/20 bg-white/[0.04] p-3 text-sm outline-none focus:border-[var(--brand)]";
const label = "mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exp = await prisma.experience.findUnique({
    where: { id },
    include: { achievements: { orderBy: { sortOrder: "asc" } } },
  });
  if (!exp) notFound();

  const iso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
        <Link href="/admin/experience" className="hover:text-white">← Experience</Link>
      </nav>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">Edit — {exp.companyName}</h1>

      <form action={saveExperience} className="mt-8 space-y-5">
        <input type="hidden" name="id" value={exp.id} />
        <input type="hidden" name="companySlug" value={exp.companySlug} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="companyName">Company *</label>
            <input id="companyName" name="companyName" required maxLength={100} defaultValue={exp.companyName} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="jobTitle">Job title *</label>
            <input id="jobTitle" name="jobTitle" required maxLength={120} defaultValue={exp.jobTitle} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="employmentType">Employment type</label>
            <select id="employmentType" name="employmentType" defaultValue={exp.employmentType} className={input}>
              <option>FULL_TIME</option>
              <option>PART_TIME</option>
              <option>CONTRACT</option>
              <option>FREELANCE</option>
            </select>
          </div>
          <div>
            <label className={label} htmlFor="location">Location</label>
            <input id="location" name="location" maxLength={120} defaultValue={exp.location ?? ""} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="startDate">Start *</label>
            <input id="startDate" name="startDate" type="date" required defaultValue={iso(exp.startDate)} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="endDate">End (empty = current)</label>
            <input id="endDate" name="endDate" type="date" defaultValue={iso(exp.endDate)} disabled={exp.isCurrent} className={`${input} disabled:opacity-40`} />
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input type="checkbox" name="isCurrent" defaultChecked={exp.isCurrent} className="h-4 w-4" /> Currently working here
          </label>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={exp.published} className="h-4 w-4" /> Published
          </label>
        </div>

        <div>
          <label className={label} htmlFor="summary">Summary *</label>
          <textarea id="summary" name="summary" required rows={2} maxLength={400} defaultValue={exp.summary} className={area} />
        </div>
        <div>
          <label className={label} htmlFor="description">Description *</label>
          <textarea id="description" name="description" required rows={4} defaultValue={exp.description} className={area} />
        </div>

        <AchievementsRepeater
          initial={exp.achievements.map((a) => ({ title: a.title, description: a.description, metric: a.metric ?? "" }))}
        />

        <div className="flex items-center gap-4">
          <button type="submit" className="h-12 rounded-full bg-white px-8 font-semibold text-neutral-950">Save experience</button>
          <Link href="/admin/experience" className="text-sm text-neutral-400 hover:text-white">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
