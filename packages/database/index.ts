import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __velaPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__velaPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__velaPrisma = prisma;
}

export * from "@prisma/client";
