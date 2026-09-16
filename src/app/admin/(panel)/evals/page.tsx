import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export const metadata = { title: "Eval results" };

export const dynamic = "force-dynamic";

export default async function AdminEvalsPage() {
  await requireAdmin();

  const latest = await prisma.aIEvaluationRunResult.findFirst({
    orderBy: { createdAt: "desc" },
    select: { runId: true, createdAt: true },
  });

  const results = latest
    ? await prisma.aIEvaluationRunResult.findMany({
        where: { runId: latest.runId },
        orderBy: { createdAt: "asc" },
        include: { case: { select: { name: true, category: true } } },
      })
    : [];

  const judged = results.filter((r) => r.passed !== null);
  const passed = judged.filter((r) => r.passed).length;
  const passRate = judged.length ? Math.round((passed / judged.length) * 100) : null;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Eval results</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-400">
        Phase 7 suite: {latest ? `latest run ${latest.createdAt.toLocaleString()}` : "not run yet"}. Run it from the
        terminal with{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
          node scripts/run-evals.mjs https://harounoujihi.vercel.app
        </code>
        . The public pass rate on /engineering updates automatically.
      </p>

      {latest && results.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-6">
            <div>
              <p className="text-3xl font-bold tracking-tight">{passRate === null ? "—" : `${passRate}%`}</p>
              <p className="text-xs text-neutral-400">pass rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">
                {passed}/{judged.length}
              </p>
              <p className="text-xs text-neutral-400">cases passed</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">{results.length - judged.length}</p>
              <p className="text-xs text-neutral-400">inconclusive</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Run {latest.runId.slice(0, 8)} · {latest.createdAt.toLocaleString()}
          </p>

          <ul className="mt-8 space-y-2">
            {results.map((r) => (
              <li key={r.id} className="flex items-start gap-3 rounded-xl border border-white/10 p-3 text-sm">
                <span
                  className={`mt-0.5 font-bold ${
                    r.passed === null ? "text-neutral-500" : r.passed ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {r.passed === null ? "∅" : r.passed ? "✓" : "✗"}
                </span>
                <div className="min-w-0">
                  <p className="font-medium">
                    {r.case.name} <span className="text-xs font-normal text-neutral-500">{r.case.category}</span>
                  </p>
                  {r.actualResponse && <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{r.actualResponse}</p>}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {results.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-neutral-400">
          No run yet — execute the command above to grade the suite.
        </div>
      )}
    </div>
  );
}
