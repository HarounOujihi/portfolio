import "server-only";
import { prisma } from "@/lib/db";

/** Server-side delegates + ordering per resource. Only whitelisted keys resolve. */
export const RESOURCE_MODELS = {
  technologies: {
    delegate: prisma.technology,
    orderBy: [{ sortOrder: "asc" as const }],
  },
  skills: {
    delegate: prisma.skill,
    orderBy: [{ sortOrder: "asc" as const }],
  },
  education: {
    delegate: prisma.education,
    orderBy: [{ sortOrder: "asc" as const }],
  },
  certifications: {
    delegate: prisma.certification,
    orderBy: [{ issueDate: "desc" as const }],
  },
  articles: {
    delegate: prisma.article,
    orderBy: [{ publishedAt: "desc" as const }, { createdAt: "desc" as const }],
  },
} as const;

export type ResourceKey = keyof typeof RESOURCE_MODELS;

export function getResourceModel(resource: string): (typeof RESOURCE_MODELS)[ResourceKey] | null {
  return (RESOURCE_MODELS as Record<string, (typeof RESOURCE_MODELS)[ResourceKey]>)[resource] ?? null;
}

export function resourceHasOrder(resource: string): boolean {
  return resource === "technologies" || resource === "skills" || resource === "education";
}
