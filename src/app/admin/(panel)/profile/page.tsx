import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { saveProfile, setAssistantEnabled } from "./actions";
import { CvUpload } from "@/components/admin/cv-upload";
import { AvatarUpload } from "@/components/admin/avatar-upload";
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
            <AvatarUpload currentUrl={profile.avatarUrl} />
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

      <section aria-labelledby="assistant-toggle-heading" className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="assistant-toggle-heading" className="flex items-center gap-2 font-semibold tracking-tight">
              AI assistant
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  profile.assistantEnabled
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-white/15 bg-white/[0.04] text-neutral-400"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${profile.assistantEnabled ? "bg-emerald-400" : "bg-neutral-500"}`} aria-hidden="true" />
                {profile.assistantEnabled ? "Live" : "Off"}
              </span>
            </h2>
            <p className="mt-1 max-w-lg text-sm text-neutral-400">
              Controls the &ldquo;Ask me&rdquo; button on the public site, the /assistant page, and its API.
              Everything else keeps working when it&rsquo;s off.
            </p>
          </div>
          <form action={setAssistantEnabled}>
            <input type="hidden" name="enabled" value={profile.assistantEnabled ? "false" : "true"} />
            <button
              type="submit"
              className={`h-11 rounded-full px-6 text-sm font-semibold transition-colors ${
                profile.assistantEnabled
                  ? "border border-white/20 bg-white/[0.06] text-neutral-100 hover:bg-white/[0.1]"
                  : "bg-[var(--brand)] text-neutral-950 hover:opacity-90"
              }`}
            >
              {profile.assistantEnabled ? "Disable assistant" : "Enable assistant"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
