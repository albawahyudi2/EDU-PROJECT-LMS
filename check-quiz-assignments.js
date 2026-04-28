const { PrismaClient } = require('./packages/database/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_0iTkjcsdhuV4@ep-soft-block-a1hhgzhl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function checkQuizAssignments() {
  console.log('\n🔍 DAY 5: Checking Quiz Assignments\n');
  console.log('='.repeat(70));
  
  try {
    // Get all QUIZ type assignments
    const quizzes = await prisma.assignment.findMany({
      where: {
        type: 'QUIZ'
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
        quizQuestions: {
          include: {
            options: true
          }
        },
        submissions: {
          include: {
            student: {
              include: {
                user: true
              }
            },
            quizAnswers: true,
            grading: true
          }
        }
      }
    });

    console.log(`\n📝 Found ${quizzes.length} QUIZ assignments\n`);

    if (quizzes.length === 0) {
      console.log('⚠️  No quiz assignments found in database!');
      console.log('💡 Need to create quiz assignments first.\n');
      return;
    }

    for (const quiz of quizzes) {
      console.log(`\n📋 Quiz: "${quiz.title}"`);
      console.log(`   ID: ${quiz.id}`);
      console.log(`   Subject: ${quiz.lesson?.module?.subject?.name || 'N/A'}`);
      console.log(`   XP Reward: ${quiz.xpReward} XP`);
      console.log(`   Status: ${quiz.isDraft ? 'DRAFT' : 'PUBLISHED'}`);
      console.log(`   Questions: ${quiz.quizQuestions.length}`);
      
      // Show question details
      if (quiz.quizQuestions.length > 0) {
        console.log(`\n   📝 Questions:`);
        quiz.quizQuestions.forEach((q, idx) => {
          console.log(`      ${idx + 1}. ${q.question}`);
          console.log(`         Type: ${q.type}`);
          console.log(`         Points: ${q.points}`);
          console.log(`         Options: ${q.options.length}`);
          const correctOption = q.options.find(o => o.isCorrect);
          console.log(`         Correct Answer: ${correctOption?.text || 'None set'}`);
        });
      }

      // Show submission stats
      console.log(`\n   📊 Submissions: ${quiz.submissions.length}`);
      if (quiz.submissions.length > 0) {
        quiz.submissions.forEach(sub => {
          const status = sub.grading ? `GRADED (${sub.grading.score}/100)` : sub.status;
          console.log(`      - ${sub.student?.user?.studentName || 'Unknown'}: ${status}`);
        });
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n📊 Summary:\n');
    console.log(`Total QUIZ assignments: ${quizzes.length}`);
    
    const totalQuestions = quizzes.reduce((sum, q) => sum + q.quizQuestions.length, 0);
    console.log(`Total Questions: ${totalQuestions}`);
    
    const totalSubmissions = quizzes.reduce((sum, q) => sum + q.submissions.length, 0);
    console.log(`Total Quiz Submissions: ${totalSubmissions}`);
    
    const publishedQuizzes = quizzes.filter(q => !q.isDraft);
    console.log(`Published Quizzes: ${publishedQuizzes.length}`);
    
    console.log('\n💡 Next Steps:');
    if (publishedQuizzes.length === 0) {
      console.log('   1. Publish at least one quiz assignment');
    }
    if (totalQuestions === 0) {
      console.log('   1. Add questions to quiz assignments');
    }
    if (totalSubmissions < 4) {
      console.log(`   2. Create quiz submissions for students (${4 - totalSubmissions} needed)`);
    }
    console.log('   3. Test quiz grading system');
    console.log('   4. Verify XP rewards for quiz completion\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuizAssignments();
