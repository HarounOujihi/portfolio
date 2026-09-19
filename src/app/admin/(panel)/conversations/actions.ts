"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function markAllConversationsRead(): Promise<void> {
  await requireAdmin();

  await prisma.$executeRaw`
    UPDATE "Conversation"
    SET "adminReadAt" = now()
    WHERE "adminReadAt" IS NULL OR "lastMessageAt" > "adminReadAt"
  `;

  revalidatePath("/admin/conversations");
  revalidatePath("/", "layout");
}
