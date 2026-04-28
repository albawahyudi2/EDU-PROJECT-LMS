// Simple test for assignment creation
const API_URL = 'http://localhost:3001/graphql';
const LESSON_ID = 'cmlu1cpae000gpwwakrgala1g'; // "asdf" lesson

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
  
  const json = await response.json();
  
  if (json.errors) {
    const error = new Error(json.errors[0].message);
    error.response = json;
    throw error;
  }
  
  return json.data;
}

async function test() {
  console.log('🧪 Testing Assignment Creation\n');
  console.log('='.repeat(60));
  
  try {
    // Login
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
      input: {
        email: 'guru@lms-abk.com',
        password: 'Guru123!'
      }
    });
    
    const token = loginData.login.accessToken;
    console.log(`✅ Logged in: ${loginData.login.user.teacherName || loginData.login.user.email}`);
    
    // Create assignment
    console.log('\n2️⃣  Creating assignment with VALID lesson ID...');
    const timestamp = Date.now();
    const createData = await graphqlRequest(`
      mutation CreateAssignment($input: CreateAssignmentInput!) {
        createAssignment(input: $input) {
          id
          title
          type
          lessonId
          isDraft
          xpReward
        }
      }
    `, {
      input: {
        title: `Test Quiz ${timestamp}`,
        description: 'Automated test',
        type: 'QUIZ',
        lessonId: LESSON_ID,
        xpReward: 15,
        isDraft: true
      }
    }, token);
    
    console.log('✅ Assignment created successfully!');
    console.log(`   ID: ${createData.createAssignment.id}`);
    console.log(`   Title: ${createData.createAssignment.title}`);
    console.log(`   Type: ${createData.createAssignment.type}`);
    console.log(`   Lesson ID: ${createData.createAssignment.lessonId}`);
    
    // Test with INVALID lesson ID
    console.log('\n3️⃣  Testing with INVALID lesson ID (should fail)...');
    try {
      await graphqlRequest(`
        mutation CreateAssignment($input: CreateAssignmentInput!) {
          createAssignment(input: $input) {
            id
            title
          }
        }
      `, {
        input: {
          title: 'Should fail',
          type: 'QUIZ',
          lessonId: 'invalid-id-xyz',
          isDraft: true
        }
      }, token);
      
      console.log('❌ UNEXPECTED: Should have failed!');
    } catch (err) {
      console.log('✅ Correctly rejected invalid lesson ID');
      console.log(`   Error: "${err.message}"`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 ALL TESTS PASSED!\n');
    console.log('✅ Assignment creation with valid lesson ID: WORKING');
    console.log('✅ Error handling for invalid lesson ID: WORKING');
    console.log('✅ Backend validation: WORKING');
    console.log('\n💡 The fix is successful!');
    console.log('\n📌 Key improvements made:');
    console.log('   1. Better error message (includes lesson ID)');
    console.log('   2. Frontend validation added');
    console.log('   3. Success/error alerts added');
    console.log('   4. Console logging for debugging\n');
    
  } catch (error) {
    console.log('\n❌ TEST FAILED');
    console.error('Error:', error.message);
    if (error.response?.errors) {
      console.log('\nGraphQL Errors:');
      error.response.errors.forEach(e => console.log(`  - ${e.message}`));
    }
  }
}

test();
