/**
 * COMPREHENSIVE AUTOMATED TEST SUITE - DAY 13-14
 * 
 * This script automatically tests GraphQL API functionality
 * Run: node test-day13-14-comprehensive.js
 * 
 * Covers: Authentication, Assignments, Grading, Progress, Reports, Notes
 */

const API_URL = process.env.API_URL || 'https://edu-project-lms-production.up.railway.app/graphql';

// Test accounts
const testAccounts = {
  teacher: { email: 'guru@lms-abk.com', password: 'password123' },
  student: { email: 'siswa1@lms-abk.com', password: 'password123' },
};

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  suites: {},
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(suite, test, passed, notes = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    log(`  ✅ ${test} ${notes}`, 'green');
  } else {
    testResults.failed++;
    log(`  ❌ ${test} ${notes}`, 'red');
  }
  
  if (!testResults.suites[suite]) {
    testResults.suites[suite] = { total: 0, passed: 0, failed: 0 };
  }
  testResults.suites[suite].total++;
  if (passed) {
    testResults.suites[suite].passed++;
  } else {
    testResults.suites[suite].failed++;
  }
}

async function graphqlRequest(query, variables = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
    
    const data = await response.json();
    
    if (data.errors) {
      console.log('      GraphQL Errors:', JSON.stringify(data.errors, null, 2));
      return { success: false, errors: data.errors, data: data.data };
    }
    
    return { success: true, data: data.data };
  } catch (error) {
    console.log('      Fetch Error:', error.message);
    return { success: false, error: error.message };
  }
}

