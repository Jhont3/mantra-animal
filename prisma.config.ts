import { defineConfig } from "prisma/config";
import { config as loadEnv } from "dotenv";

// Prisma CLI only auto-loads .env — manually load .env.local (Next.js convention)
loadEnv({ path: ".env.local" });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
