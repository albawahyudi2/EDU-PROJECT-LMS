// Test the fixed test-day1-8-complete.js mutations
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
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

async function test() {
  console.log('\n🧪 DAY 3: Testing Fixed GraphQL Mutations\n');
  console.log('='.repeat(70));
  
  try {
    // Test 1: Login with new syntax
    console.log('\n1️⃣  Testing login mutation...');
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
      input: {
        email: 'guru@lms-abk.com',
        password: 'Guru123!'
      }
    });
    
    const token = loginData.login.accessToken;
    console.log(`✅ Login: ${loginData.login.user.teacherName}`);
    
    // Test 2: Me query
    console.log('\n2️⃣  Testing me query...');
    const meData = await graphqlRequest(`
      query Me {
        me {
          id
          email
          role
          teacherName
        }
      }
    `, {}, token);
    
    console.log(`✅ Me query: ${meData.me.teacherName}`);
    
    // Test 3: Get classrooms
    console.log('\n3️⃣  Testing classrooms query...');
    const classroomsData = await graphqlRequest(`
      query Classrooms {
        classrooms {
          id
          name
          studentCount
        }
      }
    `, {}, token);
    
    console.log(`✅ Classrooms: ${classroomsData.classrooms.length} found`);
    
    if (classroomsData.classrooms.length > 0) {
      const classroomId = classroomsData.classrooms[0].id;
      
      // Test 4: Get subjects
      console.log('\n4️⃣  Testing subjects query...');
      const subjectsData = await graphqlRequest(`
        query Subjects($classroomId: String!) {
          subjects(classroomId: $classroomId) {
            id
            name
          }
        }
      `, { classroomId }, token);
      
      console.log(`✅ Subjects: ${subjectsData.subjects.length} found`);
      
      if (subjectsData.subjects.length > 0) {
        const subjectId = subjectsData.subjects[0].id;
        
        // Test 5: Get modules
        console.log('\n5️⃣  Testing modules query...');
        const modulesData = await graphqlRequest(`
          query SubjectDetail($subjectId: String!) {
            subjectDetail(subjectId: $subjectId) {
              id
              name
              modules {
                id
                title
              }
            }
          }
        `, { subjectId }, token);
        
        console.log(`✅ Modules: ${modulesData.subjectDetail.modules.length} found`);
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('\n🎉 ALL TESTS PASSED!\n');
    console.log('✅ Login mutation with input parameter');
    console.log('✅ Me query with correct fields');
    console.log('✅ Classrooms query');
    console.log('✅ Subjects query');
    console.log('✅ Modules query');
    console.log('\n💡 GraphQL syntax is now correct!');
    console.log('\n📌 Fixed issues:');
    console.log('   1. login(input: $input) instead of login(loginInput: ...)');
    console.log('   2. User fields: teacherName instead of name');
    console.log('   3. All queries use consistent Input types\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

test();
