const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.submission.findFirst({
      include: {
        stepSubmissions: true
      }
    });
    console.log("Success findFirst submission with stepSubmissions:", !!res);
  } catch (e) {
    console.error("Error:", e);
  }
}

main().finally(() => prisma.$disconnect());
