// Index-loss guard — plan §7.1 gotcha + P1.T9.
import "dotenv/config";
// Prisma's diffing does not know the hand-written HNSW (and later GIN) indexes;
// a later migrate that touches KnowledgeChunk can silently drop them.
// Idempotent: re-creates if missing. Wired into `db:migrate` / `db:migrate:deploy`.
// Node 20.10+ has fetch/global This script uses pg directly.
import pg from "pg";

const INDEXES = [
  {
    name: "KnowledgeChunk_embedding_hnsw_idx",
    ddl: `CREATE INDEX IF NOT EXISTS "KnowledgeChunk_embedding_hnsw_idx"
          ON "KnowledgeChunk" USING hnsw ("embedding" vector_cosine_ops);`,
  },
];

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();

  const table = await client.query(
    `SELECT to_regclass('"KnowledgeChunk"') AS reg`
  );
  if (!table.rows[0].reg) {
    console.log("[assert-vector-index] KnowledgeChunk table not found — nothing to assert (fresh DB?).");
    process.exit(0);
  }

  for (const { name, ddl } of INDEXES) {
    await client.query(ddl);
    const check = await client.query(
      `SELECT 1 FROM pg_indexes WHERE indexname = $1`,
      [name]
    );
    if (check.rowCount === 1) {
      console.log(`[assert-vector-index] OK: ${name} present`);
    } else {
      console.error(`[assert-vector-index] FAILED: ${name} missing after CREATE — investigate.`);
      process.exit(1);
    }
  }
} catch (err) {
  console.error("[assert-vector-index] error:", err.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
