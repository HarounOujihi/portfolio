# Phase 13 — Optional Extensions (trigger-gated)

**Goal:** nothing here gets built to make the architecture diagram look more impressive (§13).
Each item has a **real trigger**; a hypothetical one is not a trigger. Success is compatible with
this phase never happening.

**Prerequisites:** Phase 12 complete.

---

## Guardrail table

| Item | Build ONLY when trigger fires (measured, not guessed) | Action if triggered |
|---|---|---|
| Model routing (cheap vs premium by complexity) | avg cost/session > $0.02 sustained over 2 weeks | classify → route simple Qs to cheap tier; evals must stay green |
| Fallback provider (OpenAI/Gemini on Anthropic outage) | provider 5xx/error rate > 1% of requests in a week | provider abstraction (already in place, §6) + health-check failover |
| LangChain JS (tool orchestration) | > ~8 tools with chained interdependencies hand-written tools can't express | migrate orchestration layer only; tools stay |
| VPS-hosted AI service (heavier workloads) | p95 assistant latency > 8s attributable to serverless constraints | move embedding/rerank or eval runner off Vercel |
| Interactive case-study extras | — | only if a specific project genuinely needs it (P3.T4 decision revisited) |

---

## Tasks

- [ ] **P13.T1 — Record trigger status.**
  Review this table after 2–4 weeks of real traffic (Phase 11 data).
  **Done:** each row marked `not triggered` or `triggered — action started`, with the measured numbers + date:

  | Item | Status | Numbers | Date |
  |---|---|---|---|
  | Model routing | | | |
  | Fallback provider | | | |
  | LangChain JS | | | |
  | VPS AI service | | | |

**Rule:** no task in this phase may start from the "it would be cool" reason. The measured trigger is the only entry ticket.
