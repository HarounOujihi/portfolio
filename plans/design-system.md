# Design System — Curves, Mobile-First, Admin Patterns

UI/UX law for the whole build. UI tasks in the phase plans say "per design-system" — the rules
live here. Philosophy: **modern and creative through one signature motif (curves), restrained
elsewhere** (per main plan §11: no skill-percentage bars, no gradient overload, no decorative 3D).

> **Owner decisions 2026-09-14 (superseding earlier notes in this doc):**
> 1. **Dark theme REINSTATED as the only theme** (reverses the earlier "dark dropped" note) —
>    dark-first palette in `:root`, light-only rules below are historical. Brand on dark:
>    `#6aa7f4` (7.70:1 on `#0a0a0a` — validated).
> 2. **Editorial direction ADOPTED** (from the `/demo` template): Space Grotesk as the site font,
>    oversized uppercase hero type (solid + outline stroke), bento work grid, tech marquee,
>    numbered section labels (`01 / Work`), stat cards, ambient radial accents.
>    Multi-page structure kept — home is the flagship; `/projects/[slug]`, `/experience` etc.
>    stay directly linkable.
> 3. **Admin:** no link to `/admin` anywhere in the public UI, sitemap, or robots. Login at
>    unlinked `/admin/login` (`noindex`). Better Auth email+password, single allow-listed admin.

---
## 1. Curve language (the signature)

> **Motion library (owner decision 2026-09-14): `motion`** (framer-motion successor, `motion/react`).
> Rules: animated elements are small Client Components (Server Components stay default);
> global `MotionConfig reducedMotion="user"`; scroll reveals `once: true`, ≤0.5s; hover/tap ≤0.2s.
> **Hero-bottom curve:** `AnimatedCurve` (animated §1.1) — filled area in the incoming section's bg
> + brand stroke line that draws itself (CSS `stroke-dashoffset`, static under reduced motion).
> One animated curve per page max; entrances stagger ≤0.3s total delay.

Five patterns. All are Tailwind v4 tokens/utilities, never scattered magic values.

### 1.1 Section dividers — curved section transitions
SVG curve between major page sections instead of hard horizontal edges.

```tsx
// components/ui/section-curve.tsx
export function SectionCurve({ fill, flip = false, className }: {
  fill: string; flip?: boolean; className?: string;
}) {
  return (
    <svg viewBox="0 0 1440 96" preserveAspectRatio="none" aria-hidden="true"
         className={`block h-12 w-full sm:h-16 ${flip ? "rotate-180" : ""} ${className ?? ""}`}>
      <path d="M0,96 C360,0 1080,0 1440,96 L1440,96 L0,96 Z" fill={fill} />
    </svg>
  );
}
```

- Fill = background color of the **incoming** section; place at the boundary.
- Use on: home hero→work, case-study hero→body, article header→content. Not between every pair of sections (2–3 per page max).
- `preserveAspectRatio="none"` stretches gracefully 360px→1920px.

### 1.2 Organic radii — asymmetric corners on cards/images

```css
/* app/globals.css @theme */
@theme {
  --radius-card: 1.25rem;                       /* standard cards */
  --radius-organic: 2rem 0.75rem 2rem 0.75rem;  /* signature asymmetric corner */
  --radius-organic-alt: 0.75rem 2rem 0.75rem 2rem;
}
```

- Apply `rounded-(--radius-organic)` to project cards, article covers, case-study media.
- Pair a card with `--radius-organic` and the next with `-alt` in grids for rhythm.
- Keep text contrast inside: radius must never clip text at 200% zoom — pad ≥ 1.5rem inside organic corners.

### 1.3 Morphing blob — hero decoration

```css
@keyframes blob-morph {
  0%, 100% { border-radius: 58% 42% 55% 45% / 55% 48% 52% 45%; }
  50%      { border-radius: 45% 55% 40% 60% / 42% 58% 45% 55%; }
}
.blob {
  border-radius: 58% 42% 55% 45% / 55% 48% 52% 45%;
  animation: blob-morph 14s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) { .blob { animation: none; } }
```

- One per page maximum (hero). Behind content (`-z-10`, low-opacity brand fill or subtle gradient).
- Decorative only: `aria-hidden`, never contains content.

### 1.4 Clip-path hero mask — curved image reveals

```css
.hero-mask { clip-path: ellipse(120% 100% at 50% 0%); }
```

- Case-study hero images / portrait. Verify focus outlines and text never sit under the clipped edge.

### 1.5 Curved underline — links and active nav

- Active nav item / inline emphasis: SVG curved underline stroke (2px, brand color), or `text-decoration: underline wavy` sparingly in articles.
- Never on body links (default underline there — a11y).

**Where curves are banned:** admin CRUD tables/forms, chat message list, job-fit result tables, anything data-dense. Public marketing surfaces get curves; functional surfaces get `--radius-card` only.

---

