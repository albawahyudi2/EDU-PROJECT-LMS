const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$queryRaw`ALTER TABLE "step_submissions" ADD COLUMN "photoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[]`;
    console.log("Column added manually via raw query");
  } catch (e) {
    console.error("Error adding column:", e.message);
  }
  
  try {
    await prisma.$queryRaw`ALTER TYPE "MediaType" ADD VALUE 'DOCUMENT'`;
    console.log("Enum updated manually");
  } catch (e) {
    console.error("Error updating enum:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
