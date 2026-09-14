# Phase 9 — Public AI Observability Strip

**Goal:** the §3 differentiator — a small honest panel next to the assistant: avg latency,
approx. cost/session, model in use, last eval pass rate. Visible to visitors, not buried in admin.
**Exit criteria (§13):** a technical visitor can see the system is measured, without asking.

**Prerequisites:** Phases 5 (tokens/latency persisted), 7 (eval runs), 8.

---

## Tasks

- [ ] **P9.T1 — Pricing config (never hardcode in components).**
  `lib/ai/pricing.ts`: per-model `{ inputPerMtok, outputPerMtok, embeddingPerMtok? }` + `costOf(model, in, out)`.
  Fill current prices for the Anthropic + Voyage models in use. Update discipline noted: **check prices on any model change.**
  **Done:** unit tests; missing-price case returns `null` (never a fake number — feeds P9.T4 fallback).

- [ ] **P9.T2 — Aggregation queries.**
  `lib/ai/stats.ts`: avg `latencyMs` over last 100 assistant `Message`s; approx cost/session
  (tokens → `$` via pricing config); current model (most recent message's model); last eval pass rate
  (latest `runId` from AIEvaluationRunResult). Cached/revalidated (e.g. 60s), not per-render.
  **Done:** unit tests on seeded rows; each query's numbers match a manual SQL check.

- [ ] **P9.T3 — Strip component.**
  Four compact metrics + "last eval: N% pass" + model chip. Placement: `/assistant` header and near the home FAB
  (collapsed to a single line on mobile, full strip ≥ sm). Empty states honest: "warming up — first conversations pending".
  **Done:** rendered numbers == DB truth; mobile single-line + desktop strip layouts pass matrix; 60s freshness verified.

- [ ] **P9.T4 — Honesty guards.**
  No PII in any displayed metric; if a price entry is missing → show model id without a `$` figure (never fabricate);
  link "how this is measured" → small explainer section (what is counted, refresh interval).
  **Done:** temporarily removing a price entry shows the fallback (screenshot); explainer page exists. **← Phase exit criterion (§13)**
