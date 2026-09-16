import "dotenv/config";
import pg from "pg";
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const MARKER = "### The AI assistant, in production";

// ---- longDescription: append architecture block once ----
const { rows: proj } = await client.query(`SELECT id, "longDescription" FROM "Project" WHERE slug = 'soldx-studio'`);
const p = proj[0];
if (!p["longDescription"].includes(MARKER)) {
  const block = `

${MARKER}

The Studio assistant is a five-branch router, not a chatbot. One forced model call classifies every question — USAGE (how do I…?), DATA (how much/how many?), MIXED, GREETING, OUT_OF_SCOPE — in the asker's language: French, Arabic including Tunisian dialect, or English.

\`\`\`
Question (any language)
│
├─ USAGE ──────── hybrid search over 69 embedded help guides
│                 local ONNX embeddings + pgvector cosine,
│                 lexical boost re-rank → answer + guide links
├─ DATA ───────── one of 16 tenant-scoped data tools
│                 (revenue, unpaid, client history, stock, trends…)
│                 Prisma aggregates → exact figures, basis stated
├─ MIXED ──────── data path (guide links planned)
├─ GREETING ───── canned welcome — no model call
└─ OUT OF SCOPE ─ canned refusal — opinions, tax, legal
\`\`\`

Retrieval degrades gracefully: if the vector path fails for any reason, a lexical in-memory index takes over silently. Proper nouns, phone numbers and order references pass through the pipeline character-for-character — lookups match on exact strings.

The guarantees are structural: calculations only ever see the asking establishment's data; the assistant is read-only by design; revenue states its basis (cash received vs invoiced); and a per-establishment feature flag gates the whole surface. Usage logs roll up into anonymized shapes and purge after 90 days.`;
  await client.query(`UPDATE "Project" SET "longDescription" = "longDescription" || $2, "updatedAt" = now() WHERE id = $1`, [p.id, block]);
  console.log("longDescription enriched");
} else console.log("longDescription already enriched");

// ---- solution: deepen the assistant solution description ----
const { rows: sol } = await client.query(
  `SELECT s.id, s.description FROM "ProjectSolution" s JOIN "Project" p ON p.id = s."projectId"
   WHERE p.slug = 'soldx-studio' AND s.title LIKE '%Natural-language%'`,
);
if (sol[0] && !sol[0].description.includes("five-branch router")) {
  const desc = `${sol[0].description}

The implementation is a five-branch router rather than a free-form chatbot: one forced model call classifies every question into USAGE, DATA, MIXED, GREETING or OUT_OF_SCOPE, in the asker's language (French, Arabic including Tunisian dialect, English). How-to questions search 69 embedded help guides with hybrid retrieval — local ONNX embeddings (e5-small, 384-d) over pgvector, lexical boost re-ranking, and a silent lexical fallback — answering in ~30 ms warm with guide links. Data questions execute one of 16 tenant-scoped read-only tools built on Prisma aggregates with explicit metric bases (cash received vs invoiced), so figures are exact and honest about their source. Routing, retrieval and dispatch are each gated by their own eval suite — router 22/22, retrieval 15/15, dispatcher 23/23 — and no change ships unless they stay green.`;
  await client.query(`UPDATE "ProjectSolution" SET description = $2 WHERE id = $1`, [sol[0].id, desc]);
  console.log("solution enriched");
} else console.log("solution already enriched");

await client.end();
