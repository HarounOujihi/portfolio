import { NextResponse, type NextRequest } from "next/server";

/**
 * Fast-path filter ONLY (CVE-2025-29927: never trust this alone — every admin
 * data access re-checks via requireAdmin()).
 * Also rate-limits the login endpoint: 10 sign-in attempts / min / IP (P4.T2).
 */
const attempts = new Map<string, number[]>();
const WINDOW = 60_000;
const MAX_ATTEMPTS = 10;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/api/auth/sign-in/email") {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const arr = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW);
    if (arr.length >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
    }
    arr.push(now);
    attempts.set(ip, arr);
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Better Auth prefixes cookies with __Secure- on HTTPS — check both.
    const hasSession =
      req.cookies.has("better-auth.session_token") ||
      req.cookies.has("__Secure-better-auth.session_token");
    if (!hasSession) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/auth/sign-in/email"],
};
