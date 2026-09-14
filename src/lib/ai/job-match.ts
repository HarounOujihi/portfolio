import "server-only";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { glmChat, type GlmToolDef } from "@/lib/ai/glm";

/**
 * Job-fit analysis engine (Phase 8): GLM evaluates a pasted job description
 * against the candidate corpus. Evidence-linked, honest about gaps, no
 * invented experience. Structured output via a forced report tool, with a
 * JSON-text fallback.
 */

const reportSchema = z.object({
  jobTitle: z.string().max(160).describe("Job title from the description, if identifiable"),
  score: z.number().int().min(0).max(100).describe("Overall fit score — honest, based only on the candidate data"),
  summary: z.string().max(1200).describe("3-5 sentence executive summary of the fit"),
  strongMatches: z
    .array(z.object({ area: z.string().max(160), evidence: z.string().max(400) }))
    .describe("Requirements the candidate clearly meets, each with concrete evidence from the candidate data"),
  partialMatches: z
    .array(z.object({ area: z.string().max(160), note: z.string().max(300) }))
    .describe("Requirements partially met — say what's related and what's missing"),
  gaps: z
    .array(z.object({ area: z.string().max(160), note: z.string().max(300) }))
    .describe("Requirements with no candidate evidence — never invent experience"),
});

export interface JobMatchResult {
  jobTitle: string;
  score: number;
  summary: string;
  strong: { area: string; evidence: string }[];
  partial: { area: string; note: string }[];
  gaps: { area: string; note: string }[];
  model: string;
  usage: { inputTokens: number; outputTokens: number };
}

async function buildCandidateCorpus(): Promise<string> {
  const [profile, projects, experiences, skills] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "profile" } }),
    prisma.project.findMany({
      where: { published: true },
      include: {
        technologies: { include: { technology: { select: { name: true } } } },
        outcomes: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.experience.findMany({
      where: { published: true },
      include: { achievements: true },
    }),
    prisma.skill.findMany(),
  ]);

  return JSON.stringify({
    profile: profile
      ? {
          name: profile.fullName,
          headline: profile.headline,
          yearsExperience: profile.yearsExperience,
          location: profile.location,
          availability: profile.availability,
          languages: ["Arabic (native)", "English", "French"],
        }
      : null,
    projects: projects.map((p) => ({
      name: p.name,
      industry: p.industry,
      role: p.role,
      period: p.isCurrent ? `${p.startDate.getFullYear()}–present` : `${p.startDate.getFullYear()}–${p.endDate?.getFullYear() ?? ""}`,
      description: p.longDescription.slice(0, 700),
      stack: p.technologies.map((pt) => pt.technology.name),
    })),
    experience: experiences.map((e) => ({
      company: e.companyName,
      role: e.jobTitle,
      period: `${e.startDate.getFullYear()}–${e.isCurrent ? "present" : e.endDate?.getFullYear() ?? ""}`,
      highlights: e.achievements.map((a) => a.title),
    })),
    skills: skills.map((s) => `${s.name} (${s.level}${s.years ? `, ${s.years}y` : ""})`),
  });
}

const SYSTEM = `You are a rigorous, honest senior technical recruiter evaluating candidate-job fit.
Analyze the JOB DESCRIPTION against the CANDIDATE DATA (JSON) provided.

Rules:
1. Evidence only: every strong match must cite concrete evidence from the candidate data (project or role names). Never invent experience, employers, metrics or dates.
2. Be honest about gaps: missing requirements go to gaps, not partial matches. Do not inflate the score.
3. Partial matches are for genuinely related experience — say what transfers and what's missing.
4. Score 0-100 reflects real coverage of the requirements, weighted by must-haves.
5. Use the report_match tool exactly once with the complete structured result.`;

const REPORT_TOOL: GlmToolDefLike = {
  name: "report_match",
  description: "Report the structured candidate-job fit analysis",
  input_schema: {
    type: "object",
    properties: {
      jobTitle: { type: "string", description: "Job title from the description" },
      score: { type: "integer", description: "Overall fit 0-100, honest" },
      summary: { type: "string", description: "3-5 sentence executive summary" },
      strongMatches: {
        type: "array",
        items: {
          type: "object",
          properties: { area: { type: "string" }, evidence: { type: "string" } },
          required: ["area", "evidence"],
        },
      },
      partialMatches: {
        type: "array",
        items: {
          type: "object",
          properties: { area: { type: "string" }, note: { type: "string" } },
          required: ["area", "note"],
        },
      },
      gaps: {
        type: "array",
        items: {
          type: "object",
          properties: { area: { type: "string" }, note: { type: "string" } },
          required: ["area", "note"],
        },
      },
    },
    required: ["jobTitle", "score", "summary", "strongMatches", "partialMatches", "gaps"],
  },
};

interface GlmToolDefLike {
  name: string;
  description: string;
  input_schema: { type: "object"; properties: Record<string, unknown>; required?: string[] };
}

export async function analyzeJobMatch(jdText: string): Promise<JobMatchResult> {
  const corpus = await buildCandidateCorpus();
  const user = `CANDIDATE DATA:\n${corpus}\n\nJOB DESCRIPTION:\n${jdText.slice(0, 8000)}`;

  // Attempt 1 — forced report tool
  try {
    const res = await glmChat(
      SYSTEM,
      [{ role: "user", content: user }],
      [REPORT_TOOL as GlmToolDefLike],
      { toolChoice: { type: "tool", name: "report_match" }, maxTokens: 4096 },
    );
    const call = res.toolCalls.find((c) => c.name === "report_match");
    if (call) {
      const parsed = reportSchema.safeParse(call.arguments);
      if (parsed.success) return toResult(parsed.data, res.usage);
    }
  } catch {
    // fall through to JSON-text fallback
  }

  // Attempt 2 — JSON in plain text
  const res = await glmChat(
    `${SYSTEM}\nRespond with ONLY a JSON object matching this shape (no prose, no code fences): {"jobTitle": string, "score": number, "summary": string, "strongMatches": [{"area": string, "evidence": string}], "partialMatches": [{"area": string, "note": string}], "gaps": [{"area": string, "note": string}]}`,
    [{ role: "user", content: user }],
  );
  const start = res.text.indexOf("{");
  const end = res.text.lastIndexOf("}");
  const json = JSON.parse(res.text.slice(start, end + 1)) as unknown;
  const parsed = reportSchema.safeParse(json);
  if (!parsed.success) throw new Error("Analysis produced an invalid report");
  return toResult(parsed.data, res.usage);
}

function toResult(
  data: { jobTitle: string; score: number; summary: string; strongMatches: { area: string; evidence: string }[]; partialMatches: { area: string; note: string }[]; gaps: { area: string; note: string }[] },
  usage: { inputTokens: number; outputTokens: number },
): JobMatchResult {
  return {
    jobTitle: data.jobTitle,
    score: data.score,
    summary: data.summary,
    strong: data.strongMatches,
    partial: data.partialMatches,
    gaps: data.gaps,
    model: process.env.GLM_MODEL ?? "glm-4.5-air",
    usage,
  };
}

interface GlmToolDefLike {
  name: string;
  description: string;
  input_schema: { type: "object"; properties: Record<string, unknown>; required?: string[] };
}
