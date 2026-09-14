import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteRun } from "./actions";

export default async function AdminJobMatchPage() {
  const runs = await prisma.jobMatchAnalysis.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Job-match runs</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Every analysis run from the public /job-match page — which roles people test against the profile.
      </p>

      <div className="mt-8 space-y-3">
        {runs.length === 0 && <p className="text-sm text-neutral-400">No runs yet.</p>}
        {runs.map((r) => {
          const jobTitle = (r.extractedRequirements as { jobTitle?: string }).jobTitle ?? "—";
          return (
            <div key={r.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border-2 border-[var(--brand)]">
                <span className="text-lg font-bold">{r.overallScore}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {jobTitle} <span className="font-normal text-neutral-500">· {r.model}</span>
                </p>
                <p className="text-xs text-neutral-500">
                  {r.createdAt.toLocaleString("en")} · {r.viewCount} views ·{" "}
                  <Link href={`/job-match/${r.shareSlug}`} target="_blank" className="underline hover:text-white">
                    open report ↗
                  </Link>
                </p>
              </div>
              <form action={deleteRun}>
                <input type="hidden" name="id" value={r.id} />
                <button
                  type="submit"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-red-400/40 text-sm text-red-300 hover:border-red-400"
                  aria-label={`Delete run ${jobTitle}`}
                >
                  ✕
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
