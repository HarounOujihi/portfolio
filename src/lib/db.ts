import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7: driver adapter is required (main plan Phase 1 / upgrade guide).
// The singleton survives HMR in dev via globalThis caching.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
