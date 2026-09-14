-- Hand-written migration (plan §7.1, P1.T8) — Prisma cannot model the pgvector
-- `vector` type. The KnowledgeChunk.embedding column and its HNSW index live only
-- here; see scripts/assert-vector-index.mjs for the loss guard.

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "KnowledgeChunk"
  ADD COLUMN "embedding" vector(1024);

-- HNSW: fast approximate nearest-neighbor search, no training step (vs IVFFlat).
CREATE INDEX IF NOT EXISTS "KnowledgeChunk_embedding_hnsw_idx"
  ON "KnowledgeChunk"
  USING hnsw ("embedding" vector_cosine_ops);
