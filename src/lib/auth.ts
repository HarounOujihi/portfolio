import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { prisma } from "@/lib/db";

/** Allow-list — single admin (owner requirement, §8.1/D-P4-1). */
const ALLOWED = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // admin exists only via seed — no signup path
  },
  databaseHooks: {
    session: {
      create: {
        // Defense in depth: even an existing credential must be allow-listed.
        before: async (session) => {
          const user = await prisma.user.findUnique({ where: { id: session.userId } });
          if (!user || !ALLOWED.includes(user.email.toLowerCase())) {
            throw new APIError("FORBIDDEN", { message: "Account not allowed" });
          }
          return { data: session };
        },
      },
    },
  },
});
