import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Reuse a single client (and its connection pool) across hot reloads in dev; Next.js would otherwise create a new one (and new DB connections) on every module reload.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
