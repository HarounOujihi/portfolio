# Phase 2 — Public Portfolio v1 (no AI)

**Goal:** the site is already a legitimate portfolio: hero, about, skills, experience timeline,
projects list + detail, education, contact, CV, responsive, a11y baseline, SEO.
**Exit criteria (§13):** the site stands alone without the AI layer. — **essentially MET 2026-09-14**
(one pending measurement, see P2.T11).
**Status: 9/10 tasks done.**

**Prerequisites:** Phase 1. **UI:** per [design-system](design-system.md).

---

## Tasks

- [x] **P2.T1 — Header/footer/nav.**
  Desktop inline links; mobile hamburger → shadcn `Sheet` drawer (full-height, 44px rows,
  focus managed by Sheet); footer socials + CV.
  **Done:** 390px screenshot verified — no horizontal scroll, single column; drawer focus-trapped.

- [x] **P2.T2 — Home hero + curves.**
  Fluid `--text-hero`, organic portrait mask (me.jpg) + blob behind, entrance reveals,
  **owner-upgraded pattern:** hero bottom = `AnimatedCurve` (fill into brand-soft + self-drawing
  brand stroke line, CSS-only, reduced-motion static) + `motion` scroll reveals (design-system motion rules).
  **Done:** renders verified at 390px + desktop; curve/line in served HTML; reduced-motion guards in CSS.

- [x] **P2.T3 — Experience timeline.**
  Vertical line + dot markers + achievement cards (bg-neutral-50 callouts, no bars).
  **Done:** renders 6 seeded experiences + 17 achievements, sorted isCurrent/startDate desc.

- [x] **P2.T4 — Projects list + detail (basic).**
  `/projects`: industry chips via searchParams (server-side, no client JS), organic cards.
  `/projects/[slug]`: hero meta, role, overview, stack primary/secondary, links,
  challenge/solution/outcome sections render when present (content lands Phase 3 / P3.T1).
  **Done:** all 4 detail pages + filtered list return 200; heading hierarchy fixed (h1→h2 cards);
  projects published in seed (owner content real — deep case studies still Phase 3).

- [x] **P2.T5 — About page.**
  Long bio (whitespace-pre-line), skills grouped by category with level wording — no bars;
  education; certifications section auto-hides when empty (currently none on record).
  **Done:** all sections render from DB.

- [x] **P2.T6 — Contact form.**
  Server Action + Zod (`name/email/subject/message` caps) + honeypot (silent success) +
  `lib/rate-limit.ts`: IP-keyed (`x-forwarded-for` first hop), Upstash when configured,
  in-memory sliding-window fallback for dev (documented single-instance limitation).
  5 msgs / 10 min per IP; `ContactMessage` persisted (option (a) per D-P0-1).
  **Done:** form renders with all fields + honeypot; 7/7 unit tests (IP key derivation,
  composite key, window behavior); action returns field errors / rate-limit message.
  *(Manual end-to-end submit from a real browser pending — the pieces are unit-verified.)*

- [x] **P2.T7 — CV download.**
  `/haroun-oujihi-cv.pdf` served from public/ (200 verified); `download` attribute in header/hero/footer.
  **Done:** asset served with original filename (real-phone check on deploy).

- [x] ~~**P2.T8 — Dark mode polish.**~~ **DROPPED — owner decision 2026-09-14: light theme only.**

- [x] **P2.T9 — Accessibility baseline.**
  **Done: axe 4.10 — ZERO violations across all 7 pages** (/, /projects, /projects/[slug],
  /experience, /about, /contact, /engineering) at mobile viewport. Fixed during the pass:
  heading-order (cards take heading prop), color-contrast (contact aside note).
  Skip-link: deferred to P12.T3 full a11y pass (landmark structure in place).

- [x] **P2.T10 — SEO base.**
  `metadataBase` + title template, per-route metadata, `sitemap.ts` (6 public routes,
  **no /admin** — owner requirement), `robots.ts` (Disallow: /admin — verified served).
  **Done:** sitemap 6 URLs; robots disallow verified; per-page titles/descriptions in HTML.
  Default OG image: deferred to P3.T6 (per-slug OG images land with real content).

- [ ] **P2.T11 — Performance baseline.**
  `next/image` + `sizes` ✓, font subsetting ✓ (next/font), Client Components only where
  interactive (header drawer, contact form, motion wrappers) ✓.
  *Pending: Lighthouse mobile numbers on `/` — needs a Lighthouse run (CLI or PageSpeed) once
  deployed or with local Chrome; record: perf ___, a11y ___.*
