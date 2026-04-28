// Check TASK_ANALYSIS assignments available
const { PrismaClient } = require('./packages/database/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_0iTkjcsdhuV4@ep-soft-block-a1hhgzhl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function checkTaskAssignments() {
  console.log('\n🔍 Checking TASK_ANALYSIS Assignments\n');
  console.log('='.repeat(70));
  
  try {
    const tasks = await prisma.assignment.findMany({
      where: {
        type: 'TASK_ANALYSIS',
        isDraft: false
      },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                subject: true
              }
            }
          }
        },
        taskSteps: true,
        submissions: {
          include: {
            student: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    console.log(`\n📝 Found ${tasks.length} TASK_ANALYSIS assignments\n`);

    for (const task of tasks) {
      console.log(`\n📋 Task: "${task.title}"`);
      console.log(`   ID: ${task.id}`);
      console.log(`   Subject: ${task.lesson?.module?.subject?.name || 'N/A'}`);
      console.log(`   XP Reward: ${task.xpReward} XP`);
      console.log(`   Steps: ${task.taskSteps.length}`);
      console.log(`   Submissions: ${task.submissions.length}`);
      
      // Show who submitted
      if (task.submissions.length > 0) {
        console.log(`   Submitted by:`);
        task.submissions.forEach(sub => {
          console.log(`      - ${sub.student?.user?.studentName || 'Unknown'}`);
        });
      }
      
      // Show who hasn't submitted
      const allStudents = ['Andi Pratama', 'Budi Santoso', 'Citra Dewi', 'Deni Kurniawan'];
      const submittedBy = task.submissions.map(s => s.student?.user?.studentName);
      const notSubmitted = allStudents.filter(s => !submittedBy.includes(s));
      
      if (notSubmitted.length > 0) {
        console.log(`   ⚠️  Not submitted by: ${notSubmitted.join(', ')}`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n💡 Available for more XP:\n');
    
    tasks.forEach(t => {
      const submissions = t.submissions.map(s => s.student?.user?.studentName || 'Unknown');
      const notSubmittedCount = 4 - submissions.length;
      if (notSubmittedCount > 0) {
        console.log(`   ${t.title}: ${t.xpReward} XP (${notSubmittedCount} students can submit)`);
      }
    });
    
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTaskAssignments();