// =================================================================================
// SUITE 1: AUTHENTICATION TESTS
// =================================================================================
async function runAuthenticationTests() {
  log('\n📋 SUITE 1: AUTHENTICATION TESTS', 'cyan');
  log('=' .repeat(70), 'cyan');
  
  const suite = 'Authentication';
  
  // Test 1.1: Successful Login - Teacher
  try {
    const query = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
          user {
            id
            email
            name
            role
          }
        }
      }
    `;
    
    const result = await graphqlRequest(query, testAccounts.teacher);
    const success = result.success && result.data.login.accessToken && result.data.login.user.role === 'TEACHER';
    logTest(suite, 'Test 1.1: Teacher Login', success);
    
    if (success) {
      testAccounts.teacher.token = result.data.login.accessToken;
      testAccounts.teacher.user = result.data.login.user;
    }
  } catch (error) {
    logTest(suite, 'Test 1.1: Teacher Login', false, `Error: ${error.message}`);
  }
  
  // Test 1.2: Successful Login - Student
  try {
    const query = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
          user {
            id
            email
            name
            role
          }
        }
      }
    `;
    
    const result = await graphqlRequest(query, testAccounts.student);
    const success = result.success && result.data.login.accessToken && result.data.login.user.role === 'STUDENT_PARENT';
    logTest(suite, 'Test 1.2: Student Login', success);
    
    if (success) {
      testAccounts.student.token = result.data.login.accessToken;
      testAccounts.student.user = result.data.login.user;
    }
  } catch (error) {
    logTest(suite, 'Test 1.2: Student Login', false, `Error: ${error.message}`);
  }
  
  // Test 1.3: Failed Login - Invalid Credentials
  try {
    const query = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
        }
      }
    `;
    
    const result = await graphqlRequest(query, { email: 'invalid@example.com', password: 'wrong' });
    const success = !result.success || result.errors;
    logTest(suite, 'Test 1.3: Invalid Login (should fail)', success);
  } catch (error) {
    logTest(suite, 'Test 1.3: Invalid Login', true, '(Expected failure)');
  }
  
  // Test 1.4: Get Current User (Teacher)
  try {
    const query = `
      query Me {
        me {
          id
          name
          email
          role
        }
      }
    `;
    
    const result = await graphqlRequest(query, {}, testAccounts.teacher.token);
    const success = result.success && result.data.me.id === testAccounts.teacher.user.id;
    logTest(suite, 'Test 1.4: Get Current User (Teacher)', success);
  } catch (error) {
    logTest(suite, 'Test 1.4: Get Current User', false, `Error: ${error.message}`);
  }
  
  // Test 1.5: Get Current User (Student)
  try {
    const query = `
      query Me {
        me {
          id
          name
          email
          role
        }
      }
    `;
    
    const result = await graphqlRequest(query, {}, testAccounts.student.token);
    const success = result.success && result.data.me.id === testAccounts.student.user.id;
    logTest(suite, 'Test 1.5: Get Current User (Student)', success);
  } catch (error) {
    logTest(suite, 'Test 1.5: Get Current User', false, `Error: ${error.message}`);
  }
  
  // Test 1.6: Unauthorized Access (no token)
  try {
    const query = `
      query Me {
        me {
          id
        }
      }
    `;
    
    const result = await graphqlRequest(query, {}, null);
    const success = !result.success || result.errors;
    logTest(suite, 'Test 1.6: Unauthorized Access (should fail)', success);
  } catch (error) {
    logTest(suite, 'Test 1.6: Unauthorized Access', true, '(Expected failure)');
  }
}

// =================================================================================
// SUITE 2: TEACHER DASHBOARD TESTS
// =================================================================================
async function runTeacherDashboardTests() {
  log('\n📋 SUITE 2: TEACHER DASHBOARD TESTS', 'cyan');
  log('=' .repeat(70), 'cyan');
  
  const suite = 'Teacher Dashboard';
  
  // Test 2.1: Get Teacher's Students
  try {
    const query = `
      query MyStudents {
        myStudents {
          id
          name
          email
          totalXP
          currentLevel
        }
      }
    `;
    
    const result = await graphqlRequest(query, {}, testAccounts.teacher.token);
    const success = result.success && Array.isArray(result.data.myStudents) && result.data.myStudents.length >= 4;
    logTest(suite, 'Test 2.1: Get My Students', success, `(Found ${result.data?.myStudents?.length || 0} students)`);
    
    if (success) {
      testAccounts.students = result.data.myStudents;
    }
  } catch (error) {
    logTest(suite, 'Test 2.1: Get My Students', false, `Error: ${error.message}`);
  }
  
  // Test 2.2: Get Student Detail
  if (testAccounts.students && testAccounts.students.length > 0) {
    try {
      const studentId = testAccounts.students[0].id;
      const query = `
        query StudentDetail($id: String!) {
          student(id: $id) {
            id
            name
            totalXP
            currentLevel
          }
        }
      `;
      
      const result = await graphqlRequest(query, { id: studentId }, testAccounts.teacher.token);
      const success = result.success && result.data.student.id === studentId;
      logTest(suite, 'Test 2.2: Get Student Detail', success);
    } catch (error) {
      logTest(suite, 'Test 2.2: Get Student Detail', false, `Error: ${error.message}`);
    }
  } else {
    logTest(suite, 'Test 2.2: Get Student Detail', false, 'No students found');
  }
  
  // Test 2.3: Get Classrooms
  try {
    const query = `
      query MyClassrooms {
        myClassrooms {
          id
          name
          description
        }
      }
    `;
    
    const result = await graphqlRequest(query, {}, testAccounts.teacher.token);
    const success = result.success && Array.isArray(result.data.myClassrooms);
    logTest(suite, 'Test 2.3: Get My Classrooms', success, `(Found ${result.data?.myClassrooms?.length || 0} classrooms)`);
    
    if (success && result.data.myClassrooms.length > 0) {
      testAccounts.classroom = result.data.myClassrooms[0];
    }
  } catch (error) {
    logTest(suite, 'Test 2.3: Get My Classrooms', false, `Error: ${error.message}`);
  }
  
  // Test 2.4: Get Pending Submissions
  try {
    const query = `
      query PendingSubmissions {
        pendingGrading {
          id
          content
          status
          student {
            name
          }
          assignment {
            title
          }
        }
      }
    `;
    
    const result = await graphqlRequest(query, {}, testAccounts.teacher.token);
    const success = result.success && Array.isArray(result.data.pendingGrading);
    logTest(suite, 'Test 2.4: Get Pending Grading', success, `(Found ${result.data?.pendingGrading?.length || 0} pending)`);
    
    if (success && result.data.pendingGrading.length > 0) {
      testAccounts.pendingSubmission = result.data.pendingGrading[0];
    }
  } catch (error) {
    logTest(suite, 'Test 2.4: Get Pending Grading', false, `Error: ${error.message}`);
  }
}

// =================================================================================
// SUITE 3: PROGRESS & GAMIFICATION TESTS
// =================================================================================
async function runProgressTests() {
  log('\n📋 SUITE 3: PROGRESS & GAMIFICATION TESTS', 'cyan');
  log('=' .repeat(70), 'cyan');
  
  const suite = 'Progress & Gamification';
  
  // Test 3.1: Get Student Stats (Teacher View)
  if (testAccounts.students && testAccounts.students.length > 0) {
    try {
      const studentId = testAccounts.students[0].id;
      const query = `
        query StudentStats($studentId: String!) {
          studentStats(studentId: $studentId) {
            totalXP
            currentLevel
            xpForNextLevel
            progressToNextLevel
          }
        }
      `;
      
      const result = await graphqlRequest(query, { studentId }, testAccounts.teacher.token);
      const success = result.success && result.data.studentStats.totalXP !== undefined;
      logTest(suite, 'Test 3.1: Get Student Stats', success, 
        success ? `(Level ${result.data.studentStats.currentLevel}, ${result.data.studentStats.totalXP} XP)` : '');
    } catch (error) {
      logTest(suite, 'Test 3.1: Get Student Stats', false, `Error: ${error.message}`);
    }
  } else {
    logTest(suite, 'Test 3.1: Get Student Stats', false, 'No students available');
  }
  
  // Test 3.2: Get Student Progress (Student View)
  try {
    const query = `
      query MyStats {
        studentStats {
          totalXP
          currentLevel
          xpForNextLevel
          progressToNextLevel
        }
      }
    `;
    
    const result = await graphqlRequest(query, {}, testAccounts.student.token);
    const success = result.success && result.data.studentStats;
    logTest(suite, 'Test 3.2: Get Own Stats (Student)', success,
      success ? `(Level ${result.data.studentStats.currentLevel}, ${result.data.studentStats.totalXP} XP)` : '');
  } catch (error) {
    logTest(suite, 'Test 3.2: Get Own Stats', false, `Error: ${error.message}`);
  }
  
  // Test 3.3: Check XP Calculation Logic
  if (testAccounts.students && testAccounts.students.length > 0) {
    try {
      const student = testAccounts.students[0];
      const expectedLevel = Math.floor(student.totalXP / 100) + 1;
      const success = student.currentLevel === expectedLevel;
      logTest(suite, 'Test 3.3: XP Calculation Logic', success,
        success ? `(${student.totalXP} XP → Level ${student.currentLevel})` : 
        `(Expected Level ${expectedLevel}, got ${student.currentLevel})`);
    } catch (error) {
      logTest(suite, 'Test 3.3: XP Calculation Logic', false, `Error: ${error.message}`);
    }
  }
}

// =================================================================================
// SUITE 4: DAILY REPORTS & NOTES TESTS
// =================================================================================
async function runReportsNotesTests() {
  log('\n📋 SUITE 4: DAILY REPORTS & NOTES TESTS', 'cyan');
  log('=' .repeat(70), 'cyan');
  
  const suite = 'Daily Reports & Notes';
  
  // Test 4.1: Query Daily Reports (Teacher)
  if (testAccounts.students && testAccounts.students.length > 0) {
    try {
      const studentId = testAccounts.students[0].id;
      const query = `
        query GetDailyReports($studentId: String!) {
          dailyReportsByStudent(studentId: $studentId, limit: 10) {
            id
            date
            mood
            activities
            notes
          }
        }
      `;
      
      const result = await graphqlRequest(query, { studentId }, testAccounts.teacher.token);
      const success = result.success && Array.isArray(result.data.dailyReportsByStudent);
      logTest(suite, 'Test 4.1: Query Daily Reports', success,
        `(Found ${result.data?.dailyReportsByStudent?.length || 0} reports)`);
    } catch (error) {
      logTest(suite, 'Test 4.1: Query Daily Reports', false, `Error: ${error.message}`);
    }
  }
  
  // Test 4.2: Query Teacher Notes
  if (testAccounts.students && testAccounts.students.length > 0) {
    try {
      const studentId = testAccounts.students[0].id;
      const query = `
        query GetNotes($studentId: String!) {
          notesByStudent(studentId: $studentId) {
            id
            content
            createdAt
            author {
              name
              role
            }
          }
        }
      `;
      
      const result = await graphqlRequest(query, { studentId }, testAccounts.teacher.token);
      const success = result.success && Array.isArray(result.data.notesByStudent);
      logTest(suite, 'Test 4.2: Query Teacher Notes', success,
        `(Found ${result.data?.notesByStudent?.length || 0} notes)`);
    } catch (error) {
      logTest(suite, 'Test 4.2: Query Teacher Notes', false, `Error: ${error.message}`);
    }
  }
  
  // Test 4.3: Recent Notes for Teacher
  try {
    const query = `
      query RecentNotes($limit: Float!) {
        recentNotesForTeacher(limit: $limit) {
          id
          content
          createdAt
          student {
            name
          }
        }
      }
    `;
    
    const result = await graphqlRequest(query, { limit: 5 }, testAccounts.teacher.token);
    const success = result.success && Array.isArray(result.data.recentNotesForTeacher);
    logTest(suite, 'Test 4.3: Recent Notes Dashboard', success,
      `(Found ${result.data?.recentNotesForTeacher?.length || 0} recent notes)`);
  } catch (error) {
    logTest(suite, 'Test 4.3: Recent Notes Dashboard', false, `Error: ${error.message}`);
  }
}

// =================================================================================
// SUITE 5: DATA VALIDATION & ERROR HANDLING
// =================================================================================
async function runValidationTests() {
  log('\n📋 SUITE 5: DATA VALIDATION & ERROR HANDLING', 'cyan');
  log('=' .repeat(70), 'cyan');
  
  const suite = 'Validation & Errors';
  
  // Test 5.1: Query with Invalid ID
  try {
    const query = `
      query StudentDetail($id: String!) {
        student(id: $id) {
          id
          name
        }
      }
    `;
    
    const result = await graphqlRequest(query, { id: 'invalid-id-12345' }, testAccounts.teacher.token);
    const success = !result.success || result.errors || result.data.student === null;
    logTest(suite, 'Test 5.1: Invalid Student ID (should fail)', success);
  } catch (error) {
    logTest(suite, 'Test 5.1: Invalid Student ID', true, '(Expected failure)');
  }
  
  // Test 5.2: Unauthorized Query (Student accessing teacher data)
  try {
    const query = `
      query PendingSubmissions {
        pendingGrading {
          id
        }
      }
    `;
    
    const result = await graphqlRequest(query, {}, testAccounts.student.token);
    const success = !result.success || result.errors;
    logTest(suite, 'Test 5.2: Unauthorized Access (should fail)', success);
  } catch (error) {
    logTest(suite, 'Test 5.2: Unauthorized Access', true, '(Expected failure)');
  }
  
  // Test 5.3: Malformed GraphQL Query
  try {
    const query = `
      query {
        invalidQuery {
          nonExistentField
        }
      }
    `;
    
    const result = await graphqlRequest(query, {}, testAccounts.teacher.token);
    const success = !result.success || result.errors;
    logTest(suite, 'Test 5.3: Malformed Query (should fail)', success);
  } catch (error) {
    logTest(suite, 'Test 5.3: Malformed Query', true, '(Expected failure)');
  }
}

// =================================================================================
// MAIN EXECUTION
// =================================================================================
async function runAllTests() {
  log('\n' + '='.repeat(70), 'blue');
  log('  🧪 COMPREHENSIVE AUTOMATED TEST SUITE - DAY 13-14', 'blue');
  log('  Date: ' + new Date().toLocaleDateString(), 'blue');
  log('  API: ' + API_URL, 'blue');
  log('=' .repeat(70) + '\n', 'blue');
  
  const startTime = Date.now();
  
  try {
    await runAuthenticationTests();
    await runTeacherDashboardTests();
    await runProgressTests();
    await runReportsNotesTests();
    await runValidationTests();
  } catch (error) {
    log(`\n❌ Test suite failed with error: ${error.message}`, 'red');
    console.error(error);
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  // Print summary
  log('\n' + '='.repeat(70), 'blue');
  log('  📊 TEST RESULTS SUMMARY', 'blue');
  log('=' .repeat(70), 'blue');
  
  log(`\n  Total Tests: ${testResults.total}`, 'white');
  log(`  Passed: ${testResults.passed}`, 'green');
  log(`  Failed: ${testResults.failed}`, 'red');
  log(`  Pass Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 
    testResults.failed === 0 ? 'green' : 'yellow');
  log(`  Duration: ${duration}s`, 'white');
  
  // Suite breakdown
  log('\n  📋 BY SUITE:', 'cyan');
  Object.entries(testResults.suites).forEach(([suite, results]) => {
    const passRate = ((results.passed / results.total) * 100).toFixed(0);
    const color = results.failed === 0 ? 'green' : 'yellow';
    log(`    ${suite}: ${results.passed}/${results.total} (${passRate}%)`, color);
  });
  
  // Overall status
  log('\n' + '='.repeat(70), 'blue');
  if (testResults.failed === 0) {
    log('  🎉 ALL TESTS PASSED! System is fully functional!', 'green');
  } else if (testResults.passed >= testResults.total * 0.8) {
    log('  ⚠️  MOSTLY PASSING - Some issues need attention', 'yellow');
  } else {
    log('  ❌ CRITICAL ISSUES - Multiple tests failing', 'red');
  }
  log('=' .repeat(70) + '\n', 'blue');
  
  // Exit code
  process.exit(testResults.failed === 0 ? 0 : 1);
}

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
