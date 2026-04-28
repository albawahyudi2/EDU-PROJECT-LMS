// Check current submission status for all students
const { PrismaClient } = require('./packages/database/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_0iTkjcsdhuV4@ep-soft-block-a1hhgzhl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function checkSubmissions() {
  console.log('\n🔍 DAY 4: Checking Submission Status\n');
  console.log('='.repeat(70));
  
  try {
    // Get all students
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: { email: true, studentName: true, parentName: true }
        }
      }
    });
    
    console.log(`\n📚 Found ${students.length} students\n`);
    
    // Get all assignments
    const assignments = await prisma.assignment.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        isDraft: true,
        xpReward: true
      }
    });
    
    console.log(`📝 Found ${assignments.length} assignments\n`);
    
    // Check submissions for each student
    let totalSubmissions = 0;
    const submissionsByStudent = {};
    
    for (const student of students) {
      const submissions = await prisma.submission.findMany({
        where: { studentId: student.id },
        include: {
          assignment: {
            select: { title: true, type: true, xpReward: true }
          },
          grading: {
            select: { score: true, feedback: true }
          }
        }
      });
      
      submissionsByStudent[student.id] = submissions;
      totalSubmissions += submissions.length;
      
      console.log(`${student.user.studentName} (${student.user.email})`);
      console.log(`  Submissions: ${submissions.length}`);
      console.log(`  Level: ${student.level} | Total XP: ${student.totalXP}`);
      
      if (submissions.length > 0) {
        submissions.forEach(sub => {
          const graded = sub.grading ? `✅ Graded (${sub.grading.score}/100)` : '⏳ Pending';
          console.log(`    - ${sub.assignment.title} (${sub.assignment.type}) - ${sub.status} ${graded}`);
        });
      } else {
        console.log('    ❌ No submissions');
      }
      console.log('');
    }
    
    // Summary
    console.log('='.repeat(70));
    console.log('\n📊 Summary:\n');
    console.log(`Total Students: ${students.length}`);
    console.log(`Total Assignments: ${assignments.length}`);
    console.log(`Total Submissions: ${totalSubmissions}`);
    console.log(`Students with submissions: ${Object.values(submissionsByStudent).filter(s => s.length > 0).length}`);
    console.log(`Students without submissions: ${Object.values(submissionsByStudent).filter(s => s.length === 0).length}`);
    
    const avgSubmissionsPerStudent = (totalSubmissions / students.length).toFixed(2);
    console.log(`Average submissions per student: ${avgSubmissionsPerStudent}`);
    
    // List active (non-draft) assignments
    const activeAssignments = assignments.filter(a => !a.isDraft);
    console.log(`\n📌 Active assignments available: ${activeAssignments.length}`);
    if (activeAssignments.length > 0) {
      activeAssignments.forEach(a => {
        console.log(`  - ${a.title} (${a.type}) - ${a.xpReward} XP`);
      });
    }
    
    // Check grading status
    const allGradings = await prisma.grading.findMany({
      include: {
        submission: {
          include: {
            student: {
              include: {
                user: { select: { studentName: true } }
              }
            },
            assignment: {
              select: { title: true }
            }
          }
        }
      }
    });
    
    console.log(`\n✅ Total Gradings: ${allGradings.length}`);
    if (allGradings.length > 0) {
      allGradings.forEach(g => {
        console.log(`  - ${g.submission.student.user.studentName} → ${g.submission.assignment.title}: ${g.score}/100`);
      });
    }
    
    // Issues found
    console.log('\n⚠️  Issues Identified:\n');
    const studentsWithoutSubmissions = students.filter(s => submissionsByStudent[s.id].length === 0);
    if (studentsWithoutSubmissions.length > 0) {
      console.log(`1. ${studentsWithoutSubmissions.length} students have NO submissions:`);
      studentsWithoutSubmissions.forEach(s => {
        console.log(`   - ${s.user.studentName} (${s.user.email})`);
      });
    }
    
    if (activeAssignments.length > 0 && totalSubmissions < students.length * activeAssignments.length) {
      const expectedSubmissions = students.length * activeAssignments.length;
      const missingSubmissions = expectedSubmissions - totalSubmissions;
      console.log(`\n2. Missing submissions: ${missingSubmissions} out of ${expectedSubmissions} expected`);
      console.log(`   (${students.length} students × ${activeAssignments.length} active assignments)`);
    }
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Create test submissions for students 2, 3, 4');
    console.log('   2. Test grading flow for new submissions');
    console.log('   3. Verify XP is awarded correctly');
    console.log('   4. Check level-up system\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubmissions();
