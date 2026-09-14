"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

function refresh() {
  revalidatePath("/admin/projects");
  revalidatePath("/", "layout");
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = base || "project";
  let n = 2;
  while (
    await prisma.project.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    })
  ) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export async function toggleProject(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  if (!id || (field !== "published" && field !== "featured")) return;
  const project = await prisma.project.findUnique({ where: { id }, select: { published: true, featured: true } });
  if (!project) return;
  await prisma.project.update({
    where: { id },
    data: field === "published" ? { published: !project.published } : { featured: !project.featured },
  });
  refresh();
}

export async function moveProject(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  const all = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, sortOrder: true },
  });
  const idx = all.findIndex((p) => p.id === id);
  const swapWith = dir === "up" ? all[idx - 1] : all[idx + 1];
  if (idx === -1 || !swapWith) return;
  const current = all[idx]!;
  await prisma.$transaction([
    prisma.project.update({ where: { id: current.id }, data: { sortOrder: swapWith.sortOrder } }),
    prisma.project.update({ where: { id: swapWith.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  refresh();
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  // TODO(phase-6): also delete the project's KnowledgeDocument + chunks
  // (delete→re-index policy, D-P1-2).
  await prisma.project.delete({ where: { id } });
  refresh();
}

export interface SaveProjectState {
  ok?: boolean;
  error?: string;
  id?: string;
}

export async function saveProject(_prev: SaveProjectState, formData: FormData): Promise<SaveProjectState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "") || undefined;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const slugInput = String(formData.get("slug") ?? "").trim() || slugify(name);
  const slug = await uniqueSlug(slugify(slugInput), id);

  const shortDescription = String(formData.get("shortDescription") ?? "").trim().slice(0, 400);
  const longDescription = String(formData.get("longDescription") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim().slice(0, 200);
  const market = String(formData.get("market") ?? "").trim().slice(0, 100) || null;
  const industry = String(formData.get("industry") ?? "OTHER");
  const projectType = String(formData.get("projectType") ?? "WEB_APP");
  const status = String(formData.get("status") ?? "LIVE");
  const liveUrl = String(formData.get("liveUrl") ?? "").trim() || null;
  const startDate = formData.get("startDate") ? new Date(String(formData.get("startDate"))) : new Date();
  const endDate = formData.get("endDate") ? new Date(String(formData.get("endDate"))) : null;
  const isCurrent = formData.get("isCurrent") === "on";
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const techIds = formData.getAll("techIds").map(String).filter(Boolean);

  const pairs = (prefix: "challenge" | "solution" | "outcome") => {
    const titles = formData.getAll(`${prefix}-title`).map(String);
    const descs = formData.getAll(`${prefix}-desc`).map(String);
    const rows: { title: string; description: string; metric?: string }[] = [];
    titles.forEach((title, i) => {
      if (title.trim()) {
        rows.push({
          title: title.trim().slice(0, 150),
          description: (descs[i] ?? "").trim().slice(0, 600),
          ...(prefix === "outcome" && { metric: undefined }),
        });
      }
    });
    return rows;
  };

  try {
    const result = await prisma.$transaction(async (tx) => {
      const data = {
        name,
        slug,
        shortDescription,
        longDescription,
        role,
        market,
        industry: industry as never,
        projectType: projectType as never,
        status: status as never,
        startDate,
        endDate: isCurrent ? null : endDate,
        isCurrent,
        featured,
        published,
        liveUrl: liveUrl as string | null,
        updatedAt: new Date(),
      };

      const project = id
        ? await tx.project.update({ where: { id }, data })
        : await tx.project.create({ data: { ...data, createdAt: new Date() } });

      await tx.projectChallenge.deleteMany({ where: { projectId: project.id } });
      await tx.projectChallenge.createMany({
        data: pairs("challenge").map((c, i) => ({ ...c, projectId: project.id, sortOrder: i + 1 })),
      });
      await tx.projectSolution.deleteMany({ where: { projectId: project.id } });
      await tx.projectSolution.createMany({
        data: pairs("solution").map((s, i) => ({ ...s, projectId: project.id, sortOrder: i + 1 })),
      });
      await tx.projectOutcome.deleteMany({ where: { projectId: project.id } });
      await tx.projectOutcome.createMany({
        data: pairs("outcome").map((o, i) => ({
          title: o.title,
          description: o.description,
          projectId: project.id,
          sortOrder: i + 1,
        })),
      });
      await tx.projectTechnology.deleteMany({ where: { projectId: project.id } });
      if (techIds.length) {
        await tx.projectTechnology.createMany({
          data: techIds.map((technologyId) => ({ projectId: project.id, technologyId })),
        });
      }
      return project;
    });

    refresh();
    return { ok: true, id: result.id };
  } catch (e) {
    console.error(e);
    return { error: "Save failed — check the values and try again." };
  }
}
