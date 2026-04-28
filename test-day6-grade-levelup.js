// DAY 6 Part 3: Grade video task submissions to award XP and trigger level-up
const API_URL = 'http://localhost:3001/graphql';

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

async function gradeAndVerifyLevelUp() {
  console.log('\n🎯 DAY 6 PART 3: Grade Tasks & Verify Level-Up\n');
  console.log('='.repeat(70));
  
  try {
    // 1. Login as teacher
    console.log('\n1️⃣  Logging in as teacher...');
    const loginData = await graphqlRequest(`
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          accessToken
          user {
            teacherName
          }
        }
      }
    `, {
      input: {
        email: 'guru@lms-abk.com',
        password: 'Guru123!'
      }
    });
    
    const token = loginData.login.accessToken;
    console.log(`✅ Logged in: ${loginData.login.user.teacherName}`);
    
    // 2. Get pending submissions from video task
    console.log('\n2️⃣  Getting pending submissions...');
    const pendingData = await graphqlRequest(`
      query PendingGrading {
        pendingGrading {
          id
          assignmentId
          studentId
          status
          submittedAt
          assignment {
            id
            title
            type
          }
          student {
            id
            level
            totalXP
            studentName
          }
        }
      }
    `, {}, token);
    
    const pending = pendingData.pendingGrading;
    console.log(`✅ Found ${pending.length} pending submissions`);
    
    // Filter only video task submissions
    const videoSubmissions = pending.filter(s => s.assignment.title === 'video');
    console.log(`   Video task submissions: ${videoSubmissions.length}\n`);
    
    if (videoSubmissions.length === 0) {
      console.log('⚠️  No video task submissions to grade!');
      return;
    }
    
    // 3. Grade each video submission
    console.log('3️⃣  Grading video task submissions...\n');
    
    const results = [];
    
    for (const submission of videoSubmissions) {
      const student = submission.student;
      console.log(`   Grading: ${student.studentName}`);
      console.log(`   Before: Level ${student.level}, ${student.totalXP} XP`);
      console.log(`   Assignment: ${submission.assignment.title} (+10 XP)`);
      
      // Grade with perfect score
      const gradeData = await graphqlRequest(`
        mutation GradeSubmission($input: GradeSubmissionInput!) {
          gradeSubmission(input: $input) {
            id
            score
            feedback
            gradedAt
          }
        }
      `, {
        input: {
          submissionId: submission.id,
          score: 100,
          feedback: 'Excellent work! Video task completed perfectly.'
        }
      }, token);
      
      console.log(`   ✅ Graded: ${gradeData.gradeSubmission.score}/100\n`);
      
      results.push({
        studentName: student.studentName,
        studentId: student.id,
        beforeLevel: student.level,
        beforeXP: student.totalXP,
        xpToGain: 10
      });
    }
    
    // 4. Verify level-up for each student
    console.log('4️⃣  Verifying level-up...\n');
    
    let leveledUp = 0;
    
    for (const result of results) {
      // Get updated student stats
      const studentData = await graphqlRequest(`
        query MyStudents {
          myStudents {
            id
            level
            totalXP
            currentXP
            user {
              studentName
            }
          }
        }
      `, {}, token);
      
      const student = studentData.myStudents.find(s => s.id === result.studentId);
      
      if (student) {
        const xpGained = student.totalXP - result.beforeXP;
        console.log(`   ${result.studentName}:`);
        console.log(`      Before: Level ${result.beforeLevel}, ${result.beforeXP} XP`);
        console.log(`      After:  Level ${student.level}, ${student.totalXP} XP`);
        console.log(`      Gained: +${xpGained} XP`);
        
        if (student.level > result.beforeLevel) {
          console.log(`      🎉 LEVEL UP! Now Level ${student.level}! 🎉\n`);
          leveledUp++;
        } else if (student.totalXP >= 100 && student.level === 1) {
          console.log(`      ⚠️  Has ${student.totalXP} XP but still Level 1 - Level-up bug!\n`);
        } else {
          console.log(`      📈 Progress: ${student.totalXP}/100 XP for Level 2\n`);
        }
      }
    }
    
    // Summary
    console.log('='.repeat(70));
    console.log('\n📊 FINAL RESULTS:\n');
    console.log(`Students graded: ${results.length}`);
    console.log(`Students leveled up: ${leveledUp}/${results.length}\n`);
    
    if (leveledUp === results.length) {
      console.log('✅ SUCCESS! All students reached Level 2!');
      console.log('✅ Level-up system is WORKING!\n');
    } else if (leveledUp > 0) {
      console.log('⚠️  Some students leveled up, but not all.');
      console.log('   May need to check XP calculation or grading logic.\n');
    } else {
      console.log('❌ FAILURE! No students leveled up.');
      console.log('   Level-up system may be broken or students need more XP.\n');
    }
    
    console.log('💡 Run: node check-xp-levels.js to see final state\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

gradeAndVerifyLevelUp().catch(console.error);
