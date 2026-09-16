/** Branded navigation skeleton — shown instantly on any (site) route transition. */
export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16" aria-busy="true" aria-label="Loading page">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-white/10" />
      <div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded bg-white/[0.07]" />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-(--radius-card) border border-white/10 p-6">
            <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-white/[0.06]" />
            </div>
            <div className="mt-4 flex gap-2">
              {[0, 1, 2].map((c) => (
                <div key={c} className="h-6 w-16 animate-pulse rounded-full bg-white/[0.06]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
