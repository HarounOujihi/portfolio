# Phase 4 — Auth + Admin CMS

**Goal:** Better Auth **email + password** (owner decision D-P4-1, 2026-09 — supersedes the §8.1
OAuth-only stance) with a **single allow-listed ADMIN**; full admin CMS with the two-tier effort
split (§10), draft/publish/preview, mobile-good shadcn admin (design-system §5).
**Owner requirements (2026-09-14):** only the admin can add/edit content; **no public link to /admin anywhere**.
**Exit criteria (§13):** editing a project in `/admin` shows up on the public site.

**Prerequisites:** Phase 3.

---

## Tasks

### Auth

- [x] **P4.T1 — Auth library decision.**
  **Decision D-P4-1 (owner, 2026-09-14): Better Auth, email+password credentials.**
  Reason: owner explicitly requires password login for the single admin; Better Auth is GA-stable and
  natively supports credentials. GitHub OAuth dropped. Allow-list unchanged: `haroun@mahd.group` only (ADMIN).
  Password policy: `ADMIN_INITIAL_PASSWORD` in `.env` (gitignored) → hashed via `better-auth/crypto`
  `hashPassword` at seed/setup; **never plaintext in seed or code; rotate before production** (it transited chat).
  **Done:** decision recorded; implemented in P4.T2.

- [x] **P4.T2 — Better Auth credentials + allow-list (supersedes OAuth task).**
  Better Auth with email+password plugin; sessions cookie-based (no session tables needed for one admin —
  Better Auth manages its own storage as required). Allow-list enforced in the credentials flow:
  only `haroun@mahd.group` may authenticate (reject others at config level); `AdminUser` row is the
  audit mirror (seeded — `lastLoginAt` updated on sign-in). Signup disabled — admin exists only via seed.
  Password source: `ADMIN_INITIAL_PASSWORD` env → `hashPassword` once (idempotent seed guard:
  re-hash only if no credential exists).
  **Done:** login works with owner credentials; wrong password rejected; any other email rejected
  even with correct password; no signup path exists; rate limit on login endpoint (5/min/IP).

- [ ] **P4.T3 — Data-level protection (`requireAdmin()`).**
  Shared helper: `const session = await auth(); if (!session) redirect("/admin/login")` (+ role check when needed).
  Applied at the top of **every** admin Server Component, Server Action, and Route Handler that touches data —
  middleware stays an optional fast-path only (CVE-2025-29927, §8.2).
  **Admin invisibility (owner requirement):** no link to `/admin` in any public header/footer/sitemap/robots;
  login page at unlinked `/admin/login` with `robots: noindex`; `/admin` absent from `sitemap.ts`.
  (Direct URL entry still works — that's expected; the protection is auth, not obscurity.)
  **Done:** grep audit: zero admin data accesses without the check; logged-out POST to an admin action → 403/redirect (manual test).

### Admin shell & patterns

- [ ] **P4.T4 — Admin shell.**
  `/admin` layout: shadcn Sidebar (icon rail desktop, off-canvas mobile), topbar (breadcrumb, theme, user menu), sonner.
  **Done:** shell at 360px → off-canvas nav, touch targets 44px; matrix pass.

- [ ] **P4.T5 — Shared CRUD patterns (build once, reuse for every entity).**
  `DataTable` (table ≥ md / card list < md, kebab actions, pagination — design-system §5) +
  `SheetForm` (react-hook-form + Zod, full-width sheet on mobile, pinned submit bar).
  **Done:** both components exist, documented, and are used by P4.T6 immediately.

### Content CRUD (tier 1 — full effort)

- [ ] **P4.T6 — Profile (singleton).**
  Fixed-id edit form only (no create/list per §7 note).
  **Done:** save reflects on public about/home immediately.

- [ ] **P4.T7 — Experience + achievements.**
  CRUD + nested achievements repeater (add/remove/reorder), `employmentType` select, `isCurrent` ↔ `endDate` logic.
  **Done:** create with 3 achievements saves and renders publicly; delete cascades achievements.

- [ ] **P4.T8 — Projects CRUD (the flagship screen).**
  Full form: nested challenges/solutions/outcomes repeaters, technologies multi-select with `importance`,
  media attach, external links, slug auto-gen + editable (uniqueness error surfaced), `featured`/`published`/`sortOrder`,
  status enum. **Delete action notes the future knowledge-cleanup hook (D-P1-2) — implemented Phase 6; for now a `// TODO(phase-6)` marker + log.**
  **Done:** create → publish → visible on `/projects` and to the assistant's data later; unpublish hides; slug collision rejected with inline error; mobile form flow complete at 360px.

- [ ] **P4.T9 — Articles CRUD.**
  Markdown textarea (or file paste), excerpt, type, `publishedAt` set on first publish, cover image.
  **Done:** draft invisible publicly → publish appears → unpublish hides; `publishedAt` correct.

### Content CRUD (tier 2 — generic, fast)

- [ ] **P4.T10 — Technologies, Skills, Education, Certifications.**
  Reuse P4.T5 patterns — generic list + sheet form each. Don't polish these (§10).
  **Done:** full CRUD on all four; one mobile pass total (not per entity).

- [ ] **P4.T11 — Media library.**
  Provider decision **D-P4-2**: Vercel Blob (recommended) vs UploadThing. Upload + alt (required) + caption + attach to project/article.
  **Done:** upload works from a phone camera roll; alt enforced; public pages serve optimized variants.

### Workflow & ops

- [ ] **P4.T12 — Preview for drafts.**
  Authenticated preview of unpublished project/article (same templates, `preview` data source).
  **Done:** draft previewable while authed; 404/logged-out → not accessible.

- [ ] **P4.T13 — Content export (backup).**
  Admin action: JSON export of all content tables; documented restore path (export + seed).
  **Done:** export downloads; a fresh DB + export round-trip reproduces content (test on a subset).

- [ ] **P4.T14 — Tests.**
  Vitest: allow-list normalization, slug generation. Playwright: login → create project → publish → visible on public site.
  **Done:** `pnpm test` green. **← Phase exit criterion (§13: admin edit shows on public site)**
