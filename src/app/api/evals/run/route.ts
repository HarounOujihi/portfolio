import { randomUUID } from "node:crypto";
import { latestRunSummary, runBatch } from "@/lib/ai/eval-runner";

export const maxDuration = 60;

/**
 * Phase 7 eval suite — batched so one call always fits the function limit.
 * POST: Bearer CRON_SECRET. Body: { runId?, batchSize? }. A fresh runId starts
 * a new run; repeated calls with the same runId continue it (cursor = stored results).
 * GET: public summary of the latest run (no responses exposed).
 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { runId?: string; batchSize?: number } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    // empty body → start a new run
  }

  const runId = body.runId ?? randomUUID();
  const batchSize = Math.min(Math.max(body.batchSize ?? 6, 1), 12);
  const batch = await runBatch(runId, batchSize);
  return Response.json(batch);
}

export async function GET() {
  const summary = await latestRunSummary();
  return Response.json({ summary });
}
