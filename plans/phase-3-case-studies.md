# Phase 3 — Case Studies & Engineering Content

**Goal:** the 5–10 minute CTO experience: full case studies (challenge/solution/outcome/architecture/stack),
architecture diagrams, articles section.
**Exit criteria (§13):** a CTO can spend 5–10 minutes here productively. — **MET 2026-09-14**
**Status: ✅ COMPLETE (7/7 tasks; metrics + final screenshots remain owner-blocked, tracked in P0.T2).**

**Prerequisites:** Phase 2. **UI:** per design-system; curves strongest on these pages.

---

## Tasks

- [x] **P3.T1 — Case-study content entry (seed, not admin — Phase 4 brings the CMS).**
  All 4 projects populated with grounded content: 10 challenges, 12 solutions, 8 outcomes,
  4 media assets (BitMal ×3, Sunchine ×1 — owner-provided screenshots). Role wording = full
  product-lifecycle framing (owner decision). Stack primary/secondary seeded.
  **Deviation (owner-blocked):** outcome *metrics* remain empty — owner hasn't supplied numbers yet
  (P0.T2 open); no numbers were invented. Structure and `metric` field ready for them.
  CONFIDENTIAL respected: no client-confidential claims; BitMal screenshots displayed (owner-added).
  **Done:** verified in DB — ch 10 / sol 12 / out 8 / media 4; re-seed idempotent.

- [x] **P3.T2 — Case-study page design.**
  Meta row (industry/status/period), role line, links, screenshots gallery (lightboxed),
  challenge → solution → outcome cards with alternating organic radii, outcome metric callouts,
  stack primary/secondary, related experience (SoldX → MAHD, fact-mapped), prev/next navigation,
  Reveal transitions on cards.
  **Done:** all 4 pages 200; axe-clean; curves used deliberately (cards + gallery, no curve soup).

- [x] **P3.T3 — Architecture diagrams.**
  Hand-crafted simplified SVGs per project (`components/diagrams.tsx`) using only confirmed facts
  (multi-tenant core + pipeline + connectors for SoldX; 4-role wallets for BitMal; job/COC/NCR
  workflow for Sunchine; roles→modules for John Dewey). `currentColor` + theme vars (light theme
  since dark-mode drop). Tap-to-expand lightbox (Base UI Dialog, Esc/keyboard).
  **Deviation:** "export Phase 0 sources" → owner hasn't provided diagram sources; hand-built
  simplified views from confirmed facts instead (labeled "simplified view" in UI). Accessible
  (`role="img"` + `<title>`).
  **Done:** legible after lightbox; axe svg-img-alt violation fixed; dark variant n/a (no dark mode).

- [x] **P3.T4 — One interactive diagram — BUILT.**
  D-P3-1: step-through of the SoldX invoice pipeline (5 steps: document in → structured extraction
  → validation-as-router → per-tenant rollout → PO match). Client Component, `motion` transitions
  ≤0.2s, `aria-live` step text, tab-style step buttons, prev/next 44px buttons, disabled edges.
  **Done:** renders on /projects/soldx-studio; keyboard operable (buttons); reduced-motion respected.

- [x] **P3.T5 — Articles section.**
  D-P3-2: **react-markdown + remark-gfm + @tailwindcss/typography** (prose) — recommended option;
  MDX unnecessary. Content lives in `content/articles/*.md` (frontmatter) → seeded into DB →
  rendered at `/articles/[slug]`. Two REAL articles written (CV/owner-grounded, no fabricated
  numbers): "What multi-tenant ERP data modeling actually demands" (ARCHITECTURE) and
  "Multi-model LLM routing without burning money" (AI).
  **Deviation:** code-copy-button/syntax theming deferred until an article actually contains code.
  **Done:** both articles render published (200), prose measure ok, unknown slug 404s.

- [x] **P3.T6 — OG images per slug.**
  `opengraph-image.tsx` via `next/og` for `/projects/[slug]` + `/articles/[slug]`: title,
  industry/type, brand accent. Note: Satori requires explicit `display:flex` on every multi-child
  div (learned via 500 → fixed). "Key metric" line pending metrics (P0.T2).
  **Done:** both routes return 200 `image/png` for all slugs; OG-debugger check on deploy.

- [x] **P3.T7 — Content QA pass.**
  Every case-study claim traced to CV or owner statements (2026-09-14/16 sessions); dates match
  owner answers (BitMal 2024, Sunchine 2025+maintenance, JD 2026, SoldX 2023–present = MAHD);
  no invented metrics (fields empty, marked owner-pending); BitMal assistant fixture flipped to
  attribution in Phase 0 (consistent with live content).
  **Done:** QA applied during seeding; `notes.md` per-project checklists remain the owner-side
  ledger for the still-open items (metrics, diagram sources, remaining screenshots).
