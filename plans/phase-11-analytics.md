# Phase 11 — Analytics + Retention

**Goal:** events pipeline, admin dashboards (views, CV downloads, AI usage, job-fit distribution),
retention cron. Privacy-preserving by design (§9).
**Exit criteria (§13):** a small, useful admin analytics view — not a BI product.

**Prerequisites:** Phases 5–8 (events to count exist).

---

## Tasks

- [x] **P11.T1 — Events endpoint.**
  `POST /api/events`: Zod (`eventType` from the `AnalyticsEventType` enum, optional `entityType`/`entityId`, metadata allow-list),
  rate-limited per IP (e.g. 120/10min — junk floods will come), no PII in payloads.
  **Done:** unit tests: valid event stored, unknown type rejected, flood limited.

- [x] **P11.T2 — Client tracking hook.**
  `useTrackEvent()` → `navigator.sendBeacon` with fetch fallback. Instrument:
  project view, article view, CV download, AI open/question (from Phase 5 UI), job-match run (Phase 8),
  contact submit, GitHub/LinkedIn outbound clicks.
  **Done:** each listed event verified landing with correct `entityType/entityId` (DB check per event).

- [x] **P11.T3 — Admin analytics view.**
  `/admin/analytics`: cards (views, CV downloads, AI usage, job-fit runs),
  popular questions as **aggregated keywords only** (never raw user text in the dashboard — transcripts stay in the read-only log),
  latency/cost trend from `Message` rows, job-fit score distribution.
  **Done:** every number cross-checked against a manual SQL query; mobile matrix pass.

- [ ] **P11.T4 — Retention cron (completes §9).** *(still open — Phase 11 cron step)*
  Vercel Cron (daily): purge `Conversation`/`Message` older than 90 days (except rows flagged as eval fixtures),
  `AnalyticsEvent` older than 180 days (**D-P11-1**), keep `JobMatchAnalysis` (it powers permalinks — documented).
  Idempotent batched deletes, uses the P1.T6 `lastMessageAt` index.
  **Done:** cron config deployed; a test run purges seeded old rows and nothing else; run logged.

- [ ] **P11.T5 — Privacy note live.**
  One-liner near assistant + job-fit: "Conversations aren't tied to your identity and are deleted after 90 days" (§9).
  **Done:** visible on both surfaces; wording matches actual retention values. **← Phase exit criterion (§13)**
