// Prisma 7 CLI config — connection URLs for Migrate live here, not in schema.prisma.
// The PrismaClient (runtime) connection is configured with a driver adapter in src/lib/db.ts.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
