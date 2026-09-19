import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/require-admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";

/** Guarded admin shell (P4.T3) — every child page is behind requireAdmin(). */
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();

  const [unreadConversations, unreadMessages] = await Promise.all([
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::int AS count FROM "Conversation"
      WHERE "adminReadAt" IS NULL OR "lastMessageAt" > "adminReadAt"
    `,
    prisma.contactMessage.count({ where: { status: "NEW" } }),
  ]);

  return (
    <AdminShell
      email={session.user.email}
      badges={{
        "/admin/conversations": Number(unreadConversations[0]?.count ?? 0),
        "/admin/messages": unreadMessages,
      }}
    >
      {children}
    </AdminShell>
  );
}
export const dynamic = "force-dynamic";
