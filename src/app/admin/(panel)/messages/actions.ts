"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

const STATUSES = ["NEW", "READ", "REPLIED", "SPAM"];

export async function setMessageStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !STATUSES.includes(status)) return;
  await prisma.contactMessage.update({ where: { id }, data: { status: status as never } });
  revalidatePath("/admin/messages");
}
