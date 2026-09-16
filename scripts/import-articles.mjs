// Content pipeline: content/articles/*.md → Article table (source of truth = repo).
// Runs in the build after migrations; upserts by slug, never deletes.
// Sanity guard: skips gracefully when no article files exist.
import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import pg from "pg";

const FRONTMATTER = /^---\ntitle: "(.+)"\nexcerpt: "(.+)"\ntype: (\w+)\n---\n\n([\s\S]*)$/;

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const dir = "content/articles";
const slugs = readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));

for (const slug of slugs) {
  const raw = readFileSync(`${dir}/${slug}.md`, "utf8");
  const m = raw.match(FRONTMATTER);
  if (!m) throw new Error(`bad frontmatter in ${slug}`);
  const [, title, excerpt, type, content] = m;
  await client.query(
    `INSERT INTO "Article" (id, slug, title, excerpt, content, "articleType", published, "publishedAt", "createdAt", "updatedAt")
     VALUES (md5(random()::text || clock_timestamp()::text), $1, $2, $3, $4, $5::"ArticleType", true, now(), now(), now())
     ON CONFLICT (slug) DO UPDATE
       SET title = $2, excerpt = $3, content = $4, "articleType" = $5::"ArticleType", published = true, "updatedAt" = now()`,
    [slug, title, excerpt, content, type],
  );
  console.log(`article: ${slug}`);
}

await client.end();
