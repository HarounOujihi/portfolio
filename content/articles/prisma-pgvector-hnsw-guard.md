---
title: "The migration that silently dropped my vector index"
excerpt: "Prisma can't express pgvector's HNSW indexes — so a routine migration deleted one, and similarity search kept working. Slower, and correct. That's what made it dangerous."
type: ARCHITECTURE
---

This site runs an AI assistant that answers from a Postgres database, and its roadmap includes
vector search over my case studies. The schema carries a `vector(1024)` column with an HNSW
index. One day a routine migration dropped that index — and nothing failed. That sentence is
the whole story: the failure mode was *silently degraded performance*, not an error, and no
framework I use could have warned me.

## Prisma and pgvector: the Unsupported bargain

Prisma (through v7) cannot express Postgres `vector` columns. The documented workaround is to
declare the column as `Unsupported` and touch it through raw SQL:

```prisma
model KnowledgeChunk {
  id        String @id @default(cuid())
  content   String
  embedding Unsupported("vector(1024)")?

  @@index([content]) // regular indexes only — no vector index here
}
```

`Unsupported` means unsupported all the way down: the column is invisible to the query builder,
untyped in the client, and — the part the docs under-emphasize — **index declarations for it
don't exist either**. So the HNSW index lives outside the schema, created by hand:

```sql
CREATE INDEX knowledgechunk_embedding_hnsw_idx
  ON "KnowledgeChunk" USING hnsw ("embedding" vector_cosine_ops);
```

## What actually happened

Prisma migrations are diffs of the schema Prisma can see. An index it cannot see is, from the
diff's point of view, noise — and some migration paths (`migrate dev` regenerating from the
schema, table recreations during destructive changes) drop and rebuild the table. The hand-made
index went with it. No error, no warning, no failed test: cosine distance is a sequential scan
when the index is gone, and on a small table a sequential scan is *fine*. The query results were
identical. Only the latency curve was wrong, and only at scale.

A correctness bug announces itself. A performance bug waits for your data to grow.

## The guard: make the invariant a build step

If your tooling cannot represent a database feature, its invariant does not belong in the schema
file — it belongs in CI. This site now runs an assertion script on every deploy, wired into the
build after `migrate deploy`:

```js
// scripts/assert-vector-index.mjs (core)
const INDEXES = [{
  name: "knowledgechunk_embedding_hnsw_idx",
  ddl: `CREATE INDEX IF NOT EXISTS knowledgechunk_embedding_hnsw_idx
        ON "KnowledgeChunk" USING hnsw ("embedding" vector_cosine_ops);`,
}];
for (const idx of INDEXES) {
  const { rows } = await client.query(
    `SELECT 1 FROM pg_indexes WHERE indexname = $1`, [idx.name]);
  if (rows.length === 0) {
    console.error(`RE-CREATING missing index: ${idx.name}`);
    await client.query(idx.ddl);
  }
}
```

Idempotent by construction: verify, re-create if missing, exit non-zero if it cannot. The build
fails loudly rather than shipping a silent regression — and if the index *was* dropped by a
migration, the deploy both reports it and heals it.

## The general lesson

Every ORM has blind spots: expression indexes, partial indexes, extension types, triggers. The
fix is never "remember to re-run that SQL after migrating" — memory does not survive a teammate,
a month, or a 2 a.m. deploy. Promote each blind spot to an executable check:

1. **Enumerate** what your schema file cannot express (I keep the list at the top of the script).
2. **Assert** each one in the same pipeline that runs migrations.
3. **Heal or fail** — preferably heal, always loudly.

Schema-as-code is a great default. It is not a complete description of a database, and pretending
it is complete is exactly how the important part goes missing.
