import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { MetricStat } from "@/components/motion/count-up";
import { AdrCard, RevealList } from "@/components/engineering/eng-motion";
import { Reveal } from "@/components/reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Engineering",
  description:
    "How this portfolio is built — live measurements, architecture decision records, and honest trade-offs from a working AI-native site.",
};

const DECISIONS: { title: string; choice: string; because: string }[] = [
  {
    title: "ADR-1 · Assistant grounding",
    choice: "Tool-calling over the live database, not RAG",
    because:
      "Every answer is assembled from four typed tools querying Postgres per message — facts can never be staler than the admin CMS, and each answer cites its source rows. Vector retrieval (the chunks table is already live with a pgvector column) comes next, for prose depth across case studies.",
  },
  {
    title: "ADR-2 · Vector search",
    choice: "pgvector + Prisma Unsupported, HNSW guarded in the build",
    because:
      "One Postgres, no second vendor. Prisma can't express vector columns, so embedding access is raw SQL — and the known failure mode (migrations silently dropping the HNSW index) is guarded by an assertion script that runs on every deploy and re-creates the index if missing.",
  },
  {
    title: "ADR-3 · Auth",
    choice: "Better Auth + middleware fast-path + server-side re-check",
    because:
      "The edge middleware only redirects — it never authorizes. Every admin query and action re-validates the session (defense in depth, post CVE-2025-29927). Admin allow-list is enforced in the auth callback by email.",
  },
  {
    title: "ADR-4 · Rate limiting",
    choice: "Two layers: per-IP and per-session",
    because:
      "Session IDs are client-supplied, so limiting sessions alone is rotation-friendly. The public assistant applies both an IP-level limiter (anti-rotation) and a session-level limiter (anti-runaway) before any model call.",
  },
  {
    title: "ADR-5 · Privacy",
    choice: "Salted SHA-256 visitor hashes — raw IPs are never stored",
    because:
      "Analytics and assistant sessions hash (salt + sessionId) into opaque 32-hex IDs. The salt lives in server env only, so stored identifiers can't be reversed from the database.",
  },
  {
    title: "ADR-6 · Model routing",
    choice: "Task-sized GLM models with deterministic fallbacks",
    because:
      "The job-match analyzer runs glm-4.5-air (fast, non-thinking) for structured reports, the chat assistant uses the flagship model with tool-calling, and every structured call has a plain JSON-text fallback path — cost scales with task weight, not with hype.",
  },
  {
    title: "ADR-7 · AI assistant in production (Studio ERP)",
    choice: "Router-first intent classification over free-form chat",
    because:
      "The Studio ERP assistant runs one forced model call to classify every question — how-to, data, mixed, greeting, out-of-scope — then takes a purpose-built path: hybrid semantic search (local ONNX embeddings + pgvector, lexical boost, silent fallback) across 69 embedded help guides, or one of 16 tenant-scoped read-only data tools with explicit metric bases. Answers arrive in the asker's language — French, Arabic including Tunisian dialect, or English — and three separate eval suites (router, retrieval, dispatcher) gate every change.",
  },
];

