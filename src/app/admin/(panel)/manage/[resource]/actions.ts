"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { getResourceModel, resourceHasOrder } from "@/lib/admin-resource-models";
import { getResourceSpec } from "@/lib/admin-resource-configs";

// Minimal structural shapes for the generated per-model delegates. The cast at
// delegateFor() is the single boundary: all five generated delegates match these
// shapes, and input here is admin-gated.
interface ResourceDelegate {
  findMany(args: { orderBy?: Record<string, "asc" | "desc">[]; select?: Record<string, true> }): Promise<Array<Record<string, unknown>>>;
  findUnique(args: { where: { id: string }; select?: Record<string, true> }): Promise<Record<string, unknown> | null>;
  create(args: { data: Record<string, unknown> }): Promise<unknown>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<unknown>;
  delete(args: { where: { id: string } }): Promise<unknown>;
  aggregate(args: { _max: { sortOrder: true } }): Promise<{ _max: { sortOrder: number | null } }>;
}

function delegateFor(resource: string): ResourceDelegate | null {
  const model = getResourceModel(resource);
  if (!model) return null;
  return model.delegate as unknown as ResourceDelegate;
}

function refresh(resource: string) {
  revalidatePath(`/admin/manage/${resource}`);
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

export async function saveResource(resource: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const spec = getResourceSpec(resource);
  const delegate = delegateFor(resource);
  if (!spec || !delegate) return;

  const id = String(formData.get("id") ?? "");
  const data: Record<string, unknown> = {};

  for (const f of spec.fields) {
    const raw = formData.get(f.name);
    switch (f.type) {
      case "checkbox":
        data[f.name] = raw === "on";
        break;
      case "number": {
        const n = Number(raw);
        data[f.name] = raw !== null && raw !== "" && !Number.isNaN(n) ? n : null;
        break;
      }
      case "date":
        data[f.name] = raw ? new Date(String(raw)) : null;
        break;
      case "select":
        data[f.name] = f.required ? String(raw ?? f.options?.[0] ?? "") : raw ? String(raw) : null;
        break;
      default: {
        const text = String(raw ?? "").trim().slice(0, f.maxLength ?? (f.type === "bigtextarea" ? 100_000 : 1000));
        data[f.name] = f.required ? text || " " : text || null;
      }
    }
  }

  // Articles: unique slug from title; publishedAt set on first publish
  if (resource === "articles") {
    const base = slugify(String(data.title ?? "article")) || "article";
    let slug = base;
    let n = 2;
    while (id === "" && (await delegate.findUnique({ where: { id: slug }, select: { id: true } }))) {
      slug = `${base}-${n}`;
      n += 1;
    }
    const existing = id ? await delegate.findUnique({ where: { id }, select: { published: true, publishedAt: true } }) : null;
    const wasPublished = existing && "published" in existing ? Boolean(existing.published) : false;
    const hadDate = existing && "publishedAt" in existing ? Boolean(existing.publishedAt) : false;
    data.slug = slug;
    if (data.published && !hadDate) data.publishedAt = new Date();
    if (!data.published) data.publishedAt = hadDate && existing && "publishedAt" in existing ? (existing.publishedAt as Date) : null;
  }

  // Auto sortOrder on create for ordered resources
  if (resourceHasOrder(resource) && !id) {
    const agg = await delegate.aggregate({ _max: { sortOrder: true } });
    data.sortOrder = (agg._max.sortOrder ?? 0) + 1;
  }

  if (id) {
    await delegate.update({ where: { id }, data });
  } else {
    await delegate.create({ data });
  }
  refresh(resource);
}

export async function deleteResource(formData: FormData): Promise<void> {
  await requireAdmin();
  const resource = String(formData.get("resource") ?? "");
  const delegate = delegateFor(resource);
  const id = String(formData.get("id") ?? "");
  if (!delegate || !id) return;
  await delegate.delete({ where: { id } });
  refresh(resource);
}

export async function moveResource(formData: FormData): Promise<void> {
  await requireAdmin();
  const resource = String(formData.get("resource") ?? "");
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  if (!resourceHasOrder(resource)) return;
  const delegate = delegateFor(resource);
  if (!delegate) return;

  const all = await delegate.findMany({
    orderBy: [{ sortOrder: "asc" }],
    select: { id: true, sortOrder: true },
  });
  const idx = all.findIndex((r) => String(r.id) === id);
  const swapWith = dir === "up" ? all[idx - 1] : all[idx + 1];
  if (idx === -1 || !swapWith) return;

  await prisma.$transaction(async (tx) => {
    const txr = tx as unknown as { update: (a: { where: { id: string }; data: { sortOrder: number } }) => Promise<unknown> };
    await txr.update({ where: { id: id }, data: { sortOrder: Number(swapWith.sortOrder) } });
    await txr.update({ where: { id: String(swapWith.id) }, data: { sortOrder: Number(all[idx]!.sortOrder) } });
  });
  refresh(resource);
}
