import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/require-admin";
import { AdminShell } from "@/components/admin/admin-shell";

/** Guarded admin shell (P4.T3) — every child page is behind requireAdmin(). */
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();

  return (
    <AdminShell email={session.user.email}>{children}</AdminShell>
  );
}
