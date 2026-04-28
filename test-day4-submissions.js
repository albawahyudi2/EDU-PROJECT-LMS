// Test submission creation for all students
const API_URL = 'http://localhost:3001/graphql';

const students = [
  { email: 'siswa2@lms-abk.com', password: 'Siswa123!', name: 'Budi Santoso' },
  { email: 'siswa3@lms-abk.com', password: 'Siswa123!', name: 'Citra Dewi' },
  { email: 'siswa4@lms-abk.com', password: 'Siswa123!', name: 'Deni Kurniawan' }
];

// Assignment ID from check-submissions: "makan" (TASK_ANALYSIS) - 30 XP
const TEST_ASSIGNMENT_ID = 'cmlu1dk5t000ipwwakb281fq7';

async function graphqlRequest(query, variables = {}, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  
  const json = await response.json();
  if (json.errors) {
    const error = new Error(json.errors[0].message);
    error.response = json;
    throw error;
  }
  return json.data;
}

async function testSubmissionFlow() {
  console.log('\n🧪 DAY 4: Testing Submission Creation for All Students\n');
  console.log('='.repeat(70));
  
  let successCount = 0;
  let failCount = 0;
  
  for (const student of students) {
    console.log(`\n\n📝 Testing: ${student.name} (${student.email})`);
    console.log('-'.repeat(70));
    
    try {
      // Login
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
      
      // Check student profile
      console.log('\n2️⃣  Checking student profile...');
      const meData = await graphqlRequest(`
        query Me {
          me {
            id
            email
            studentName
            studentProfile {
              id
              level
              totalXP
              currentXP
            }
          }
        }
      `, {}, token);
      
      console.log(`✅ Student Profile:`);
      console.log(`   Level: ${meData.me.studentProfile.level}`);
      console.log(`   Total XP: ${meData.me.studentProfile.totalXP}`);
      
      // Get assignment detail
      console.log('\n3️⃣  Getting assignment detail...');
      const assignmentData = await graphqlRequest(`
        query AssignmentForStudent($assignmentId: String!) {
          assignmentForStudent(assignmentId: $assignmentId) {
            id
            title
            description
            type
            xpReward
            taskSteps {
              id
              stepNumber
              instruction
            }
          }
        }
      `, { assignmentId: TEST_ASSIGNMENT_ID }, token);
      
      console.log(`✅ Assignment: ${assignmentData.assignmentForStudent.title}`);
      console.log(`   Type: ${assignmentData.assignmentForStudent.type}`);
      console.log(`   XP Reward: ${assignmentData.assignmentForStudent.xpReward}`);
      console.log(`   Steps: ${assignmentData.assignmentForStudent.taskSteps.length}`);
      
      // Start submission
      console.log('\n4️⃣  Starting submission...');
      const startData = await graphqlRequest(`
        mutation StartSubmission($assignmentId: String!) {
          startSubmission(assignmentId: $assignmentId) {
            id
            status
            createdAt
          }
        }
      `, { assignmentId: TEST_ASSIGNMENT_ID }, token);
      
      const submissionId = startData.startSubmission.id;
      console.log(`✅ Submission started: ${submissionId}`);
      console.log(`   Status: ${startData.startSubmission.status}`);
      
      // Submit step (if TASK_ANALYSIS)
      if (assignmentData.assignmentForStudent.type === 'TASK_ANALYSIS') {
        console.log('\n5️⃣  Submitting task steps...');
        
        for (const step of assignmentData.assignmentForStudent.taskSteps) {
          try {
            await graphqlRequest(`
              mutation SubmitTaskStep($input: SubmitTaskStepInput!) {
                submitTaskStep(input: $input) {
                  id
                  stepId
                  photoUrl
                  status
                }
              }
            `, {
              input: {
                submissionId: submissionId,
                stepId: step.id,
                photoUrl: `https://example.com/photo-step-${step.stepNumber}.jpg`
              }
            }, token);
            
            console.log(`   ✅ Step ${step.stepNumber} submitted`);
          } catch (error) {
            console.log(`   ⚠️  Step ${step.stepNumber} failed: ${error.message}`);
          }
        }
      }
      
      // Mark as submitted
      console.log('\n6️⃣  Marking submission as complete...');
      const submitData = await graphqlRequest(`
        mutation CompleteTaskSubmission($submissionId: String!) {
          completeTaskSubmission(submissionId: $submissionId) {
            id
            status
            submittedAt
            score
          }
        }
      `, { submissionId }, token);
      
      console.log(`✅ Submission completed!`);
      console.log(`   Status: ${submitData.completeTaskSubmission.status}`);
      
      successCount++;
      console.log(`\n🎉 SUCCESS for ${student.name}!`);
      
    } catch (error) {
      failCount++;
      console.log(`\n❌ FAILED for ${student.name}`);
      console.log(`   Error: ${error.message}`);
      if (error.response?.errors) {
        console.log('   GraphQL Errors:');
        error.response.errors.forEach(e => console.log(`     - ${e.message}`));
      }
    }
  }
  
  // Final summary
  console.log('\n\n' + '='.repeat(70));
  console.log('\n📊 FINAL RESULTS:\n');
  console.log(`✅ Successful submissions: ${successCount}/${students.length}`);
  console.log(`❌ Failed submissions: ${failCount}/${students.length}`);
  
  if (successCount === students.length) {
    console.log('\n🎉 ALL STUDENTS CAN NOW SUBMIT ASSIGNMENTS!\n');
  } else {
    console.log('\n⚠️  Some students had issues. Review errors above.\n');
  }
}

testSubmissionFlow();
