import { randomUUID } from "node:crypto";
import { glmChat, isGlmConfigured } from "@/lib/ai/glm";
import { runAssistant, type AssistantMode } from "@/lib/ai/assistant-core";
import { prisma } from "@/lib/db";
import { FIXTURES, type EvalFixture } from "@evals/fixtures";

/**
 * Phase 7 eval runner. Runs fixtures through the SAME assistant core as the
 * public route, grades them (deterministic source checks + model judge), and
 * persists results grouped by runId.
 *
 * Designed for Vercel function limits: runBatch() processes ONE batch per call
 * (≈6 cases, concurrency 6) and returns cursor state; the driver script loops
 * batches until done. Consecutive batches MUST reuse the same runId.
 */

const BATCH_SIZE = 4;
const JUDGE_MODEL = process.env.GLM_MODEL ?? "glm-4.5-air";

export interface EvalCaseResult {
  name: string;
  category: string;
  passed: boolean | null;
  reason: string;
}

type FixtureRow = {
  id: string;
  name: string;
  category: string;
  input: string;
  expectedBehavior: string;
  expectedSources: unknown;
};

export async function upsertCases(): Promise<number> {
  for (const f of FIXTURES) {
    await prisma.aIEvaluationCase.upsert({
      where: { name: f.name },
      update: {
        category: f.category,
        input: f.query,
        expectedBehavior: f.expectedBehavior,
        expectedSources: f.expectedSources ?? undefined,
        active: true,
      },
      create: {
        name: f.name,
        category: f.category,
        input: f.query,
        expectedBehavior: f.expectedBehavior,
        expectedSources: (f.expectedSources ?? undefined) as never,
        active: true,
      },
    });
  }
  // fixtures removed from the file become inactive rather than deleted (history intact)
  await prisma.aIEvaluationCase.updateMany({
    where: { name: { notIn: FIXTURES.map((f) => f.name) }, active: true },
    data: { active: false },
  });
  return FIXTURES.length;
}

