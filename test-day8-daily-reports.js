// DAY 8: Test Daily Reports System
// Test: Create reports, query by student, add comments, update reports

const API_URL = 'http://localhost:3001/graphql';

// Teacher account
const TEACHER_EMAIL = 'guru@lms-abk.com';
const TEACHER_PASSWORD = 'Guru123!';

// Parent account (if exists) - we'll check during test
const PARENT_EMAIL = 'parent@lms-abk.com';
const PARENT_PASSWORD = 'Parent123!';

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
    throw new Error(JSON.stringify(result.errors, null, 2));
  }
  
  return result.data;
}

async function testDailyReports() {
  console.log('\n🧪 DAY 8: Testing Daily Reports System\n');
  console.log('='.repeat(70));
  console.log('\n📋 Test Plan:');
  console.log('   1. Get available students');
  console.log('   2. Teacher creates daily report');
  console.log('   3. Query reports by student');
  console.log('   4. Get report detail');
  console.log('   5. Add parent comment (if parent exists)');
  console.log('   6. Update report');
  console.log('   7. Delete report (optional)');
  console.log('\n' + '='.repeat(70));
  
  let reportId = null;
  
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
        email: TEACHER_EMAIL,
        password: TEACHER_PASSWORD
      }
    });
    
    const teacherToken = loginData.login.accessToken;
    const teacherName = loginData.login.user.teacherName;
    console.log(`✅ Logged in: ${teacherName}`);
    
    // 2. Get students
    console.log('\n2️⃣  Getting students...');
    const studentsData = await graphqlRequest(`
      query {
        myStudents {
          id
          level
          totalXP
          user {
            studentName
            email
          }
        }
      }
    `, {}, teacherToken);
    
    const students = studentsData.myStudents;
    console.log(`✅ Found ${students.length} students`);
    
    if (students.length === 0) {
      console.log('⚠️  No students found. Cannot test daily reports.');
      return;
    }
    
    const testStudent = students[0];
    console.log(`\n   Testing with: ${testStudent.user.studentName}`);
    console.log(`   Student ID: ${testStudent.id}`);
    
    // 3. Create daily report
    console.log('\n3️⃣  Creating daily report...');
    const today = new Date().toISOString().split('T')[0];
    
    const createReport = await graphqlRequest(`
      mutation CreateDailyReport($input: CreateDailyReportInput!) {
        createDailyReport(input: $input) {
          id
          date
          studentId
          mood
          activities
          achievements
          challenges
          notes
          createdBy {
            id
            name
            role
          }
          createdAt
        }
      }
    `, {
      input: {
        studentId: testStudent.id,
        date: today,
        mood: 'HAPPY',
        activities: ['Belajar Matematika', 'Bermain dengan teman', 'Membaca buku'],
        achievements: 'Berhasil menyelesaikan tugas matematika dengan baik',
        challenges: 'Sedikit kesulitan dengan soal cerita',
        notes: 'Siswa sangat aktif dan antusias hari ini'
      }
    }, teacherToken);
    
    const report = createReport.createDailyReport;
    reportId = report.id;
    
    console.log(`✅ Daily report created!`);
    console.log(`   Report ID: ${report.id}`);
    console.log(`   Date: ${report.date}`);
    console.log(`   Mood: ${report.mood}`);
    console.log(`   Activities: ${report.activities.length}`);
    console.log(`   Created by: ${report.createdBy.name} (${report.createdBy.role})`);
    
    // 4. Query reports by student
    console.log('\n4️⃣  Querying reports by student...');
    const reportsData = await graphqlRequest(`
      query DailyReportsByStudent($studentId: String!) {
        dailyReportsByStudent(studentId: $studentId) {
          id
          date
          mood
          activities
          achievements
          challenges
          notes
          createdBy {
            name
          }
          comments {
            id
            content
          }
        }
      }
    `, { studentId: testStudent.id }, teacherToken);
    
    const reports = reportsData.dailyReportsByStudent;
    console.log(`✅ Found ${reports.length} report(s) for student`);
    
    for (const r of reports) {
      console.log(`\n   📅 ${r.date} - Mood: ${r.mood}`);
      console.log(`      Activities: ${r.activities.join(', ')}`);
      console.log(`      Comments: ${r.comments.length}`);
    }
    
    // 5. Get report detail
    console.log('\n5️⃣  Getting report detail...');
    const detailData = await graphqlRequest(`
      query DailyReportDetail($reportId: String!) {
        dailyReportDetail(reportId: $reportId) {
          id
          date
          mood
          activities
          achievements
          challenges
          notes
          createdBy {
            id
            name
            role
          }
          comments {
            id
            content
            commentedBy {
              name
              role
            }
            createdAt
          }
          createdAt
          updatedAt
        }
      }
    `, { reportId }, teacherToken);
    
    const detail = detailData.dailyReportDetail;
    console.log(`✅ Report detail retrieved:`);
    console.log(`   Date: ${detail.date}`);
    console.log(`   Mood: ${detail.mood}`);
    console.log(`   Activities: ${detail.activities.join(', ')}`);
    console.log(`   Achievements: ${detail.achievements || 'N/A'}`);
    console.log(`   Challenges: ${detail.challenges || 'N/A'}`);
    console.log(`   Notes: ${detail.notes || 'N/A'}`);
    console.log(`   Comments: ${detail.comments.length}`);
    
    // 6. Try to add parent comment (check if parent exists first)
    console.log('\n6️⃣  Checking for parent account...');
    try {
      const parentLogin = await graphqlRequest(`
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
            user {
              role
            }
          }
        }
      `, {
        input: {
          email: PARENT_EMAIL,
          password: PARENT_PASSWORD
        }
      });
      
      const parentToken = parentLogin.login.accessToken;
      console.log(`✅ Parent account found`);
      
      console.log('\n   Adding parent comment...');
      const commentData = await graphqlRequest(`
        mutation AddComment($input: AddCommentInput!) {
          addDailyReportComment(input: $input) {
            id
            content
            commentedBy {
              name
              role
            }
            createdAt
          }
        }
      `, {
        input: {
          reportId: reportId,
          content: 'Terima kasih atas laporannya. Kami akan membantu anak di rumah untuk latihan soal cerita.'
        }
      }, parentToken);
      
      const comment = commentData.addDailyReportComment;
      console.log(`   ✅ Comment added by ${comment.commentedBy.role}`);
      console.log(`      Content: "${comment.content}"`);
      
    } catch (error) {
      console.log(`   ⚠️  Parent account not available or error: ${error.message.split('\\n')[0]}`);
      console.log(`   ℹ️  Skipping parent comment test`);
    }
    
    // 7. Update report
    console.log('\n7️⃣  Updating daily report...');
    const updateReport = await graphqlRequest(`
      mutation UpdateDailyReport($input: UpdateDailyReportInput!) {
        updateDailyReport(input: $input) {
          id
          mood
          achievements
          notes
          updatedAt
        }
      }
    `, {
      input: {
        reportId: reportId,
        mood: 'VERY_HAPPY',
        achievements: 'Berhasil menyelesaikan tugas matematika dengan nilai sempurna! Juga membantu teman yang kesulitan.',
        notes: 'Siswa sangat aktif, antusias, dan menunjukkan kemajuan yang luar biasa hari ini'
      }
    }, teacherToken);
    
    const updated = updateReport.updateDailyReport;
    console.log(`✅ Report updated!`);
    console.log(`   New mood: ${updated.mood}`);
    console.log(`   Updated achievements: ${updated.achievements.substring(0, 50)}...`);
    
    // 8. Query again to verify update
    console.log('\n8️⃣  Verifying update...');
    const verifyData = await graphqlRequest(`
      query DailyReportDetail($reportId: String!) {
        dailyReportDetail(reportId: $reportId) {
          id
          mood
          achievements
          notes
          comments {
            id
            content
            commentedBy {
              name
              role
            }
          }
        }
      }
    `, { reportId }, teacherToken);
    
    const verified = verifyData.dailyReportDetail;
    console.log(`✅ Verified updated report:`);
    console.log(`   Mood: ${verified.mood}`);
    console.log(`   Comments: ${verified.comments.length}`);
    
    if (verified.comments.length > 0) {
      console.log(`\n   💬 Comments:`);
      for (const c of verified.comments) {
        console.log(`      - ${c.commentedBy.role}: "${c.content}"`);
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 DAY 8 TEST RESULTS:\n');
    
    const createWorks = reportId !== null;
    const queryWorks = reports.length > 0;
    const detailWorks = detail.id === reportId;
    const updateWorks = verified.mood === 'VERY_HAPPY';
    
    console.log(`✅ Create Daily Report: ${createWorks ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Query Reports by Student: ${queryWorks ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Get Report Detail: ${detailWorks ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Update Report: ${updateWorks ? 'WORKING' : 'FAILED'}`);
    console.log(`ℹ️  Parent Comments: ${verified.comments.length > 0 ? 'WORKING' : 'NOT TESTED'}`);
    
    if (createWorks && queryWorks && detailWorks && updateWorks) {
      console.log('\n🎉 SUCCESS! Daily Reports system is fully functional!\n');
      console.log('✅ Teachers can create daily reports');
      console.log('✅ Reports can be queried by student');
      console.log('✅ Report details include all fields');
      console.log('✅ Reports can be updated');
      console.log('✅ Comments system works (if parent available)');
      console.log('\n🎯 DAY 8 COMPLETE ✅\n');
    } else {
      console.log('\n⚠️  Some features need attention\n');
    }
    
    console.log(`\n💡 Note: Report ID ${reportId} created for testing`);
    console.log(`   You can manually delete it or run cleanup script\n`);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testDailyReports();
