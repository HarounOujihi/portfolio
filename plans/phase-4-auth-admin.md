# Phase 4 — Auth + Admin CMS

**Goal:** Better Auth **email + password** (owner decision D-P4-1, 2026-09 — supersedes the §8.1
OAuth-only stance) with a **single allow-listed ADMIN**; full admin CMS with the two-tier effort
split (§10), draft/publish/preview, mobile-good shadcn admin (design-system §5).
**Owner requirements (2026-09-14):** only the admin can add/edit content; **no public link to /admin anywhere**.
**Status: PART 1 ✅ COMPLETE (auth core, login, shell, Signals editor, Projects admin with
ordering). PART 2 pending (remaining entity editors, media upload, export, e2e tests).**

**Prerequisites:** Phase 3.

---

## Tasks

### Auth

- [x] **P4.T1 — Auth library decision.**
  **Decision D-P4-1 (owner, 2026-09-14): Better Auth, email+password credentials.**
  GitHub OAuth dropped. Allow-list: `haroun@mahd.group` only (ADMIN).
  Password policy: `ADMIN_INITIAL_PASSWORD` in `.env` → hashed via `better-auth/crypto`
  `hashPassword` at seed; **never plaintext; rotate before production** (it transited chat).
  Better Auth 1.7.4 with `emailAndPassword.disableSignUp = true` (no signup path exists) +
  session-create hook rejecting non-allow-listed emails (defense in depth).
  **Done:** decision recorded; implemented and verified.

- [x] **P4.T2 — Better Auth credentials + allow-list.**
  Login page at **unlinked `/admin/login`** (`noindex`, not in sitemap). `Better Auth` tables
  (`user`/`session`/`account`/`verification` — lowercase per adapter convention) migrated.
  Credential seeded in `prisma/seed.ts` from env (idempotent — re-hash only if no credential row).
  **Admin invisibility:** no link to `/admin` anywhere public; `/admin` absent from sitemap;
  robots Disallow verified. Login rate limit: 10/min/IP in middleware (in-memory, per-instance).
  **Done (verified live):** owner credentials → session + `/admin`; wrong password → 401;
  unknown email → 401; logged-out `/admin` → 307 → `/admin/login`.

- [x] **P4.T3 — Data-level protection (`requireAdmin()`).**
  `src/lib/require-admin.ts` (`auth.api.getSession` → redirect). Used by the (panel) layout AND
  every admin server action. Middleware (`src/middleware.ts`) = cookie fast-path only.
  **Done:** guard in layout + all actions; logged-out POST/GET verified redirected.

### Admin shell & patterns

- [x] **P4.T4 — Admin shell (functional dark shell).**
  `(panel)` layout: brand mark, nav pills with active state (Overview/Projects/Signals),
  owner email, View-site link, sign out. Mobile-verified.
  **Done:** shell renders at 390px; axe-clean.

- [x] **P4.T5 — Shared CRUD patterns (started).**
  Server-action + plain-form pattern (no RHF dependency) for list/inline editors; nested
  repeaters via name-array inputs. Used by Stats + Projects forms.
  **Done:** pattern proven in Stats editor (add/edit/delete/reorder) and Project form
  (challenges/solutions/outcomes repeaters, tech checkboxes).

### Content CRUD

- [x] **P4.T6 — Signals stats editor (owner-requested "wrong numbers" fix).**
  `Stat` model (value/label/sortOrder) + `/admin/stats`: edit value+label, add, delete,
  reorder ↑↓. Home Signals section now reads from the DB.
  **Done:** E2E verified live — edit 10+→11+ → home shows 11+ → revert → home shows 10+.

- [x] **P4.T7 — Projects admin with ordering (owner-requested "sort projects to appear first").**
  `/admin/projects`: reorder ↑↓ (controls the home bento order), Featured toggle (home big card),
  Published toggle (public visibility), Edit, Delete (confirm).
  Form (`/admin/projects/new` + `/admin/projects/[id]`): name, slug (auto + uniqueness),
  descriptions, role, market, live URL, industry/type/status selects, dates (+ ongoing),
  technologies checkboxes, challenges/solutions/outcomes repeaters.
  **Deviation:** media picker + external-links editor deferred to Part 2 (needs D-P4-2 upload
  provider); external links remain seed-managed until then.
  **Done:** list renders with all controls; form saves core + nested content (verified via seed
  data render + typecheck); delete guarded by confirm.

- [x] **P4.T8 — Articles CRUD.** Generic spec-driven editor at `/admin/manage/articles` (title, type, excerpt, markdown content, publish toggle). Slug auto-unique from title; publishedAt set on first publish. Verified: create via seed + admin editor path; unknown slug 404s; draft hidden publicly; admin draft preview via `?preview=1` (auth-gated) on article + project detail pages.
- [x] **P4.T9 — Experience + achievements editor.** `/admin/experience` list (reorder, edit, delete) + dedicated form (company, title, type select, dates, ongoing, summary, description, published, achievements repeater). Verified: create → list → delete cycle.
- [x] **P4.T10 — Technologies/Skills/Education/Certifications editors.** Generic spec-driven engine (`/admin/manage/<resource>`): list with reorder/edit/delete + create + spec-driven forms. E2E-verified (education create → list → delete).
- [x] **P4.T10b — Signals stats editor.** `/admin/stats` — E2E-verified live edit (home reflects immediately).
- [x] **P4.T10c — Profile editor.** `/admin/profile` — all profile fields, saved banner.
- [x] **P4.T10d — Messages triage.** `/admin/messages` — read + status (NEW/READ/REPLIED/SPAM).
- [ ] **P4.T11 — Media library (upload provider D-P4-2).** *(Deferred — needs Vercel Blob/UploadThing account. Existing screenshots display via public/ until then.)*
- [x] **P4.T12 — Preview for drafts.** `?preview=1` on project/article detail pages renders unpublished content for authenticated admins only (session-checked server-side).
- [x] **P4.T13a — Content export.** `/admin/export` — admin-only JSON download of all content tables.
- [ ] **P4.T13 — Content export (backup).** *(Part 2 — seed remains the backup source until then.)*
- [ ] **P4.T14 — Tests (Playwright admin e2e).** *(Deferred to P12 full-suite setup. Auth negatives verified by direct API tests this part: 401 wrong password, 401 unknown email, 307 logged-out; CRUD verified by live UI E2E.)*
- [x] **P4.T15 — Deployment (owner request 2026-09-14):** Vercel via GitHub import; auto-deploy on push + tags; build runs `prisma generate && next build`; env vars incl. `BETTER_AUTH_URL`, `NEXT_PUBLIC_SITE_URL`; production DB = managed Postgres with pgvector (Neon). Domain: rename project → `harounoujihi.vercel.app`.

### Notes

- Delete→re-index hook (D-P1-2): `TODO(phase-6)` marker in deleteProject — wired when the
  knowledge base exists (Phase 6).
- Turbopack stale-module incidents observed twice in dev — resolved by server restart; if a page
  ever looks stale after edits, restart `portfolio-web`.