async function runCase(
  runId: string,
  fixtureRow: FixtureRow,
  fixture: EvalFixture | undefined,
): Promise<EvalCaseResult> {
  const startedAt = Date.now();
  let answer = "";
  let sources: string[] = [];
  let totalTokens = 0;
  let deterministicPass = true;

  try {
    let core = await runAssistant({
      mode: (fixture?.mode ?? "GENERAL") as AssistantMode,
      message: fixtureRow.input,
    });
    // transient GLM failures (429/stream) — up to two retries before marking the case failed
    for (let attempt = 0; !core.answer && core.sources.length === 0 && attempt < 2; attempt++) {
      await new Promise((r) => setTimeout(r, 3000));
      core = await runAssistant({
        mode: (fixture?.mode ?? "GENERAL") as AssistantMode,
        message: fixtureRow.input,
      });
    }
    answer = core.answer;
    sources = core.sources;
    totalTokens = core.usage.inputTokens + core.usage.outputTokens;

    // deterministic source checks — every expected source must prefix-match a returned one
    const expected = (fixtureRow.expectedSources as string[] | null) ?? fixture?.expectedSources ?? [];
    deterministicPass = expected.every((exp) => sources.some((src) => src.startsWith(exp)));
  } catch {
    await persist(runId, fixtureRow, null, null, 0, Date.now() - startedAt, 0);
    return { name: fixtureRow.name, category: fixtureRow.category, passed: null, reason: "assistant call failed" };
  }

  // forbidden phrases (deterministic, case-insensitive)
  const forbidden = fixture?.mustNotInclude ?? [];
  const forbiddenHit = forbidden.find((phrase) => answer.toLowerCase().includes(phrase.toLowerCase()));
  if (forbiddenHit) deterministicPass = false;

  // model judge
  let judgePass: boolean | null = null;
  let reason = forbiddenHit ? `forbidden phrase: "${forbiddenHit}"` : "";
  try {
    const judge = await glmChat(
      "You are a strict evaluator grading an AI assistant's answer against its expected behavior. Reply with ONLY a JSON object: {\"pass\": true|false, \"reason\": \"one short sentence\"}. Fail the answer if it invents facts, breaks first-person voice, answers in the wrong language, or misses the core of the expected behavior.",
      [
        {
          role: "user",
          content: `QUESTION: ${fixtureRow.input}\n\nEXPECTED BEHAVIOR: ${fixtureRow.expectedBehavior}\n\nASSISTANT ANSWER: ${answer.slice(0, 4000)}\n\nGrading JSON:`,
        },
      ],
      undefined,
      { maxTokens: 2000, temperature: 0 },
    );
    const m = judge.text.replace(/```(?:json)?/g, "").match(/\{[\s\S]*\}/);
    if (m) {
      const parsed = JSON.parse(m[0]) as { pass?: boolean; reason?: string };
      judgePass = typeof parsed.pass === "boolean" ? parsed.pass : null;
      reason = parsed.reason?.slice(0, 300) ?? reason;
    } else {
      judgePass = null;
      reason = "judge returned unparseable output";
    }
  } catch {
    judgePass = null;
    reason = reason || "judge call failed";
  }

  const passed = judgePass === null ? (deterministicPass ? null : false) : deterministicPass && judgePass;
  await persist(runId, fixtureRow, answer, passed, Date.now() - startedAt, totalTokens, deterministicPass && judgePass !== false ? 1 : 0);

  return { name: fixtureRow.name, category: fixtureRow.category, passed, reason };
}

async function persist(
  runId: string,
  fixtureRow: FixtureRow,
  actualResponse: string | null,
  passed: boolean | null,
  latencyMs: number,
  totalTokens: number,
  score: number,
) {
  await prisma.aIEvaluationRunResult.upsert({
    where: { runId_caseId: { runId, caseId: fixtureRow.id } },
    update: {
      actualResponse: actualResponse?.slice(0, 4000) ?? null,
      passed,
      score,
      model: JUDGE_MODEL,
      latencyMs,
      totalTokens,
      createdAt: new Date(),
    },
    create: {
      runId,
      caseId: fixtureRow.id,
      actualResponse: actualResponse?.slice(0, 4000) ?? null,
      passed,
      score,
      model: JUDGE_MODEL,
      latencyMs,
      totalTokens,
    },
  });
}

/** Runs one batch of pending cases for the given runId. Returns cursor state. */
export async function runBatch(runId: string, batchSize = BATCH_SIZE) {
  if (!isGlmConfigured()) throw new Error("GLM not configured");

  await upsertCases();
  const active = (await prisma.aIEvaluationCase.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  })) as FixtureRow[];

  const done = await prisma.aIEvaluationRunResult.findMany({
    where: { runId },
    select: { caseId: true },
  });
  const doneIds = new Set(done.map((d) => d.caseId));
  const pending = active.filter((c) => !doneIds.has(c.id)).slice(0, batchSize);

  const byName = new Map(FIXTURES.map((f) => [f.name, f]));
  const results: EvalCaseResult[] = [];
  // batches are ≤6 cases — one Promise.all per chunk is the concurrency control
  for (let i = 0; i < pending.length; i += 2) {
    const chunk = pending.slice(i, i + 2);
    const chunkResults = await Promise.all(chunk.map((row) => runCase(runId, row, byName.get(row.name))));
    results.push(...chunkResults);
  }

  const remaining = active.length - doneIds.size - pending.length;
  return { runId, ranNow: results.length, remaining, results };
}

/** Latest run summary — safe to expose publicly (no responses included). */
export async function latestRunSummary() {
  const latest = await prisma.aIEvaluationRunResult.findFirst({
    orderBy: { createdAt: "desc" },
    select: { runId: true, createdAt: true },
  });
  if (!latest) return null;

  const results = await prisma.aIEvaluationRunResult.findMany({
    where: { runId: latest.runId },
    select: { passed: true, case: { select: { category: true } } },
  });

  const judged = results.filter((r) => r.passed !== null);
  const passed = judged.filter((r) => r.passed).length;
  const byCategory: Record<string, { passed: number; total: number }> = {};
  for (const r of judged) {
    const cat = (byCategory[r.case.category] ??= { passed: 0, total: 0 });
    cat.total++;
    if (r.passed) cat.passed++;
  }

  return {
    gradedAt: latest.createdAt,
    totalCases: results.length,
    judgedCases: judged.length,
    passed,
    failed: judged.length - passed,
    inconclusive: results.length - judged.length,
    passRate: judged.length ? Math.round((passed / judged.length) * 100) : null,
    byCategory,
  };
}
