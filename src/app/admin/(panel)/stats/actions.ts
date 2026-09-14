"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

function refresh() {
  revalidatePath("/admin/stats");
  revalidatePath("/", "layout");
}

export async function saveStat(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const value = String(formData.get("value") ?? "").trim().slice(0, 12);
  const label = String(formData.get("label") ?? "").trim().slice(0, 80);
  if (!value || !label) return;

  if (id) {
    await prisma.stat.update({ where: { id }, data: { value, label } });
  } else {
    const max = await prisma.stat.aggregate({ _max: { sortOrder: true } });
    await prisma.stat.create({ data: { value, label, sortOrder: (max._max.sortOrder ?? 0) + 1 } });
  }
  refresh();
}

export async function deleteStat(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.stat.delete({ where: { id } });
  refresh();
}

export async function moveStat(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  const all = await prisma.stat.findMany({ orderBy: { sortOrder: "asc" } });
  const idx = all.findIndex((s) => s.id === id);
  const swapWith = dir === "up" ? all[idx - 1] : all[idx + 1];
  if (idx === -1 || !swapWith) return;
  const current = all[idx]!;
  await prisma.$transaction([
    prisma.stat.update({ where: { id: current.id }, data: { sortOrder: swapWith.sortOrder } }),
    prisma.stat.update({ where: { id: swapWith.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  refresh();
}
