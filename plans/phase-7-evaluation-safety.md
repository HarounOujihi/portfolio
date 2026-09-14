# Phase 7 — Evaluation + Safety

**Goal:** the P0 fixture set runs for real against the live pipeline; prompt/retrieval changes
are gated by a repeatable suite; admin drill-down view.
**Exit criteria (§13):** a prompt or retrieval change can be checked against a repeatable suite before it ships.

**Prerequisites:** Phases 5–6. **Consumes:** `evals/fixtures.ts` (P0.T5), D-P1-3 schema split.

---

## Tasks

- [ ] **P7.T1 — Run/Result schema migration.**
  Apply D-P1-3: `AIEvaluationCase` + `AIEvaluationRunResult` (with `runId`), migrate the schema.
  **Done:** migration clean; `AIEvaluation` (mixed table) no longer exists.

- [ ] **P7.T2 — Fixture loader.**
  Seed `AIEvaluationCase` rows from `evals/fixtures.ts`, idempotent by unique `name`.
  **Done:** seeded case count matches the file; re-seed updates definitions without duplicates.

- [ ] **P7.T3 — Runner.**
  `scripts/run-evals.ts`: per case → build the prompt exactly as production does (same tools/retrieval path) →
  generate → **model-graded** pass/fail against `expectedBehavior` (grader model decision **D-P7-1**,
  default: cheaper Claude tier for grading; rubric text per category) → persist result
  (score, passed, latencyMs, tokens, model) under a fresh `runId`.
  **Done:** full run completes; summary printed (per-category pass rate, cost of the run); results in DB under one runId.

- [ ] **P7.T4 — Injection category green.**
  All PROMPT_INJECTION fixtures pass: chunk-injection ignored (and optionally flagged), JD-injection does not move scores.
  **Done:** 100% of the category passes; any failure = prompt fix → full re-run (never a one-off tweak).

- [ ] **P7.T5 — Hallucination + attribution green.**
  HALLUCINATION ≥ 90% pass ("no evidence of that" behavior); SOURCE_ATTRIBUTION cites expected slugs.
  **Done:** thresholds met; failures triaged into prompt fixes vs fixture fixes (fixture edits noted in file).

- [ ] **P7.T6 — Gate rule.**
  `pnpm evals` script; rule written into repo docs (README/AGENTS note): **no prompt or retrieval change ships without a green run**.
  **Done:** script in package.json; rule documented where you'll actually see it.

- [ ] **P7.T7 — Admin evaluations view.**
  `/admin/evaluations`: latest run summary (pass rate by category), run history list (D-P1-3 enables this),
  drill into a failure: input, expectedBehavior, actualResponse, grade reason.
  **Done:** view reflects the latest run; history shows ≥ 2 runs; mobile matrix pass.

- [ ] **P7.T8 — Baseline gate.**
  **Done:** recorded numbers: overall ≥ 90%, HALLUCINATION and INJECTION at 100%, before Phase 8 starts.
  Overall = ____%, latency p50/p95 = ____/____ms, run cost = $____