export default async function EngineeringPage() {
  const [articles, answers, conversations, publishedProjects, latestEval] = await Promise.all([
    prisma.article.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } }),
    prisma.message.count({ where: { role: "ASSISTANT" } }),
    prisma.conversation.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.aIEvaluationRunResult.findFirst({ orderBy: { createdAt: "desc" }, select: { runId: true } }),
  ]);

  let evalSummary: { passed: number; judged: number; cases: number } | null = null;
  if (latestEval) {
    const rows = await prisma.aIEvaluationRunResult.findMany({
      where: { runId: latestEval.runId },
      select: { passed: true },
    });
    const judged = rows.filter((r) => r.passed !== null);
    evalSummary = {
      passed: judged.filter((r) => r.passed).length,
      judged: judged.length,
      cases: rows.length,
    };
  }

  const metrics = [
    { value: answers, label: "assistant answers served", numeric: true },
    { value: conversations, label: "conversations", numeric: true },
    { value: 0, label: `${publishedProjects} + ${articles.length} published projects + articles`, numeric: false },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-h2 font-bold tracking-tight">Engineering</h1>
      <p className="mt-2 text-lead text-neutral-400">
        How this site is built — measured, not claimed. Every number below is read live from the
        running deployment; every decision is one actually made.
      </p>

      {/* live metrics */}
      <section aria-label="Live metrics" className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {metrics.map((m) =>
          m.numeric ? (
            <MetricStat key={m.label} value={m.value as number} label={m.label} />
          ) : (
            <div key={m.label} className="rounded-(--radius-card) border border-white/15 p-4">
              <p className="text-2xl font-bold tracking-tight">{publishedProjects} + {articles.length}</p>
              <p className="mt-1 text-xs leading-snug text-neutral-400">published projects + articles</p>
            </div>
          ),
        )}
      </section>

      {/* eval discipline */}
      {evalSummary && (
        <Reveal className="mt-12">
          <section aria-labelledby="eval-heading" className="rounded-(--radius-card) border border-[var(--brand)]/30 bg-[var(--brand)]/[0.06] p-6">
            <h2 id="eval-heading" className="font-semibold tracking-tight">Eval discipline, in public</h2>
            <p className="mt-2 text-sm text-neutral-400">
              The assistant is graded against a fixture suite of {evalSummary.cases} grounded questions — factual accuracy,
              source attribution, hallucination traps, prompt-injection resistance, language handling and job-fit framing.
              Latest run:
            </p>
            <p className="mt-4 text-3xl font-bold tracking-tight">
              {evalSummary.passed}/{evalSummary.judged}
              <span className="ml-2 text-base font-medium text-neutral-400">cases passed</span>
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Graded by a second model pass plus deterministic source checks. Every prompt change runs the suite before shipping.
            </p>
          </section>
        </Reveal>
      )}

      {/* decision records */}
      <h2 className="mt-14 text-xl font-bold tracking-tight">Decision records</h2>
      <p className="mt-2 text-sm text-neutral-400">
        The trade-offs behind this deployment — including what I deliberately did not build yet.
      </p>
      <RevealList className="mt-6 space-y-3">
        {DECISIONS.map((d) => (
          <AdrCard key={d.title} index={d.title} choice={d.choice} because={d.because} />
        ))}
      </RevealList>

      {/* writing */}
      <h2 className="mt-14 text-xl font-bold tracking-tight">Writing</h2>
      <p className="mt-2 text-sm text-neutral-400">Deep dives from real systems.</p>
      {articles.length === 0 ? (
        <div className="mt-6 rounded-(--radius-organic) border border-dashed border-white/20 p-10 text-center">
          <p className="font-medium">First articles are in drafting.</p>
          <p className="mt-2 text-sm text-neutral-400">
            Multi-tenant ERP data modeling and multi-model LLM routing are on the way.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {articles.map((article, i) => (
            <li
              key={article.id}
              data-reveal
              style={{ transitionDelay: `${Math.min(i * 60, 240)}ms` }}
              className="rounded-(--radius-card) border border-white/15 p-5 transition-colors hover:border-white/30"
            >
              <h3 className="font-semibold">
                <a href={`/articles/${article.slug}`} className="hover:underline">
                  {article.title}
                </a>
              </h3>
              <p className="mt-1.5 text-sm text-neutral-400">{article.excerpt}</p>
              <p className="mt-2 text-xs text-neutral-400">
                {article.publishedAt
                  ? article.publishedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                  : "Draft"}{" "}
                · {Math.max(2, Math.round(article.content.split(/\s+/).length / 200))} min read
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* roadmap */}
      <h2 className="mt-14 text-xl font-bold tracking-tight">On the roadmap</h2>
      <ul className="mt-6 space-y-3 text-sm text-neutral-300">
        <li data-reveal className="rounded-(--radius-card) border border-white/15 p-5">
          <p className="font-semibold text-neutral-100">RAG over case-study depth</p>
          <p className="mt-1.5 text-neutral-400">
            The <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">KnowledgeChunk</code> table
            with a 1024-dim pgvector column is already live. Next: chunk + embed every case study so the
            assistant quotes full architecture prose, not just structured rows.
          </p>
        </li>
        <li data-reveal className="rounded-(--radius-card) border border-white/15 p-5">
          <p className="font-semibold text-neutral-100">Eval-gated deploys</p>
          <p className="mt-1.5 text-neutral-400">
            The 24-case suite already grades every change (latest run shown above — run manually today).
            Next: run it automatically on every deploy and block assistant changes on a red run.
          </p>
        </li>
      </ul>
    </main>
  );
}
