"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

function refresh() {
  revalidatePath("/admin/experience");
  revalidatePath("/", "layout");
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function saveExperience(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "") || undefined;
  const companyName = String(formData.get("companyName") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!companyName || !jobTitle || !summary) return;

  const employmentType = String(formData.get("employmentType") ?? "FULL_TIME");
  const location = String(formData.get("location") ?? "").trim() || null;
  const startDate = formData.get("startDate") ? new Date(String(formData.get("startDate"))) : new Date();
  const endDate = formData.get("endDate") ? new Date(String(formData.get("endDate"))) : null;
  const isCurrent = formData.get("isCurrent") === "on";
  const published = formData.get("published") === "on";

  const achievements = formData
    .getAll("ach-title")
    .map(String)
    .map((title, i) => ({
      title: title.trim().slice(0, 150),
      description: String(formData.getAll("ach-desc")[i] ?? "").trim().slice(0, 600),
      metric: String(formData.getAll("ach-metric")[i] ?? "").trim().slice(0, 100) || null,
    }))
    .filter((a) => a.title);

  const data = {
    companyName,
    jobTitle,
    employmentType: employmentType as never,
    location,
    startDate,
    endDate: isCurrent ? null : endDate,
    isCurrent,
    summary,
    description,
    published,
    updatedAt: new Date(),
  };

  const existing = id ? await prisma.experience.findUnique({ where: { id }, select: { companySlug: true } }) : null;
  const companySlug = existing?.companySlug ?? slugify(companyName);

  const project = await prisma.experience.upsert({
    where: { companySlug },
    update: data,
    create: {
      ...data,
      companySlug,
      sortOrder: ((await prisma.experience.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? 0) + 1,
      achievements: { create: achievements.map((a, i) => ({ ...a, sortOrder: i + 1 })) },
    },
  });

  if (id && achievements.length) {
    await prisma.experienceAchievement.deleteMany({ where: { experienceId: project.id } });
    await prisma.experienceAchievement.createMany({
      data: achievements.map((a, i) => ({ ...a, experienceId: project.id, sortOrder: i + 1 })),
    });
  }
  refresh();
}

export async function deleteExperience(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.experience.delete({ where: { id } });
  refresh();
}

export async function moveExperience(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  const all = await prisma.experience.findMany({
    orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
    select: { id: true, sortOrder: true },
  });
  const idx = all.findIndex((r) => r.id === id);
  const swapWith = dir === "up" ? all[idx - 1] : all[idx + 1];
  if (idx === -1 || !swapWith) return;
  const current = all[idx]!;
  await prisma.$transaction([
    prisma.experience.update({ where: { id: current.id }, data: { sortOrder: Number(swapWith.sortOrder) } }),
    prisma.experience.update({ where: { id: swapWith.id }, data: { sortOrder: Number(current.sortOrder) } }),
  ]);
  refresh();
}
