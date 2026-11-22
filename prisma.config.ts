import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Usa DIRECT_URL (Session Pooler :5432) para migrations; fallback para DATABASE_URL
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
