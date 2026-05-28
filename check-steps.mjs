import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  try {
    const classroom = await p.classroom.findUnique({
      where: { id: 'cmpnvmr34001to001kcnw1k1' },
      include: {
        subjects: {
          include: {
            modules: {
              include: {
                lessons: {
                  include: {
                    assignments: {
                      include: {
                        taskSteps: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    console.log('Classroom found:', JSON.stringify(classroom, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await p.$disconnect();
  }
}

main();
