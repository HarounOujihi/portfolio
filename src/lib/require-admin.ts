import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * THE guard (P4.T3): call at the top of every admin Server Component,
 * Server Action, and Route Handler that touches data. Middleware is only
 * a fast-path (CVE-2025-29927).
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");
  return session;
}
