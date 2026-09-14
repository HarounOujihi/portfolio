# Phase 6 — RAG + Knowledge Base

**Goal:** KnowledgeDocument/KnowledgeChunk pipeline, Voyage embeddings, hybrid retrieval
(full-text + vector + RRF), re-index-on-publish, admin knowledge view.
**Exit criteria (§13):** assistant retrieves across projects/experience/articles with real sources;
you can explain hybrid retrieval, HNSW, and chunk sizing unprompted.

**Prerequisites:** Phase 5. **Read first:** main plan §6.3, §7.1.

---

## Tasks

### Decisions (record, don't relitigate)

- [ ] **P6.T1 — Retrieval parameters.**
  **D-P6-1:** chunk target ~400 tokens, ~60 overlap, sentence-aware split.
  **D-P6-2:** embeddings `voyage-3-large` with **explicit `outputDimension: 1024`** in `embedMany` (must match `vector(1024)` column).
  **D-P6-3:** text-search config `english` (note: lossy for Arabic/French content — acceptable; revisit if content language changes).
  **D-P6-4:** RRF k=60, fuse full-text top-20 + vector top-20 → top 8 chunks.
  **Done:** decisions recorded here with any deviations.

### Query layer (smoke-test the risky part first)

- [ ] **P6.T2 — `$queryRaw` array-binding smoke test (do this FIRST).**
  Test `vectorSearch` (§7.1) passing `sourceTypes` as an array parameter through a tagged template.
  If the driver/adapter rejects array params → switch to `Prisma.join()` on a `::text` comparison, and record that in D-P6-4.
  **Done:** a Vitest test against the real DB passes with the final pattern documented.

- [ ] **P6.T3 — Full-text query + GIN index.**
  Query: `websearch_to_tsquery('english', q)` ranked by `ts_rank` (config must match D-P6-3).
  Hand-written migration: GIN index on `to_tsvector('english', "content")`; add the same `CREATE INDEX IF NOT EXISTS`
  to `scripts/assert-vector-index.mjs` (same HNSW-loss discipline as P1.T9).
  **Done:** `EXPLAIN` shows the GIN index used; assert script re-adds both indexes after a drop.

- [ ] **P6.T4 — RRF fusion (pure function).**
  `fuse(rankA, rankB, k=60): Chunk[]` in `lib/knowledge/fuse.ts` — unit-testable, no DB.
  **Done:** tests cover: overlap, disjoint lists, ties, empty input; deterministic output.

### Pipeline

- [ ] **P6.T5 — Document builders.**
  Per entity → markdown-ish `content`: project (case study fields), article, experience (+achievements), profile, skill set.
  Upsert `KnowledgeDocument` by `(sourceType, sourceId)` (D-P1-2 unique key); compute SHA-256 `contentHash`;
  **skip chunk+embed entirely when hash unchanged** (§7 note).
  **Done:** unit tests per builder; re-saving unchanged project = zero embed calls (spy assertion).

- [ ] **P6.T6 — Chunker.**
  `lib/knowledge/chunk.ts`: sentence-aware split, target/overlap per D-P6-1, token estimate fn, returns `{ chunkIndex, content, tokenCount }`.
  **Done:** tests: long text splits as expected; unicode/emoji safe; no chunk exceeds target by > 15%.

- [ ] **P6.T7 — Embed + write (async, off the request path).**
  `lib/knowledge/write.ts`: `embedMany` (batched) → upsert chunk rows → raw-SQL embedding write (`pgvector` `toSql`, §7.1) →
  delete stale chunks not in the new set. Triggered via `after()` from `next/server` so admin saves never block on Voyage (plan-review fix).
  **Done:** publishing a long article re-indexes in background; save returns immediately; chunk rows + embeddings present; stale chunks removed.

- [ ] **P6.T8 — Delete→re-index hook (completes D-P1-2).**
  Admin delete actions for project/article/experience now delete the entity's `KnowledgeDocument` (chunks cascade).
  Replaces the P4.T8 placeholder.
  **Done:** deleting a published project removes its chunks; a knowledge-base query no longer returns it.

### Retrieval tool

- [ ] **P6.T9 — `retrieveKnowledge` tool.**
  Hybrid search per §6.3: sourceType pre-filter by mode → full-text + vector → RRF → top 8.
  Returns chunks + document titles + source links; system prompt injects them under the untrusted-data framing.
  **Done:** an e2e question answered from article **prose** (not structured tables) with a correct citation; injection fixture P0.T5 (chunk variant) still refused.

- [ ] **P6.T10 — Backfill + re-index-all.**
  Script + `/admin/knowledge` "Re-index everything" button (§10). Run on all real content.
  **Done:** all published content indexed; per-document chunk counts sane; button works.

- [ ] **P6.T11 — Admin knowledge view.**
  `/admin/knowledge`: document list (sourceType, source title, chunk count, last indexed, hash date, published) +
  per-document re-index. Mobile: card list (P4.T5 pattern).
  **Done:** view matches DB state; re-index per doc works; matrix pass.

- [ ] **P6.T12 — Retrieval spot-checks.**
  Script: 8 fixed queries → expected document must appear in top 3 (these graduate into Phase 7's suite).
  Tune chunking/parameters (D-P6-1/4) until passing.
  **Done:** ≥ 7/8 pass; misses documented with cause. **← Phase exit criterion (§13)**
