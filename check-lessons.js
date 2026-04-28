// Check lessons in database
const { PrismaClient } = require('./packages/database/node_modules/@prisma/client');

const prisma = new PrismaClient();

async function checkLessons() {
  try {
    console.log('🔍 Checking lessons in database...\n');
    
    const lessons = await prisma.lesson.findMany({
      include: {
        module: {
          include: {
            subject: {
              include: {
                classroom: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    console.log(`📚 Found ${lessons.length} lessons:\n`);
    
    if (lessons.length === 0) {
      console.log('❌ No lessons found in database!');
      console.log('⚠️  You need to create a lesson before creating an assignment.\n');
      
      // Check if there are modules
      const modules = await prisma.module.findMany({
        include: {
          subject: {
            include: {
              classroom: true
            }
          }
        }
      });
      
      console.log(`📦 Found ${modules.length} modules:`);
      modules.forEach((mod, idx) => {
        console.log(`   ${idx + 1}. ${mod.title} (ID: ${mod.id})`);
        console.log(`      Subject: ${mod.subject.name}`);
        console.log(`      Classroom: ${mod.subject.classroom.name}\n`);
      });
      
      if (modules.length > 0) {
        console.log('💡 You can create a lesson using one of these module IDs.\n');
      } else {
        console.log('❌ No modules found either!');
        console.log('⚠️  Full flow: Create Classroom → Subject → Module → Lesson → Assignment\n');
      }
    } else {
      lessons.forEach((lesson, idx) => {
        console.log(`📖 Lesson ${idx + 1}:`);
        console.log(`   ID: ${lesson.id}`);
        console.log(`   Title: ${lesson.title}`);
        console.log(`   Module: ${lesson.module.title}`);
        console.log(`   Subject: ${lesson.module.subject.name}`);
        console.log(`   Classroom: ${lesson.module.subject.classroom.name}`);
        console.log(`   Draft: ${lesson.isDraft}`);
        console.log(`   Active: ${lesson.isActive}`);
        console.log('');
      });
      
      console.log('✅ You can use any of these lesson IDs to create assignments.\n');
    }
    
    // Check assignments
    const assignments = await prisma.assignment.findMany({
      include: {
        lesson: true
      }
    });
    
    console.log(`📝 Found ${assignments.length} assignments:\n`);
    assignments.forEach((assign, idx) => {
      console.log(`   ${idx + 1}. ${assign.title} (${assign.type}) - Lesson: ${assign.lesson.title}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLessons();
