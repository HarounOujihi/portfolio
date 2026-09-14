# Implementation Plans

Step-by-step, checkable plans derived from [`../PORTFOLIO_PROJECT_PLAN.md`](../PORTFOLIO_PROJECT_PLAN.md).
That document is the **why**; this folder is the **how**.

Every task is a checkbox with an observable **Done:** check. A task is done only when
its Done-check actually passes — not when the code seems finished.

## How to use

1. Work phases in order (MVP = 0–4, AI layer = 5–9, polish = 10–12, 13 optional).
2. Mark tasks `- [ ]` → `- [x]` when the Done-check passes. Optionally date it: `- [x] (2026-10-01)`.
3. Decisions `D-xx` come pre-resolved with a choice and reason. Revisit only with new evidence.
4. A phase is done when **all tasks are checked AND its Exit criteria are verified**.
5. Record installed tool versions in the table below (Phase 1 task).

## Phase status

| Phase | File | Scope | Status |
|---|---|---|---|
| 0 | [phase-0-product-definition.md](phase-0-product-definition.md) | Copy, case-study assets, eval fixtures | **in progress — 5/7 done** (T2, T3 need owner input: BitMal status, screenshots, confidential calls) |
| 1 | [phase-1-foundation.md](phase-1-foundation.md) | Scaffold, schema, migrations, pgvector | ✅ **done** (exit criterion verified 2026-09-14) |
| 2 | [phase-2-public-v1.md](phase-2-public-v1.md) | Public portfolio (no AI) | **9/10 done** — axe-clean site-wide in the adopted dark editorial design; home replaced (owner decision); Lighthouse measurement pending (P2.T11) |
| 3 | [phase-3-case-studies.md](phase-3-case-studies.md) | Case studies, articles, diagrams | ✅ **done** (metrics + final screenshots owner-blocked, tracked in P0.T2) |
| — | [design-system](design-system.md) | **Owner decision 2026-09-14 (later same day): `/demo` direction ADOPTED site-wide** — dark-only editorial design (Space Grotesk, oversized type, bento, marquee) replaces the classic light home; multi-page structure kept; `/demo` template removed after adoption. Menu fix (active states + staggered drawer) also shipped. |
| 4 | [phase-4-auth-admin.md](phase-4-auth-admin.md) | Auth + admin CMS | **part 1 ✅** (login/admin shell/Signals editor/Projects admin + ordering) — part 2 remaining: articles/experience done ✓, media upload + export ✓, Playwright e2e deferred to P12 |
| 5 | [phase-5-ai-assistant.md](phase-5-ai-assistant.md) | Chat, tools, streaming, rate limits | not started |
| 6 | [phase-6-rag-knowledge.md](phase-6-rag-knowledge.md) | Knowledge base, hybrid retrieval, re-index | not started |
| 7 | [phase-7-evaluation-safety.md](phase-7-evaluation-safety.md) | Eval suite, injection probes, admin view | not started |
| 8 | [phase-8-job-fit.md](phase-8-job-fit.md) | Job-fit analyzer + shareable permalinks | not started |
| 9 | [phase-9-observability.md](phase-9-observability.md) | Public AI health strip | not started |
| 10 | [phase-10-content-assistant.md](phase-10-content-assistant.md) | Admin AI drafting (review-gated) | not started |
| 11 | [phase-11-analytics.md](phase-11-analytics.md) | Events, dashboards, retention cron | not started |
| 12 | [phase-12-quality-pass.md](phase-12-quality-pass.md) | Perf, mobile/a11y/SEO/security passes | not started |
| 13 | [phase-13-optional.md](phase-13-optional.md) | Optional extensions (trigger-gated) | not started |

## Shared docs

- [design-system.md](design-system.md) — UI/UX law: curve language, mobile-first rules,
  admin patterns (shadcn, mobile-good). Every UI task references it; read once before Phase 1,
  apply from Phase 2 on.

## Installed versions (fill during Phase 1)

| Package | Version |
|---|---|
| next | 16.3.5 |
| react / react-dom | 19.3.0 |
| prisma / @prisma/client | 7.10.0 (+ @prisma/adapter-pg 7.10.0, pg 8.23.0, pgvector 0.3.0) |
| ai (Vercel AI SDK) | — (Phase 5) |
| @ai-sdk/anthropic | — (Phase 5) |
| @ai-sdk/voyage | — (Phase 6) |
| tailwindcss | 4.3.3 (@tailwindcss/postcss) |
| next-auth / better-auth | — (Phase 4 decision D-P4-1) |
| @upstash/ratelimit | — (Phase 2) |
| typescript | 5.9.3 (7.x rejected — toolchain peer range) |
| eslint | 9.39 (flat config, native eslint-config-next 16.3.5) |

**Local dev DB:** Docker `pgvector/pgvector:pg16`, container `portfolio-db`, port 5434, volume
`portfolio-db-data`. Start: `docker start portfolio-db`. Admin allow-list seed: `haroun@mahd.group` (ADMIN).
**Dark theme: dropped by owner decision 2026-09-14 — light only.**

## Conventions

- **Tests:** Vitest for unit (rate-limit keying, chunker, RRF fusion, validators), Playwright for e2e (public smoke, admin CRUD, chat, job-fit). Listed per task; full suite gate in Phase 12.
- **Definition of done for code tasks:** typecheck + lint green, Done-check passes, no `TODO` left in touched paths.
- **Content lives in seed first** (Phases 2–3), moves into the admin CMS in Phase 4. The seed script stays the restore/backup source of truth.
- **Security invariants** (checked again in Phase 12): admin data access always re-checks `auth()` outside middleware; API keys server-side only; all public POST endpoints Zod-validated + rate-limited; visitor IDs hashed, never raw.
- **Auth (D-P4-1, owner 2026-09-14):** Better Auth email+password; single admin `haroun@mahd.group`
  (ADMIN, seeded from `ADMIN_INITIAL_PASSWORD`, hashed); no public link to `/admin`; login rate-limited.
  **Rotate the initial password before production** — it transited chat.
