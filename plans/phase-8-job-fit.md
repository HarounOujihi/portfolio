# Phase 8 — Job-Fit Analyzer

**Goal:** the flagship feature: paste a JD → scored, evidence-linked gap analysis, persisted,
shareable via unguessable permalink. Structure per §6.2, pipeline per §6.1 `Output` API.
**Exit criteria (§13):** a JD produces a scored result that separates strong/partial/gaps and
never invents experience to close them.

**Prerequisites:** Phase 7 (eval gate green).

---

## Tasks

- [ ] **P8.T1 — Job-fit schema contract.**
  `lib/ai/schemas.ts`: `jobMatchResultSchema` per §6.2 (`overallScore` 0–100, strongMatches with
  **required `sourceSlug`**, partialMatches, gaps, suggestedInterviewTopics).
  **Done:** schema exported + unit-tested against the P0 JOB_FIT fixture expectations.

- [ ] **P8.T2 — Pipeline endpoint.**
  `POST /api/job-fit`: Zod caps (JD ≤ 10k chars — §8.3), tighter rate limits (session 5/10min, IP 10/10min),
  retrieve evidence (`PROJECT` + `EXPERIENCE` sourceTypes + top knowledge chunks),
  `buildJobFitPrompt` with untrusted-input framing + "never invent experience to close a gap",
  `generateText` + `Output.object({ schema })`, persist `JobMatchAnalysis` (`shareSlug = nanoid(12)`, D-P1-5).
  **Evidence enforcement in code, not prompts:** every `strongMatches[].sourceSlug` must exist in the retrieved set —
  otherwise drop/remap the item before persisting.
  **Done:** happy path: JD → persisted analysis with valid slugs only (unit test plants an invalid slug and asserts removal); rate limit trips correctly.

- [ ] **P8.T3 — Shareable page (privacy-hard).**
  `/job-match/[slug]`: renders score + strong/partial/gaps + suggested topics + evidence links.
  **No `jobDescriptionRaw` anywhere in the DOM/API response** (§9 confidentiality + plan-review fix).
  `robots: noindex`; unknown slug → 404.
  **Done:** `curl` the page: zero JD substrings present; `noindex` meta confirmed; 404 path works.

- [ ] **P8.T4 — Analyzer UX.**
  `/assistant` job-fit entry + `/job-match` input page: large textarea, char counter with cap message,
  honest progress state ("analyzing against N evidence pieces"), result cards with the curve language
  (score dial/badge, match/gap cards), share button (Web Share API on mobile → clipboard fallback).
  **Done:** full flow completed on a 360px phone; result page matrix pass.

- [ ] **P8.T5 — Assistant JOB_MATCH mode.**
  Chat mode from P5.T5 goes live: paste a JD in chat → runs the same pipeline → replies with summary + permalink.
  **Done:** in-chat run produces a working `/job-match/[slug]` link; conversation mode recorded correctly (D-P1-4).

- [ ] **P8.T6 — Anti-inflation verification.**
  P0.T5 JOB_FIT fixtures (obvious-gap JDs) through the real pipeline: scores must be non-inflated.
  **Done:** all JOB_FIT evals pass; obvious-gap JD scores < your recorded threshold (write it): ____/100.

- [ ] **P8.T7 — Admin job-match history.**
  `/admin/job-matches`: run list (score, date, model), score distribution, most common gap requirements aggregated.
  **Done:** aggregates match a manual DB query; no raw JDs displayed in the list either. **← Phase exit criterion (§13)**
