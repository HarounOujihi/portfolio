import type { Metadata } from "next";
import Link from "next/link";
import { saveExperience } from "../actions";
import { AchievementsRepeater } from "@/components/admin/achievements-repeater";

export const metadata: Metadata = { title: "New experience", robots: { index: false } };

const input = "h-11 w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 text-sm outline-none focus:border-[var(--brand)]";
const area = "w-full rounded-xl border border-white/20 bg-white/[0.04] p-3 text-sm outline-none focus:border-[var(--brand)]";
const label = "mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400";

export default function NewExperiencePage() {
  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-400">
        <Link href="/admin/experience" className="hover:text-white">← Experience</Link>
      </nav>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">New experience</h1>

      <form action={saveExperience} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="companyName">Company *</label>
            <input id="companyName" name="companyName" required maxLength={100} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="jobTitle">Job title *</label>
            <input id="jobTitle" name="jobTitle" required maxLength={120} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="employmentType">Employment type</label>
            <select id="employmentType" name="employmentType" className={input}>
              <option>FULL_TIME</option>
              <option>PART_TIME</option>
              <option>CONTRACT</option>
              <option>FREELANCE</option>
            </select>
          </div>
          <div>
            <label className={label} htmlFor="location">Location</label>
            <input id="location" name="location" maxLength={120} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="startDate">Start *</label>
            <input id="startDate" name="startDate" type="date" required className={input} />
          </div>
          <div>
            <label className={label} htmlFor="endDate">End (empty = current)</label>
            <input id="endDate" name="endDate" type="date" className={input} />
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input type="checkbox" name="isCurrent" defaultChecked className="h-4 w-4" /> Currently working here
          </label>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input type="checkbox" name="published" defaultChecked className="h-4 w-4" /> Published
          </label>
        </div>

        <div>
          <label className={label} htmlFor="summary">Summary *</label>
          <textarea id="summary" name="summary" required rows={2} maxLength={400} className={area} />
        </div>
        <div>
          <label className={label} htmlFor="description">Description *</label>
          <textarea id="description" name="description" required rows={4} className={area} />
        </div>

        <AchievementsRepeater initial={[{ title: "", description: "", metric: "" }]} />

        <div className="flex items-center gap-4">
          <button type="submit" className="h-12 rounded-full bg-white px-8 font-semibold text-neutral-950">
            Save experience
          </button>
          <Link href="/admin/experience" className="text-sm text-neutral-400 hover:text-white">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
export const dynamic = "force-dynamic";
