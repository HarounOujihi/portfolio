import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * Session probe for the header's Administration button.
 * Returns whether the visitor holds a valid admin session plus the count of
 * conversations with activity newer than the last admin review.
 * No secrets, no PII — /admin re-checks auth on every page.
 */
export async function GET() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user) {
    return Response.json({ admin: false, unread: 0 }, { headers: { "cache-control": "no-store" } });
  }

  const unread = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::int AS count FROM "Conversation"
    WHERE "adminReadAt" IS NULL OR "lastMessageAt" > "adminReadAt"
  `;

  return Response.json(
    { admin: true, unread: Number(unread[0]?.count ?? 0) },
    { headers: { "cache-control": "no-store" } },
  );
}
