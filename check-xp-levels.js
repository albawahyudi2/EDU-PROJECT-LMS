// DAY 6: Check XP and Level System
// Verify current student XP/levels and calculate how much more XP needed

const { PrismaClient } = require('./packages/database/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_0iTkjcsdhuV4@ep-soft-block-a1hhgzhl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function checkXPLevels() {
  console.log('\n🔍 DAY 6: Checking XP & Level System\n');
  console.log('='.repeat(70));
  
  try {
    // Get all students with their XP and levels
    const students = await prisma.student.findMany({
      include: {
        user: true,
        submissions: {
          include: {
            assignment: true,
            grading: true
          }
        }
      },
      orderBy: {
        totalXP: 'desc'
      }
    });

    console.log(`\n📚 Found ${students.length} students\n`);

    // XP System Configuration
    const XP_PER_LEVEL = 100;
    
    for (const student of students) {
      console.log(`\n👤 ${student.user.studentName} (${student.user.email})`);
      console.log(`   Current Level: ${student.level}`);
      console.log(`   Total XP: ${student.totalXP}`);
      console.log(`   Current Level XP: ${student.currentXP}`);
      
      // Calculate XP for next level
      const xpForNextLevel = (student.level * XP_PER_LEVEL) - student.totalXP;
      const expectedLevel = Math.floor(student.totalXP / XP_PER_LEVEL) + 1;
      
      console.log(`   Expected Level: ${expectedLevel}`);
      console.log(`   XP needed for Level ${student.level + 1}: ${xpForNextLevel} XP`);
      
      if (expectedLevel !== student.level) {
        console.log(`   ⚠️  WARNING: Level mismatch! Should be Level ${expectedLevel}`);
      }
      
      // Show submission history
      const gradedSubmissions = student.submissions.filter(s => s.grading);
      console.log(`\n   📝 Graded Submissions (${gradedSubmissions.length}):`);
      
      let totalXPEarned = 0;
      for (const sub of gradedSubmissions) {
        const xpEarned = sub.assignment.xpReward;
        totalXPEarned += xpEarned;
        console.log(`      - ${sub.assignment.title}: ${sub.grading.score}/100 → ${xpEarned} XP`);
      }
      
      console.log(`\n   💰 Total XP Earned from Submissions: ${totalXPEarned}`);
      if (totalXPEarned !== student.totalXP) {
        console.log(`   ⚠️  WARNING: XP mismatch! Database shows ${student.totalXP} XP`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n📊 XP System Summary:\n');
    console.log(`XP per Level: ${XP_PER_LEVEL}`);
    console.log(`Level 1: 0-99 XP`);
    console.log(`Level 2: 100-199 XP`);
    console.log(`Level 3: 200-299 XP`);
    console.log(`... and so on\n`);

    // Check if any students are ready to level up
    const studentsNearLevelUp = students.filter(s => {
      const xpNeeded = (s.level * XP_PER_LEVEL) - s.totalXP;
      return xpNeeded <= 30 && xpNeeded > 0;
    });

    if (studentsNearLevelUp.length > 0) {
      console.log('🎯 Students close to leveling up:\n');
      for (const s of studentsNearLevelUp) {
        const xpNeeded = (s.level * XP_PER_LEVEL) - s.totalXP;
        console.log(`   ${s.user.studentName}: ${xpNeeded} XP away from Level ${s.level + 1}`);
      }
      console.log('\n💡 Next Step: Create more submissions to test level-up!\n');
    } else {
      const lowestXP = students[students.length - 1];
      console.log(`💡 Next Step: All students need more XP to level up.\n`);
    }

    // Check available assignments for more XP
    const availableAssignments = await prisma.assignment.findMany({
      where: {
        isDraft: false
      },
      select: {
        id: true,
        title: true,
        type: true,
        xpReward: true
      }
    });

    console.log(`📌 Available Assignments for XP: ${availableAssignments.length}\n`);
    availableAssignments.forEach(a => {
      console.log(`   - ${a.title} (${a.type}): ${a.xpReward} XP`);
    });

    console.log('\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkXPLevels();
