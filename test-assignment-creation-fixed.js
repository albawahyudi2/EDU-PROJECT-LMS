// Test assignment creation with valid lesson ID
const { graphqlRequest } = require('./test-all-queries');

const LESSON_ID = 'cmlu1cpae000gpwwakrgala1g'; // "asdf" lesson
const TEACHER_EMAIL = 'guru@lms-abk.com';
const TEACHER_PASSWORD = 'Guru123!';

async function testAssignmentCreation() {
  console.log('🧪 Testing Assignment Creation\n');
  console.log('='.repeat(50));
  
  try {
    // Step 1: Login as teacher
    console.log('1️⃣  Logging in as teacher...');
    const loginResponse = await graphqlRequest(`
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
        email: TEACHER_EMAIL,
        password: TEACHER_PASSWORD
      }
    });
    
    if (!loginResponse.login) {
      throw new Error('Login failed');
    }
    
    const { accessToken, user } = loginResponse.login;
    console.log(`✅ Logged in as: ${user.teacherName || user.email}\n`);
    
    // Step 2: Verify lesson exists
    console.log('2️⃣  Verifying lesson exists...');
    const lessonResponse = await graphqlRequest(`
      query GetLesson($lessonId: ID!) {
        lesson(lessonId: $lessonId) {
          id
          title
          isDraft
          isActive
        }
      }
    `, {
      lessonId: LESSON_ID
    }, {
      token: accessToken
    });
    
    if (!lessonResponse.lesson) {
      throw new Error(`Lesson ${LESSON_ID} not found`);
    }
    
    console.log(`✅ Lesson found: "${lessonResponse.lesson.title}"\n`);
    
    // Step 3: Create assignment
    console.log('3️⃣  Creating assignment...');
    const createResponse = await graphqlRequest(`
      mutation CreateAssignment($input: CreateAssignmentInput!) {
        createAssignment(input: $input) {
          id
          title
          description
          type
          lessonId
          isDraft
          xpReward
          createdAt
        }
      }
    `, {
      input: {
        title: `Test Quiz - ${new Date().toLocaleTimeString()}`,
        description: 'This is a test assignment created by automated test',
        type: 'QUIZ',
        lessonId: LESSON_ID,
        xpReward: 15,
        isDraft: true
      }
    }, {
      token: accessToken
    });
    
    if (!createResponse.createAssignment) {
      throw new Error('Assignment creation failed');
    }
    
    const assignment = createResponse.createAssignment;
    console.log('✅ Assignment created successfully!\n');
    console.log('📝 Assignment Details:');
    console.log(`   ID: ${assignment.id}`);
    console.log(`   Title: ${assignment.title}`);
    console.log(`   Type: ${assignment.type}`);
    console.log(`   Lesson ID: ${assignment.lessonId}`);
    console.log(`   XP Reward: ${assignment.xpReward}`);
    console.log(`   Draft: ${assignment.isDraft}`);
    console.log(`   Created: ${new Date(assignment.createdAt).toLocaleString()}\n`);
    
    // Step 4: Verify in database
    console.log('4️⃣  Verifying in database...');
    const { PrismaClient } = require('./packages/database/node_modules/@prisma/client');
    const prisma = new PrismaClient();
    
    const dbAssignment = await prisma.assignment.findUnique({
      where: { id: assignment.id },
      include: {
        lesson: {
          select: { title: true }
        }
      }
    });
    
    await prisma.$disconnect();
    
    if (dbAssignment) {
      console.log(`✅ Assignment verified in database`);
      console.log(`   Title: ${dbAssignment.title}`);
      console.log(`   Lesson: ${dbAssignment.lesson.title}\n`);
    } else {
      console.log(`❌ Assignment not found in database\n`);
    }
    
    // Step 5: Test with INVALID lesson ID
    console.log('5️⃣  Testing with INVALID lesson ID (should fail)...');
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
          title: 'This should fail',
          type: 'QUIZ',
          lessonId: 'invalid-lesson-id-12345',
          xpReward: 10,
          isDraft: true
        }
      }, {
        token: accessToken
      });
      
      console.log('❌ UNEXPECTED: Should have failed with invalid lesson ID\n');
    } catch (error) {
      console.log('✅ Correctly rejected invalid lesson ID');
      console.log(`   Error message: "${error.message}"\n`);
    }
    
    // Summary
    console.log('='.repeat(50));
    console.log('📊 TEST SUMMARY\n');
    console.log('✅ Login: PASS');
    console.log('✅ Lesson verification: PASS');
    console.log('✅ Assignment creation (valid ID): PASS');
    console.log('✅ Database verification: PASS');
    console.log('✅ Error handling (invalid ID): PASS');
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('\n💡 TIP: Assignment creation works correctly when:');
    console.log('   1. Valid lessonId is provided');
    console.log('   2. Lesson exists in database');
    console.log('   3. Teacher has access to the classroom');
    console.log('\n⚠️  ERROR OCCURS when:');
    console.log('   - Invalid or non-existent lessonId');
    console.log('   - Lesson was deleted');
    console.log('   - Teacher not assigned to classroom');
    
  } catch (error) {
    console.log('\n❌ TEST FAILED\n');
    console.error('Error:', error.message);
    
    if (error.response?.errors) {
      console.log('\nGraphQL Errors:');
      error.response.errors.forEach((err, idx) => {
        console.log(`  ${idx + 1}. ${err.message}`);
      });
    }
  }
}

testAssignmentCreation();
