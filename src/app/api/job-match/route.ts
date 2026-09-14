import { z } from "zod";
import { createHash } from "node:crypto";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { limiters } from "@/lib/rate-limit";
import { analyzeJobMatch } from "@/lib/ai/job-match";

export const maxDuration = 300;

const bodySchema = z.object({
  jd: z.string().min(80).max(8000),
  sessionId: z.string().min(8).max(64).optional(),
});

export async function POST(req: Request) {
  // Expensive GLM call — tight limit (plan §8: 3/run per IP per 10 min)
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  if (!(await limiters.jobFitIp.limit(ip)).success) {
    return Response.json(
      { error: "Too many analyses from this network — try again in 10 minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }
  const parsed = z.object({ jd: z.string().min(80).max(8000), sessionId: z.string().max(64).optional() }).safeParse(body);
  if (!parsed.success) return Response.json({ error: "Job description must be 80–8000 characters." }, { status: 400 });

  const jd = parsed.data.jd;
  const sessionId = parsed.data.sessionId ?? "anonymous";

  let analysis: Awaited<ReturnType<typeof analyzeJobMatch>>;
  try {
    analysis = await analyzeJobMatch(jd);
  } catch (e) {
    console.error("[job-match] analysis failed:", e instanceof Error ? e.message : e);
    return Response.json({ error: "Analysis failed — please try again." }, { status: 500 });
  }

  const shareSlug = randomBytes(9).toString("base64url").replace(/[-_]/g, "a").slice(0, 10);

  const row = await prisma.jobMatchAnalysis.create({
    data: {
      shareSlug,
      jobDescriptionRaw: jd,
      extractedRequirements: { jobTitle: analysis.jobTitle },
      overallScore: analysis.score,
      summary: analysis.summary,
      strongMatches: analysis.strong,
      partialMatches: analysis.partial,
      gaps: analysis.gaps,
      model: analysis.model,
    },
  });

  await prisma.analyticsEvent
    .create({
      data: {
        sessionId: createHash("sha256").update(sessionId).digest("hex").slice(0, 32),
        eventType: "JOB_MATCH_RUN",
        entityId: shareSlug,
      },
    })
    .catch(() => {});

  return Response.json({ slug: row.shareSlug, score: row.overallScore });
}
