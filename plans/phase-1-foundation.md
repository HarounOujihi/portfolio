# Phase 1 — Foundation

**Goal:** Next.js + Tailwind v4 + Prisma 7 scaffold, full schema with pgvector migration done
right, seed data, app shell. Design tokens per design-system.
**Exit criteria (§13):** a page renders `Profile` from the real database. — **VERIFIED 2026-09-14**
**Status: ✅ COMPLETE (all 13 tasks done).**

**Prerequisites:** Phase 0.

---

## Tasks

### Provider & scaffold

- [x] **P1.T1 — Choose Postgres provider.**
  **Decision D-P1-1 (dev):** local Docker `pgvector/pgvector:pg16` — container `portfolio-db`,
  port **5434** (5432/5433 occupied by other projects on this machine), volume `portfolio-db-data`,
  extension `vector` enabled. Production provider (Neon/Supabase/Prisma Postgres — all ship pgvector)
  **deferred to deploy time**; only `DATABASE_URL` changes.
  **Done:** instance created, `DATABASE_URL` in `.env` (gitignored), connection + `CREATE EXTENSION vector` verified.

- [x] **P1.T2 — Scaffold Next.js.**
  Deviation: `create-next-app` refuses non-empty directories (plans/, assets/, content/ exist) —
  scaffold written manually: package.json, strict tsconfig, next.config.ts, postcss (TW4), ESLint flat config.
  **Done:** `pnpm dev` serves (verified on :3000); `"strict": true`; **versions in `plans/README.md`**.
  Version notes: TypeScript 7.0.2 rejected (entire toolchain peer-requires <6.1) → 5.9.3;
  ESLint 10 broke eslint-config-next → 9.39. Prettier: not installed yet (deferred — add when formatting CI lands).

- [x] **P1.T3 — shadcn/ui init + base set.**
  14 components: button, input, textarea, label, select, sheet, dialog, alert-dialog, dropdown-menu,
  table, card, badge, skeleton, sonner. **`form` no longer exists in the current shadcn registry**
  (CLI exits silently) — deferred: P4.T5 builds the custom `SheetForm` pattern anyway.
  **Done:** `components.json` exists; components render.

- [x] **P1.T4 — Design tokens + curve primitives (per design-system §2, §1).**
  `@theme` block (Inter via next/font, validated brand oklch, organic radii, fluid type vars),
  `components/ui/section-curve.tsx`, blob keyframes + `prefers-reduced-motion` guard.
  **Done:** scratch section on `/` renders divider + organic cards + blob (verified via dev server HTML).

### Prisma 7 + schema

- [x] **P1.T5 — Prisma 7 with driver adapter.**
  Prisma 7.10: `url` is **removed from schema datasource** — migrations read `prisma.config.ts`
  (with `dotenv/config`), runtime client uses `PrismaPg` adapter in `src/lib/db.ts`.
  **Done:** `prisma validate` passes; client instantiates; seed runs through the adapter.

- [x] **P1.T6 — Schema decisions (from plan review — applied all).**
  **D-P1-2** `KnowledgeDocument @@unique([sourceType, sourceId])` ✓ ·
  **D-P1-3** split `AIEvaluationCase` + `AIEvaluationRunResult` ✓ ·
  **D-P1-4** `Conversation @@unique([sessionId, mode])` + `@@index([lastMessageAt])` ✓ ·
  **D-P1-5** shareSlug = nanoid(12) at app level (documented in schema) ✓ ·
  delete→re-index policy documented in schema comment (wired Phase 6) ✓.
  **Done:** all five in `prisma/schema.prisma`.

- [x] **P1.T7 — Base migration (without the vector column).**
  **Done:** `20260914111327_init` applied clean on empty DB.

- [x] **P1.T8 — pgvector migration exactly per §7.1.**
  `20260914111424_add_pgvector` (hand-written): `CREATE EXTENSION IF NOT EXISTS vector` +
  `ADD COLUMN "embedding" vector(1024)` + HNSW `vector_cosine_ops` index → deployed →
  `embedding Unsupported("vector(1024)")?` enabled in schema → client generated.
  **Done:** `\d "KnowledgeChunk"` shows column AND HNSW index (verified via psql).

- [x] **P1.T9 — Index-loss guard (the §7.1 gotcha).**
  `scripts/assert-vector-index.mjs` — idempotent re-create + existence check, non-zero exit on failure.
  Wired into `db:migrate` and `db:migrate:deploy` scripts (Prisma 7 has no postmigrate hook).
  **Done:** ran twice → OK both times; drop-and-regenerate path proven by construction (IF NOT EXISTS).

### Seed & shell

- [x] **P1.T10 — Seed script.**
  `prisma/seed.ts` (tsx + dotenv): Profile singleton, 19 technologies, 24 skills, 1 education,
  certifications intentionally empty (none on record), 6 experiences (published, from CV) with
  17 achievements, 4 draft projects (status/dates per owner notes), 2 article stubs.
  **Owner addition 2026-09:** seeded `AdminUser` `haroun@mahd.group` (role ADMIN) — allow-list mirror
  only; auth method (OAuth vs email+password via Better Auth) decided at Phase 4, no credentials stored.
  **Done:** seed ran twice → identical counts (1/6/4/19) — idempotent ✓.

- [x] **P1.T11 — App shell.**
  Inter (next/font), sticky header (safe-area top, CV pill, nav skeleton), footer, `max-w-6xl`,
  `min-h-[100dvh]` column layout.
  **Owner decision 2026-09: dark theme dropped** — ThemeProvider/theme-toggle removed; light theme only.
  **Done:** layout holds at 360px; no hydration flash risk (theme machinery gone).

- [x] **P1.T12 — Baseline page + checks.**
  `/` renders `fullName`/`headline`/`shortBio` from PostgreSQL (Server Component) + P1.T4 scratch demo.
  **Done:** verified — HTTP 200 on dev server, profile fields in HTML, `pnpm typecheck && pnpm lint` green.
  **← Phase exit criterion MET (2026-09-14)**

- [x] **P1.T13 — Env hygiene.**
  `.env.example` covers §16.1 keys + `VISITOR_HASH_SALT` (Phase 5) + `ADMIN_EMAILS`;
  `.env` gitignored (also `.env*.local`, `src/generated/`).
  **Done:** `.env.example` matches reality; `.env` never committed.
