import { z } from "zod";
import { prisma } from "@/lib/db";

/**
 * The four Phase-5 tools (P5.T3) — every result carries a `sources` array
 * (the assistant cites these). Published-only, tenant-free (public content).
 * Executed against the portfolio's own database — the assistant reads figures,
 * it never invents them.
 */

interface ToolResult {
  results: unknown[];
  sources: string[];
}

const searchProjectsSchema = z.object({
  query: z.string().describe("Free-text search terms (project name, description, industry)"),
});

async function searchProjectsExec(args: z.infer<typeof searchProjectsSchema>): Promise<ToolResult> {
  const projects = await prisma.project.findMany({
    where: {
      published: true,
      OR: [
        { name: { contains: args.query, mode: "insensitive" } },
        { shortDescription: { contains: args.query, mode: "insensitive" } },
        { longDescription: { contains: args.query, mode: "insensitive" } },
      ],
    },
    select: {
      name: true,
      slug: true,
      industry: true,
      shortDescription: true,
      technologies: { include: { technology: { select: { name: true } } } },
    },
    take: 5,
  });
  return {
    results: projects.map((p) => ({
      name: p.name,
      industry: p.industry,
      shortDescription: p.shortDescription,
      technologies: p.technologies.map((pt) => pt.technology.name),
    })),
    sources: projects.map((p) => `/projects/${p.slug}`),
  };
}

const getProjectSchema = z.object({
  slug: z.string().describe("Project slug, e.g. soldx-studio"),
});

async function getProjectExec(args: z.infer<typeof getProjectSchema>): Promise<ToolResult> {
  const p = await prisma.project.findFirst({
    where: { slug: args.slug, published: true },
    include: {
      technologies: { include: { technology: { select: { name: true } } } },
      challenges: { orderBy: { sortOrder: "asc" } },
      solutions: { orderBy: { sortOrder: "asc" } },
      outcomes: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!p) return { results: [], sources: [] };
  return {
    results: [
      {
        name: p.name,
        role: p.role,
        overview: p.longDescription,
        challenges: p.challenges.map((c) => c.title),
        solutions: p.solutions.map((s) => s.title),
        outcomes: p.outcomes.map((o) => `${o.title}${o.metric ? ` (${o.metric})` : ""}`),
        stack: p.technologies.map((pt) => pt.technology.name),
      },
    ],
    sources: [`/projects/${p.slug}`],
  };
}

const searchExperienceSchema = z.object({
  query: z.string().describe("Free-text search terms (company, role, achievement)"),
});

async function searchExperienceExec(args: z.infer<typeof searchExperienceSchema>): Promise<ToolResult> {
  const experiences = await prisma.experience.findMany({
    where: {
      published: true,
      OR: [
        { companyName: { contains: args.query, mode: "insensitive" } },
        { jobTitle: { contains: args.query, mode: "insensitive" } },
        { summary: { contains: args.query, mode: "insensitive" } },
        { description: { contains: args.query, mode: "insensitive" } },
      ],
    },
    include: { achievements: { orderBy: { sortOrder: "asc" } } },
    take: 5,
  });
  return {
    results: experiences.map((e) => ({
      company: e.companyName,
      role: e.jobTitle,
      period: e.isCurrent ? "present" : "ended",
      summary: e.summary,
      description: e.description,
      achievements: e.achievements.map((a) => `${a.title}: ${a.description}`),
    })),
    sources: ["/experience"],
  };
}

const searchSkillsSchema = z.object({
  query: z.string().describe("Free-text search terms"),
});

async function searchSkillsExec(args: z.infer<typeof searchSkillsSchema>): Promise<ToolResult> {
  const skills = await prisma.skill.findMany({
    where: {
      OR: [
        { name: { contains: args.query, mode: "insensitive" } },
        { description: { contains: args.query, mode: "insensitive" } },
      ],
    },
    take: 12,
  });
  return {
    results: skills.map((s) => ({ name: s.name, category: s.category, level: s.level, years: s.years })),
    sources: ["/about"],
  };
}

export interface AssistantToolDef {
  name: string;
  description: string;
  inputSchema: z.ZodType;
  execute: (args: unknown) => Promise<ToolResult>;
}

export const assistantTools: AssistantToolDef[] = [
  {
    name: "searchProjects",
    description: "Search Haroun's projects by keyword, industry or technology.",
    inputSchema: searchProjectsSchema,
    execute: (args) => searchProjectsExec(searchProjectsSchema.parse(args)),
  },
  {
    name: "getProject",
    description: "Get the full case study for one project by slug.",
    inputSchema: getProjectSchema,
    execute: (args) => getProjectExec(getProjectSchema.parse(args)),
  },
  {
    name: "searchExperience",
    description: "Search Haroun's work experience (employers, roles, achievements).",
    inputSchema: searchExperienceSchema,
    execute: (args) => searchExperienceExec(searchExperienceSchema.parse(args)),
  },
  {
    name: "searchSkills",
    description: "Search Haroun's skills by keyword.",
    inputSchema: searchSkillsSchema,
    execute: (args) => searchSkillsExec(searchSkillsSchema.parse(args)),
  },
];

export function glmToolDefs(): {
  name: string;
  description: string;
  input_schema: { type: "object"; properties: Record<string, unknown>; required?: string[] };
}[] {
  return assistantTools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: z.toJSONSchema(t.inputSchema) as {
      type: "object";
      properties: Record<string, unknown>;
      required?: string[];
    },
  }));
}

export async function executeTool(
  name: string,
  args: unknown
): Promise<ToolResult | null> {
  const tool = assistantTools.find((t) => t.name === name);
  if (!tool) return null;
  return tool.execute(tool.inputSchema.parse(args));
}
