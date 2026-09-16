#!/usr/bin/env node
// Phase 7 eval driver — loops batches against an environment until the suite completes.
// Usage:
//   node scripts/run-evals.mjs <base-url>   e.g. http://localhost:3100 or https://harounoujihi.vercel.app
// Requires CRON_SECRET in .env (or CRON_SECRET env var).
import "dotenv/config";
import process from "node:process";

const base = process.argv[2] ?? "http://localhost:3100";
const secret = process.env.CRON_SECRET;
if (!secret) {
  console.error("CRON_SECRET missing");
  process.exit(1);
}

let runId = null;
let remaining = Infinity;
let totalRan = 0;
const failures = [];
const inconclusive = [];

while (remaining > 0) {
  const res = await fetch(`${base}/api/evals/run`, {
    method: "POST",
    headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
    body: JSON.stringify(runId ? { runId } : {}),
  });
  if (!res.ok) {
    console.error(`batch failed: HTTP ${res.status}`, (await res.text()).slice(0, 200));
    process.exit(1);
  }
  const data = await res.json();
  runId ??= data.runId;
  remaining = data.remaining;
  totalRan += data.ranNow;
  for (const r of data.results) {
    const mark = r.passed === null ? "∅" : r.passed ? "✓" : "✗";
    console.log(`${mark} ${r.name}${r.reason ? ` — ${r.reason}` : ""}`);
    if (r.passed === false) failures.push(r);
    if (r.passed === null) inconclusive.push(r);
  }
  if (data.ranNow === 0 && remaining > 0) {
    console.error("no progress but cases remain — aborting");
    process.exit(1);
  }
}

console.log(`\nrun ${runId}: ${totalRan} cases, ${failures.length} failed, ${inconclusive.length} inconclusive`);
process.exit(failures.length ? 1 : 0);
