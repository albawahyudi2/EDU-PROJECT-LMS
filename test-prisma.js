const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.stepSubmission.findFirst();
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}

main().finally(() => prisma.$disconnect());
