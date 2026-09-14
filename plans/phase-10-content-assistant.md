# Phase 10 — AI Content Assistant (admin-side)

**Goal:** generation drafts for admin content work — never auto-published (§10:
Generate → Review → Accept/Edit → Publish; the AI never writes directly to a published field).
**Exit criteria (§13):** content maintenance is meaningfully faster, with zero silent auto-publishing.

**Prerequisites:** Phases 4, 7 (eval discipline in place).

---

## Tasks

- [ ] **P10.T1 — Generate actions.**
  Admin Server Actions (`requireAdmin()`-gated): recruiter summary, technical summary, CV bullets,
  case-study outline, article ideas. Grounded **only in the entity's own fields**; structured output;
  results land in **draft fields** — published fields untouched by generation code (enforced by which columns the action writes).
  **Done:** unauthenticated call → 403; generation fills the draft field only; published field byte-identical before/after (assert in test).

- [ ] **P10.T2 — Review UI.**
  Per-field draft panel: Generate → side-by-side (current vs draft) → Edit / Accept / Discard.
  Accept writes the field; publish remains the separate explicit action it already is (Phase 4 workflow).
  Mobile: full-width sheet flow.
  **Done:** full generate→review→accept cycle completed on a 360px phone; discard leaves field unchanged.

- [ ] **P10.T3 — Cost guard.**
  Per-admin rate limit on generation actions (e.g. 50/day) + **D-P10-1** default drafting model = cheaper tier
  (upgrade per-action only if quality demands). Keep last 3 generations per field for compare/regenerate.
  **Done:** limit enforced and surfaced in UI; history retains last 3.

- [ ] **P10.T4 — Output quality pass.**
  Manual review of generated drafts for all 4 real projects: no fabricated metrics, tone consistent with site copy.
  Feed recurring prompt failures into the Phase 7 fixture set.
  **Done:** outputs reviewed and accepted/edited into real content; any new failure mode added as a Phase 7 fixture. **← Phase exit criterion (§13)**
