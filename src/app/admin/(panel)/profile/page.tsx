import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { saveProfile } from "./actions";
import { CvUpload } from "@/components/admin/cv-upload";
import { requireAdmin } from "@/lib/require-admin";

const input = "h-11 w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 text-sm outline-none focus:border-[var(--brand)]";
const area = "w-full rounded-xl border border-white/20 bg-white/[0.04] p-3 text-sm outline-none focus:border-[var(--brand)]";
const label = "mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400";

export default async function AdminProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { saved } = await searchParams;
  const profile = await prisma.profile.findUnique({ where: { id: "profile" } });
  if (!profile) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-2 text-sm text-neutral-400">
        The single profile — shown across the public site and used by the AI assistant.
      </p>
      {saved && (
        <p role="status" className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm">
          Saved.
        </p>
      )}

      <form action={saveProfile} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="fullName">Full name *</label>
            <input id="fullName" name="fullName" required maxLength={100} defaultValue={profile.fullName} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="headline">Headline *</label>
            <input id="headline" name="headline" required maxLength={160} defaultValue={profile.headline} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" required maxLength={200} defaultValue={profile.email} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="phone">Phone</label>
            <input id="phone" name="phone" maxLength={40} defaultValue={profile.phone ?? ""} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="location">Location</label>
            <input id="location" name="location" maxLength={120} defaultValue={profile.location ?? ""} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="availability">Availability</label>
            <input id="availability" name="availability" maxLength={120} defaultValue={profile.availability ?? ""} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="yearsExperience">Years of experience</label>
            <input id="yearsExperience" name="yearsExperience" type="number" min="0" defaultValue={profile.yearsExperience ?? ""} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="githubUrl">GitHub URL</label>
            <input id="githubUrl" name="githubUrl" type="url" defaultValue={profile.githubUrl ?? ""} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="linkedinUrl">LinkedIn URL</label>
            <input id="linkedinUrl" name="linkedinUrl" type="url" defaultValue={profile.linkedinUrl ?? ""} className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="cvUrl">CV (download link across the site)</label>
            <CvUpload currentUrl={profile.cvUrl ?? "/haroun-oujihi-cv.pdf"} />
          </div>
          <div>
            <label className={label} htmlFor="avatarUrl">Avatar path</label>
            <input id="avatarUrl" name="avatarUrl" defaultValue={profile.avatarUrl ?? ""} className={input} />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="shortBio">Short bio *</label>
          <textarea id="shortBio" name="shortBio" required rows={4} defaultValue={profile.shortBio} className={area} />
        </div>
        <div>
          <label className={label} htmlFor="longBio">Long bio *</label>
          <textarea id="longBio" name="longBio" required rows={10} defaultValue={profile.longBio} className={area} />
        </div>

        <button type="submit" className="h-12 rounded-full bg-white px-8 font-semibold text-neutral-950">
          Save profile
        </button>
      </form>
    </div>
  );
}
