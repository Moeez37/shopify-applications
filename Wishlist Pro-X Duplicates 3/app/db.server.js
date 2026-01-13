import { PrismaClient } from "@prisma/client";

// Preventing Multiple Prisma Instances in Development Mode
// 📌 Why is this needed?
// In development mode, when using Next.js or Node.js with Hot Reloading, the code gets re-executed 
// multiple times, potentially creating multiple PrismaClient instances, which can cause issues 
// like database connection limits. Storing the PrismaClient in global prevents this.

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}


const prisma = global.prisma || new PrismaClient();

export default prisma;
