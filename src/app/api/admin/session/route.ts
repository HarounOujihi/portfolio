import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Session probe for the header's Administration button.
 * Returns whether the current visitor holds a valid admin session.
 * No secrets, no PII — the button it controls is cosmetic; /admin re-checks auth.
 */
export async function GET() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  return Response.json(
    { admin: Boolean(session?.user) },
    { headers: { "cache-control": "no-store" } },
  );
}
