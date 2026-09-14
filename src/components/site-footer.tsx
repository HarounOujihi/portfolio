import { prisma } from "@/lib/db";
import { TrackedLink } from "@/components/tracked-link";

/** Server footer — reads the live CV URL from the database. */
export async function SiteFooter({ cvUrl }: { cvUrl: string }) {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Haroun Oujihi</p>
        <div className="flex gap-5">
          <TrackedLink
            href="https://github.com/HarounOujihi"
            eventType="GITHUB_CLICK"
            entityId="footer"
            external
            className="hover:text-neutral-100"
          >
            GitHub
          </TrackedLink>
          <TrackedLink
            href="https://linkedin.com/in/haroun-oujihi"
            eventType="LINKEDIN_CLICK"
            entityId="footer"
            external
            className="hover:text-neutral-100"
          >
            LinkedIn
          </TrackedLink>
          <TrackedLink
            href={cvUrl}
            eventType="CV_DOWNLOAD"
            entityId="cv-footer"
            download
            className="hover:text-neutral-100"
          >
            CV
          </TrackedLink>
        </div>
      </div>
    </footer>
  );
}
