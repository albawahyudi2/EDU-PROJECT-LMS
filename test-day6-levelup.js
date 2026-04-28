// DAY 6: Test Level-Up System
// Submit "sgdg" quiz for students 2,3,4 to push them to 80 XP
// Then submit more to reach 100 XP and verify level-up to Level 2

const API_URL = 'http://localhost:3001/graphql';

const students = [
  { email: 'siswa2@lms-abk.com', password: 'Siswa123!', name: 'Budi', currentXP: 70 },
  { email: 'siswa3@lms-abk.com', password: 'Siswa123!', name: 'Citra', currentXP: 70 },
  { email: 'siswa4@lms-abk.com', password: 'Siswa123!', name: 'Deni', currentXP: 70 }
];

// sgdg quiz (10 XP)
const SGDG_QUIZ_ID = 'cmlu5wxju000c110wj9tpvg82';

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

async function testLevelUp() {
  console.log('\n🧪 DAY 6: Testing Level-Up System\n');
  console.log('='.repeat(70));
  console.log('\n📋 Goal: Push students from 70 XP → 100 XP to test Level 2\n');
  
  for (const student of students) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`\n🎯 Testing: ${student.name} (Current: ${student.currentXP} XP, Level 1)`);
    console.log(`   Target: 100 XP (Level 2)\n`);
    
    try {
      // 1. Login
      console.log('1️⃣  Logging in...');
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
      console.log(`✅ Logged in: ${loginData.login.user.studentName}`);
      
      // 2. Check current XP/Level
      console.log('\n2️⃣  Checking current stats...');
      const profileData = await graphqlRequest(`
        query Me {
          me {
            studentProfile {
              id
              level
              totalXP
              user {
                studentName
              }
            }
          }
        }
      `, {}, token);
      
      const profile = profileData.me.studentProfile;
      console.log(`   Level: ${profile.level}`);
      console.log(`   Total XP: ${profile.totalXP}`);
      console.log(`   XP needed for Level 2: ${100 - profile.totalXP}`);
      
      // 3. Submit sgdg quiz (10 XP)
      console.log('\n3️⃣  Submitting "sgdg" quiz...');
      const quizData = await graphqlRequest(`
        query AssignmentForStudent($assignmentId: String!) {
          assignmentForStudent(assignmentId: $assignmentId) {
            id
            title
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
      `, { assignmentId: SGDG_QUIZ_ID }, token);
      
      const quiz = quizData.assignmentForStudent;
      console.log(`   Quiz: "${quiz.title}" (${quiz.xpReward} XP)`);
      
      if (quiz.quizQuestions.length === 0) {
        console.log(`   ⚠️  No questions, skipping...`);
        continue;
      }
      
      // Start submission
      const startData = await graphqlRequest(`
        mutation StartSubmission($assignmentId: String!) {
          startSubmission(assignmentId: $assignmentId) {
            id
          }
        }
      `, { assignmentId: SGDG_QUIZ_ID }, token);
      
      const submissionId = startData.startSubmission.id;
      
      // Submit answers
      for (const question of quiz.quizQuestions) {
        await graphqlRequest(`
          mutation SubmitQuizAnswer($input: SubmitQuizAnswerInput!) {
            submitQuizAnswer(input: $input) {
              id
              isCorrect
            }
          }
        `, {
          input: {
            submissionId: submissionId,
            questionId: question.id,
            selectedOption: question.options[0].optionKey
          }
        }, token);
      }
      
      // Complete quiz
      const result = await graphqlRequest(`
        mutation CompleteQuizSubmission($submissionId: String!) {
          completeQuizSubmission(submissionId: $submissionId) {
            score
            correctCount
            totalQuestions
            xpEarned
          }
        }
      `, { submissionId }, token);
      
      console.log(`   ✅ Quiz completed!`);
      console.log(`   Score: ${result.completeQuizSubmission.score}/100`);
      console.log(`   XP Earned: +${result.completeQuizSubmission.xpEarned} XP`);
      
      // 4. Check updated XP/Level
      console.log('\n4️⃣  Checking updated stats...');
      const updatedData = await graphqlRequest(`
        query Me {
          me {
            studentProfile {
              level
              totalXP
              user {
                studentName
              }
            }
          }
        }
      `, {}, token);
      
      const updated = updatedData.me.studentProfile;
      const xpGained = updated.totalXP - profile.totalXP;
      
      console.log(`\n   📊 RESULTS:`);
      console.log(`   Before: Level ${profile.level}, ${profile.totalXP} XP`);
      console.log(`   After:  Level ${updated.level}, ${updated.totalXP} XP`);
      console.log(`   Gained: +${xpGained} XP`);
      
      if (updated.level > profile.level) {
        console.log(`\n   🎉 LEVEL UP! ${student.name} is now Level ${updated.level}! 🎉`);
      } else if (updated.totalXP >= 100) {
        console.log(`\n   ⚠️  WARNING: Has ${updated.totalXP} XP but still Level ${updated.level}`);
        console.log(`   Expected: Level 2 (auto level-up may not be working)`);
      } else {
        console.log(`\n   📈 Progress: ${updated.totalXP}/100 XP for Level 2`);
        console.log(`   Still need: ${100 - updated.totalXP} XP`);
      }
      
    } catch (error) {
      console.log(`\n❌ Test failed: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 LEVEL-UP TEST SUMMARY\n');
  console.log('Next: Run check-xp-levels.js to see final state\n');
}

testLevelUp().catch(console.error);