## 2. Tokens (Tailwind v4, CSS-first)

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --font-sans: var(--font-site), ui-sans-serif, system-ui;   /* Space Grotesk — adopted 2026-09-14 */

  /* brand on dark surfaces (owner decision 2026-09-14) — P0.T7 validated */
  --color-brand: oklch(0.72 0.13 255);
  --color-brand-soft: oklch(0.72 0.13 255 / 0.14);

  /* fluid type — no breakpoint font jumps */
  --text-hero: clamp(2.25rem, 1.2rem + 4vw, 4.5rem);
  --text-h2: clamp(1.5rem, 1.1rem + 1.8vw, 2.25rem);
  --text-lead: clamp(1rem, 0.95rem + 0.4vw, 1.25rem);
}
```

Dark theme is the only theme (owner decision 2026-09-14 — supersedes the `next-themes`/dual-theme
note in the header): dark oklch palette lives in `:root`, no toggle.

---
## 3. Responsive rules (mobile "very well", large screens clean)

- **Mobile-first CSS.** Design at 360px first, enhance upward.
- **Breakpoints:** `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`. Layout decisions happen at `md` (mobile↔desktop switch) and `lg` (wide layout).
- **Fluid type** from tokens — never media-query font sizes.
- **Touch targets ≥ 44×44px** (`h-11 min-w-11`): all nav items, chat send, form submits, row actions, mode switcher. shadcn defaults (`h-9`) are too small for primary mobile controls — override.
- **Heights:** use `100dvh` (not `100vh`) for full-height surfaces (assistant sheet, admin shell). Respect safe areas: `pt-[env(safe-area-inset-top)]` on fixed headers.
- **Containers:** `mx-auto max-w-6xl px-4 sm:px-6` standard; `max-w-7xl` for project grid on ≥ xl. No content wider than ~72ch for prose.
- **No hover-only affordances.** Every hover effect has a visible focus/active/tap equivalent.
- **Images:** `next/image` with explicit `sizes` per breakpoint; art direction (`<picture>`/`media`) only if a crop genuinely differs.
- **Scroll behavior:** `scroll-mt-20` on anchored sections (fixed header offset); horizontal scroll containers get `snap-x` + visible edge fade so they don't look broken.

### Test matrix (apply to every UI task's Done-check)

| Width | Device class | Quick checks |
|---|---|---|
| 360px | small Android | no horizontal scroll; primary CTA visible without scroll; nav usable thumb-only |
| 390px | iPhone | safe areas; `100dvh` surfaces correct with browser chrome |
| 768px | tablet | layout switch point renders intentional (not stretched mobile) |
| 1440px | laptop | max-widths hold; whitespace generous |
| 1920px | large desktop | no stretched full-bleed text; hero composition holds |

DevTools device toolbar is the baseline; one real-phone pass per phase (Chrome + Safari iOS).

---

## 4. Public component decisions

| Component | Mobile | Desktop |
|---|---|---|
| Site nav | sticky header, hamburger → `Sheet` drawer (full-height, 44px rows) | inline links + CV button |
| Assistant (Phase 5) | FAB → full-screen `Sheet` `side="bottom"`, `h-[100dvh]` | FAB → docked right panel 420px; `/assistant` route is the full experience on both |
| Project filters | chip row, wraps, or bottom-sheet filter panel ≥ 8 options | inline chip row |
| Timeline (experience) | single column, line on left | 2-col zigzag optional ≥ lg |
| Case-study diagrams | fit-to-width; tap → fullscreen lightbox | inline; expand optional |
| Job-fit input | textarea + counter, sticky submit | centered card, max-w-2xl |

---

## 5. Admin patterns (shadcn standard, mobile-good)

Use stock shadcn/ui components. The investment is **responsive behavior**, not custom aesthetics.

- **Shell:** shadcn `Sidebar` (SidebarProvider) — collapsible icon rail on desktop, off-canvas `Sheet` on mobile via its built-in mobile variant. Topbar: breadcrumb + theme toggle + user menu.
- **Data tables:** one shared `DataTable` pattern:
  - `md+`: shadcn `Table` inside `overflow-x-auto`, sortable headers, pagination.
  - `< md`: card list of the same rows (`hidden md:block` / `md:hidden` two renders) — title, 2 key fields, status badge, kebab menu.
  - Row actions always in a kebab `DropdownMenu` (never hover-revealed buttons).
- **Forms:** shadcn `Form` (react-hook-form + Zod) inside `Sheet`:
  - `< md`: full-width sheet (`SheetContent className="w-full sm:max-w-md inset-y-0 right-0"`), submit bar pinned to bottom, safe-area padded.
  - Nested lists (achievements, challenges…) = repeater fields with add/remove, large tap targets.
  - Destructive actions: confirm `AlertDialog`, never a bare button.
- **Feedback:** `sonner` toasts (bottom on mobile, bottom-right desktop); loading = skeleton rows in tables, `useFormStatus` on submits.
- **Singletons** (Profile): plain edit form page, no list, no "new".
- **Rebuild once, reuse everywhere:** the DataTable + SheetForm pattern (built for Profile/Experience in Phase 4) is the generic CRUD scaffold for Technologies/Skills/Education/Certifications — do not hand-roll per entity.

---

## 6. Motion & accessibility

- Motion durations ≤ 200ms for UI transitions; blob morph is the only long animation.
- Global `prefers-reduced-motion` guard: morphs off, dividers static (they already are), sheet animations become instant-enough (150ms fade).
- `focus-visible` ring token on all interactive elements — visible on brand and dark backgrounds.
- Landmarks: `header/nav/main/footer`; skip-link first focusable; `aria-live="polite"` regions announce **only appended** text (chat streaming — never re-announce the whole message).
- Contrast ≥ 4.5:1 body text both themes; brand color validated for text-on-white before finalizing in P0.T7.
- Chat, dialogs, sheets: full keyboard operability, focus trapped while open, returned to trigger on close.
