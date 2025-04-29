import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Use var in the global declaration to match globalThis behavior
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Create a global interface augmentation for globalThis
declare global {
  interface globalThis {
    prisma: undefined | ReturnType<typeof prismaClientSingleton>;
  }
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma; 