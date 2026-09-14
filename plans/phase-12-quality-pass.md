# Phase 12 — Quality Pass

**Goal:** production quality everywhere, not just demo pages (§13): performance, full responsive +
a11y + SEO + security passes, error states, suite green, backup rehearsal.
**Exit criteria (§13):** production quality throughout.

**Prerequisites:** Phases 0–11 feature-complete.

---

## Tasks

- [ ] **P12.T1 — Performance.**
  Bundle audit (`@next/bundle-analyzer`), `next/image` `sizes` audit, font subsetting check,
  lazy-load diagrams + assistant panel, cache headers on public GETs.
  **Done:** Lighthouse mobile — home / project / article: perf ≥ 95, a11y ≥ 95; numbers recorded: ____

- [ ] **P12.T2 — Full responsive matrix (design-system §3).**
  Every public page + `/assistant` + admin CRUD at 360 / 390 / 768 / 1024 / 1440 / 1920:
  no horizontal scroll, 44px targets, curves not clipping text/focus, `100dvh` surfaces correct.
  **Done:** per-page checklist fully ticked; all found issues fixed (not documented-and-skipped).

- [ ] **P12.T3 — Full accessibility pass.**
  Keyboard-only walk: nav → projects → case study → chat → job-fit → admin CRUD.
  Screen reader: chat streaming announces only new text; dialog/sheet focus management.
  Contrast both themes; `prefers-reduced-motion` kills blob/morph animations.
  **Done:** axe 0 critical on all routes; SR + keyboard session notes recorded.

- [ ] **P12.T4 — SEO completion.**
  Unique metas everywhere, OG images on all slug routes (P3.T6 verified again), sitemap/robots accurate,
  JSON-LD: `Person` (home), `Article` (articles), `CreativeWork` (projects) — only where genuinely useful (§11).
  **Done:** rich-results validator clean; sitemap matches deployed routes exactly.

- [ ] **P12.T5 — Security review.**
  - Headers: `X-Frame-Options: DENY`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`; CSP report-only first.
  - Re-verify: endpoint Zod caps, rate-limit keys (IP-based — P5.T1), admin `requireAdmin()` audit (P4.T3 grep),
    no API keys in any client bundle (grep the built chunks), `noindex` on job-match pages, injection evals re-run green.
  **Done:** checklist ticked; headers verified via `curl -I`; eval run green at final prompts.

- [ ] **P12.T6 — Error & empty states.**
  `error.tsx`, `not-found.tsx`, empty-state designs (no projects with filter, empty analytics, warming observability strip), skeletons.
  **Done:** forced-error tour documented (bad slug, DB-down dev simulation, empty filters).

- [ ] **P12.T7 — Full suite gate.**
  One command: `pnpm verify` = typecheck + lint + vitest + playwright + evals (baseline gate from P7.T8).
  Optional: GitHub Actions CI running it on push.
  **Done:** single command green locally (and in CI if configured).

- [ ] **P12.T8 — Backup rehearsal.**
  Provider snapshot + content export (P4.T13) restore drill onto a fresh database.
  **Done:** fresh DB restored from export reproduces the site; steps documented in README. **← Phase exit criterion (§13)**
