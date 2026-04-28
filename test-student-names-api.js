// Test if GraphQL API returns student names
const API_URL = 'http://localhost:3001/graphql';

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

async function test() {
  console.log('\n🧪 Testing Student Names via GraphQL API\n');
  console.log('='.repeat(70));
  
  try {
    // Login as teacher
    console.log('\n1️⃣  Logging in as teacher...');
    const loginData = await graphqlRequest(`
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          accessToken
          user {
            id
            email
            role
            teacherName
          }
        }
      }
    `, {
      input: { email: 'guru@lms-abk.com', password: 'Guru123!' }
    });
    
    const token = loginData.login.accessToken;
    console.log(`✅ Logged in: ${loginData.login.user.teacherName}`);
    
    // Query myStudents
    console.log('\n2️⃣  Fetching myStudents...');
    const studentsData = await graphqlRequest(`
      query MyStudents {
        myStudents {
          id
          userId
          level
          totalXP
          user {
            id
            email
            studentName
            parentName
            isActive
          }
        }
      }
    `, {}, token);
    
    console.log(`✅ Found ${studentsData.myStudents.length} students\n`);
    
    let withNames = 0;
    let withoutNames = 0;
    
    studentsData.myStudents.forEach((student, index) => {
      const name = student.user.studentName;
      const parent = student.user.parentName;
      
      console.log(`${index + 1}. ${student.user.email}`);
      console.log(`   Student Name: ${name || '❌ NULL'}`);
      console.log(`   Parent Name:  ${parent || '❌ NULL'}`);
      console.log(`   Level: ${student.level} | XP: ${student.totalXP}`);
      console.log('');
      
      if (name && parent) withNames++;
      else withoutNames++;
    });
    
    // Query classroomDetail
    console.log('\n3️⃣  Fetching classroom with students...');
    const classrooms = await graphqlRequest(`
      query Classrooms {
        classrooms {
          id
          name
        }
      }
    `, {}, token);
    
    if (classrooms.classrooms.length > 0) {
      const classroomId = classrooms.classrooms[0].id;
      const classroomData = await graphqlRequest(`
        query ClassroomDetail($classroomId: String!) {
          classroomDetail(classroomId: $classroomId) {
            id
            name
            students {
              student {
                id
                user {
                  email
                  studentName
                  parentName
                }
              }
            }
          }
        }
      `, { classroomId }, token);
      
      console.log(`✅ Classroom: ${classroomData.classroomDetail.name}`);
      console.log(`   Students enrolled: ${classroomData.classroomDetail.students.length}\n`);
      
      classroomData.classroomDetail.students.forEach((enrollment, index) => {
        const name = enrollment.student.user.studentName;
        const parent = enrollment.student.user.parentName;
        
        console.log(`   ${index + 1}. ${enrollment.student.user.email}`);
        console.log(`      Name: ${name || '❌ NULL'} (Parent: ${parent || '❌ NULL'})`);
      });
    }
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 Test Results:\n');
    console.log(`   ✅ Students with names via API: ${withNames}`);
    console.log(`   ❌ Students without names via API: ${withoutNames}`);
    
    if (withoutNames === 0) {
      console.log('\n✅ GraphQL API is returning student names correctly!');
      console.log('\n💡 Conclusion:');
      console.log('   Database has names ✅');
      console.log('   GraphQL API returns names ✅');
      console.log('   Issue might be in frontend data display logic\n');
    } else {
      console.log('\n❌ GraphQL API is NOT returning names!');
      console.log('\n🔧 Possible causes:');
      console.log('   1. Backend resolver not mapping fields correctly');
      console.log('   2. Cache issue');
      console.log('   3. Different query being used in production\n');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response?.errors) {
      console.log('\nGraphQL Errors:');
      error.response.errors.forEach(e => console.log(`  - ${e.message}`));
    }
  }
}

test();
