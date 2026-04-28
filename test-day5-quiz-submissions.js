// DAY 5: Test Quiz Submission Flow
// Test quiz submissions for students 2, 3, 4

const API_URL = 'http://localhost:3001/graphql';

// Test accounts
const students = [
  { email: 'siswa2@lms-abk.com', password: 'Siswa123!', name: 'Budi' },
  { email: 'siswa3@lms-abk.com', password: 'Siswa123!', name: 'Citra' },
  { email: 'siswa4@lms-abk.com', password: 'Siswa123!', name: 'Deni' }
];

// Published quiz with questions (from check-quiz-assignments.js output)
const QUIZ_ID = 'cmlu9pfur0007wckpguhc1mij'; // "asdflkhjabsdf" quiz

async function graphqlRequest(query, variables = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  
  return result.data;
}

async function testQuizSubmission() {
  console.log('\n🧪 DAY 5: Testing Quiz Submission Flow\n');
  console.log('='.repeat(70));
  
  let successCount = 0;
  let totalTests = students.length;
  
  for (const student of students) {
    console.log(`\n📝 Testing for: ${student.name}`);
    console.log('-'.repeat(70));
    
    try {
      // 1. Login
      console.log(`\n1️⃣  Logging in as ${student.name}...`);
      const loginData = await graphqlRequest(`
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
            user {
              id
              email
              studentName
            }
          }
        }
      `, {
        input: {
          email: student.email,
          password: student.password
        }
      });
      
      const token = loginData.login.accessToken;
      const userId = loginData.login.user.id;
      console.log(`✅ Logged in: ${loginData.login.user.studentName}`);
      
      // 2. Get quiz details
      console.log(`\n2️⃣  Getting quiz details...`);
      const quizData = await graphqlRequest(`
        query AssignmentForStudent($assignmentId: String!) {
          assignmentForStudent(assignmentId: $assignmentId) {
            id
            title
            type
            xpReward
            quizQuestions {
              id
              question
              options {
                id
                optionKey
                text
              }
            }
          }
        }
      `, { assignmentId: QUIZ_ID }, token);
      
      const quiz = quizData.assignmentForStudent;
      console.log(`✅ Quiz: "${quiz.title}"`);
      console.log(`   Questions: ${quiz.quizQuestions.length}`);
      console.log(`   XP Reward: ${quiz.xpReward} XP`);
      
      if (quiz.quizQuestions.length === 0) {
        console.log(`⚠️  Quiz has no questions, skipping...`);
        continue;
      }
      
      // 3. Start submission
      console.log(`\n3️⃣  Starting quiz submission...`);
      const startData = await graphqlRequest(`
        mutation StartSubmission($assignmentId: String!) {
          startSubmission(assignmentId: $assignmentId) {
            id
            assignmentId
            status
            createdAt
          }
        }
      `, { assignmentId: QUIZ_ID }, token);
      
      const submissionId = startData.startSubmission.id;
      console.log(`✅ Submission started: ${submissionId}`);
      
      // 4. Submit answers for each question
      console.log(`\n4️⃣  Submitting answers...`);
      
      for (let i = 0; i < quiz.quizQuestions.length; i++) {
        const question = quiz.quizQuestions[i];
        
        // Find the correct answer (option A typically, but we'll use the first option)
        const correctOption = question.options[0]; // For testing, select first option
        
        console.log(`   Question ${i + 1}: ${question.question}`);
        console.log(`   Selected: ${correctOption.optionKey} - ${correctOption.text}`);
        
        const answerData = await graphqlRequest(`
          mutation SubmitQuizAnswer($input: SubmitQuizAnswerInput!) {
            submitQuizAnswer(input: $input) {
              id
              questionId
              selectedOption
              isCorrect
            }
          }
        `, {
          input: {
            submissionId: submissionId,
            questionId: question.id,
            selectedOption: correctOption.optionKey
          }
        }, token);
        
        const answer = answerData.submitQuizAnswer;
        const icon = answer.isCorrect ? '✅' : '❌';
        console.log(`   ${icon} Answer recorded`);
      }
      
      // 5. Complete quiz submission (auto-grade)
      console.log(`\n5️⃣  Completing quiz submission (auto-grading)...`);
      const completeData = await graphqlRequest(`
        mutation CompleteQuizSubmission($submissionId: String!) {
          completeQuizSubmission(submissionId: $submissionId) {
            score
            correctCount
            totalQuestions
            xpEarned
            submissionId
          }
        }
      `, { submissionId }, token);
      
      const result = completeData.completeQuizSubmission;
      console.log(`✅ Quiz completed and auto-graded!`);
      console.log(`   Score: ${result.score}/100`);
      console.log(`   Correct: ${result.correctCount}/${result.totalQuestions}`);
      console.log(`   XP Awarded: ${result.xpEarned} XP ✨`);
      
      successCount++;
      console.log(`\n✅ ${student.name} quiz submission complete!\n`);
      
    } catch (error) {
      console.log(`\n❌ Test failed for ${student.name}: ${error.message}\n`);
    }
  }
  
  // Summary
  console.log('='.repeat(70));
  console.log('\n📊 QUIZ SUBMISSION TEST RESULTS:\n');
  console.log(`✅ Successful: ${successCount}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - successCount}/${totalTests}\n`);
  
  if (successCount === totalTests) {
    console.log('🎉 All quiz submissions completed successfully!\n');
    console.log('System Status:');
    console.log('   ✅ Students can take quizzes');
    console.log('   ✅ Quiz auto-grading working');
    console.log('   ✅ XP rewards distributed');
    console.log('   ✅ Quiz submission flow functional\n');
  } else {
    console.log('⚠️  Some quiz submissions failed. Check logs above.\n');
  }
  
  console.log('💡 Run: node check-submissions.js to verify database state\n');
}

// Run the test
testQuizSubmission().catch(console.error);
