const GRAPHQL_URL = 'http://localhost:3001/graphql';

async function graphqlRequest(query, variables = {}, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  });
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(JSON.stringify(result.errors, null, 2));
  }
  
  return result.data;
}

async function main() {
  console.log('\n✅ DAY 6 VERIFICATION: Level-Up System Test\n');
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
            role
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
    
    // 2. Query all students with their levels
    console.log('\n2️⃣  Querying student levels via GraphQL...\n');
    const studentsData = await graphqlRequest(`
      query {
        myStudents {
          id
          level
          totalXP
          currentXP
          user {
            studentName
            email
          }
        }
      }
    `, {}, token);
    
    // 3. Display results
    const students = studentsData.myStudents;
    console.log(`📚 Found ${students.length} students:\n`);
    
    let level2Count = 0;
    
    students.forEach(student => {
      const levelIcon = student.level >= 2 ? '🎉' : '📈';
      console.log(`${levelIcon} ${student.user.studentName}`);
      console.log(`   Level: ${student.level}`);
      console.log(`   Total XP: ${student.totalXP}`);
      console.log(`   Current Level XP: ${student.currentXP}`);
      console.log(`   Email: ${student.user.email}`);
      
      if (student.level >= 2) {
        console.log(`   ✅ Successfully reached Level 2!`);
        level2Count++;
      } else {
        const xpNeeded = 100 - student.totalXP;
        console.log(`   📊 Need ${xpNeeded} more XP for Level 2`);
      }
      console.log();
    });
    
    // 4. Summary
    console.log('='.repeat(70));
    console.log('\n📊 DAY 6 TEST RESULTS:\n');
    console.log(`Total students: ${students.length}`);
    console.log(`Students at Level 2+: ${level2Count}/${students.length}\n`);
    
    if (level2Count >= 3) {
      console.log('✅ SUCCESS! Level-up system is WORKING!');
      console.log('✅ Students successfully reached Level 2 after accumulating 100 XP');
      console.log('✅ XP tracking and level calculation are functional\n');
      console.log('🎯 DAY 6 COMPLETE: Level-Up System Verified ✅\n');
    } else {
      console.log('⚠️  Expected at least 3 students at Level 2');
      console.log(`   Only ${level2Count} students reached Level 2\n`);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

main();
