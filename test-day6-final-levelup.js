// DAY 6 Part 2: Final push to Level 2
// Submit "video" task (10 XP) and "makan" task (10 XP) for students to reach 100 XP

const API_URL = 'http://localhost:3001/graphql';

const students = [
  { email: 'siswa2@lms-abk.com', password: 'Siswa123!', name: 'Budi', currentXP: 80 },
  { email: 'siswa3@lms-abk.com', password: 'Siswa123!', name: 'Citra', currentXP: 80 },
  { email: 'siswa4@lms-abk.com', password: 'Siswa123!', name: 'Deni', currentXP: 80 }
];

// video task (10 XP)
const VIDEO_TASK_ID = 'cmlu5wk620009110wto7kb65o';

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

async function submitTaskWithSteps(assignmentId, token, taskTitle, xpReward) {
  // Get task details
  const taskData = await graphqlRequest(`
    query AssignmentForStudent($assignmentId: String!) {
      assignmentForStudent(assignmentId: $assignmentId) {
        id
        title
        type
        xpReward
        taskSteps {
          id
          stepNumber
          instruction
        }
      }
    }
  `, { assignmentId }, token);
  
  const task = taskData.assignmentForStudent;
  console.log(`   Task: "${task.title}" (${task.xpReward} XP, ${task.taskSteps.length} steps)`);
  
  // Start submission
  const startData = await graphqlRequest(`
    mutation StartSubmission($assignmentId: String!) {
      startSubmission(assignmentId: $assignmentId) {
        id
      }
    }
  `, { assignmentId }, token);
  
  const submissionId = startData.startSubmission.id;
  
  // Submit each step
  for (const step of task.taskSteps) {
    await graphqlRequest(`
      mutation SubmitTaskStep($input: SubmitTaskStepInput!) {
        submitTaskStep(input: $input) {
          id
          status
        }
      }
    `, {
      input: {
        submissionId: submissionId,
        stepId: step.id,
        photoUrl: 'https://via.placeholder.com/300',
        videoUrl: 'https://via.placeholder.com/video.mp4'
      }
    }, token);
  }
  
  // Complete task submission
  await graphqlRequest(`
    mutation CompleteTaskSubmission($submissionId: String!) {
      completeTaskSubmission(submissionId: $submissionId) {
        id
        status
      }
    }
  `, { submissionId }, token);
  
  return submissionId;
}

async function testFinalLevelUp() {
  console.log('\n🎯 DAY 6 FINAL: Pushing to Level 2!\n');
  console.log('='.repeat(70));
  console.log('\n📋 Goal: Submit "video" task (10 XP) to reach 100 XP → Level 2\n');
  
  const results = [];
  
  for (const student of students) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`\n🎯 ${student.name} (Current: ${student.currentXP} XP, Level 1)`);
    console.log(`   Needs: 20 XP to reach Level 2\n`);
    
    try {
      // Login
      console.log('1️⃣  Logging in...');
      const loginData = await graphqlRequest(`
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
            user {
              id
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
      
      // Get current stats
      console.log('\n2️⃣  Current stats...');
      const beforeData = await graphqlRequest(`
        query Me {
          me {
            studentProfile {
              level
              totalXP
            }
          }
        }
      `, {}, token);
      
      const before = beforeData.me.studentProfile;
      console.log(`   Level: ${before.level}, XP: ${before.totalXP}`);
      
      // Submit video task
      console.log('\n3️⃣  Submitting "video" task...');
      await submitTaskWithSteps(VIDEO_TASK_ID, token, 'video', 10);
      console.log(`   ✅ Task completed!`);
      console.log(`   +10 XP earned`);
      
      // Check updated stats
      console.log('\n4️⃣  Checking updated stats...');
      const afterData = await graphqlRequest(`
        query Me {
          me {
            studentProfile {
              level
              totalXP
            }
          }
        }
      `, {}, token);
      
      const after = afterData.me.studentProfile;
      const xpGained = after.totalXP - before.totalXP;
      
      console.log(`\n   📊 RESULTS:`);
      console.log(`   Before: Level ${before.level}, ${before.totalXP} XP`);
      console.log(`   After:  Level ${after.level}, ${after.totalXP} XP`);
      console.log(`   Gained: +${xpGained} XP`);
      
      let status = '';
      if (after.totalXP >= 100 && after.level === 2) {
        console.log(`\n   🎉🎉🎉 LEVEL UP! ${student.name} is now Level 2! 🎉🎉🎉`);
        status = '✅ LEVEL 2 ACHIEVED';
      } else if (after.totalXP >= 100 && after.level === 1) {
        console.log(`\n   ⚠️  Has ${after.totalXP} XP but still Level 1`);
        console.log(`   ❌ Auto level-up NOT working!`);
        status = '❌ Level-up FAILED';
      } else {
        console.log(`\n   📈 Progress: ${after.totalXP}/100 XP`);
        console.log(`   Still need: ${100 - after.totalXP} XP for Level 2`);
        status = `⏳ ${after.totalXP}/100 XP`;
      }
      
      results.push({
        name: student.name,
        beforeXP: before.totalXP,
        afterXP: after.totalXP,
        level: after.level,
        status
      });
      
    } catch (error) {
      console.log(`\n❌ Test failed: ${error.message}`);
      results.push({
        name: student.name,
        status: `❌ Error: ${error.message}`
      });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 FINAL LEVEL-UP TEST SUMMARY\n');
  
  results.forEach(r => {
    if (r.level) {
      console.log(`${r.name}: ${r.beforeXP} XP → ${r.afterXP} XP (Level ${r.level}) ${r.status}`);
    } else {
      console.log(`${r.name}: ${r.status}`);
    }
  });
  
  const leveledUp = results.filter(r => r.status?.includes('LEVEL 2')).length;
  console.log(`\n🎯 Result: ${leveledUp}/${students.length} students reached Level 2\n`);
  
  if (leveledUp === students.length) {
    console.log('✅ Level-up system is WORKING!\n');
  } else if (leveledUp === 0 && results.every(r => r.afterXP >= 100)) {
    console.log('❌ Level-up system is BROKEN (students have 100+ XP but still Level 1)\n');
  } else {
    console.log('⚠️  Mixed results - may need more XP or code investigation\n');
  }
}

testFinalLevelUp().catch(console.error);
