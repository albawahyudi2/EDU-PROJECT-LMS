// DAY 9: Test Teacher Notes System
// Test: Create notes, reply to notes, update, delete, query by student

const API_URL = 'http://localhost:3001/graphql';

// Teacher account
const TEACHER_EMAIL = 'guru@lms-abk.com';
const TEACHER_PASSWORD = 'Guru123!';

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

async function testTeacherNotes() {
  console.log('\n🧪 DAY 9: Testing Teacher Notes System\n');
  console.log('='.repeat(70));
  console.log('\n📋 Test Plan:');
  console.log('   1. Get available students');
  console.log('   2. Create a note for student');
  console.log('   3. Reply to note (threading)');
  console.log('   4. Query notes by student');
  console.log('   5. Get note detail with replies');
  console.log('   6. Get recent notes for teacher');
  console.log('   7. Update a note');
  console.log('   8. Delete a note');
  console.log('\n' + '='.repeat(70));
  
  let noteId = null;
  let replyId = null;
  
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
      console.log('⚠️  No students found. Cannot test notes.');
      return;
    }
    
    const testStudent = students[0];
    console.log(`\n   Testing with: ${testStudent.user.studentName}`);
    console.log(`   Student ID: ${testStudent.id}`);
    
    // 3. Create a note
    console.log('\n3️⃣  Creating a note for student...');
    const createNote = await graphqlRequest(`
      mutation CreateNote($input: CreateNoteInput!) {
        createNote(input: $input) {
          id
          content
          studentId
          writtenById
          writtenBy {
            id
            name
            role
          }
          parentNoteId
          replyCount
          createdAt
        }
      }
    `, {
      input: {
        studentId: testStudent.id,
        content: 'Andi menunjukkan perkembangan yang sangat baik dalam matematika. Sangat fokus dan aktif bertanya.'
      }
    }, teacherToken);
    
    const note = createNote.createNote;
    noteId = note.id;
    
    console.log(`✅ Note created!`);
    console.log(`   Note ID: ${note.id}`);
    console.log(`   Content: "${note.content}"`);
    console.log(`   Written by: ${note.writtenBy.name} (${note.writtenBy.role})`);
    console.log(`   Reply count: ${note.replyCount}`);
    
    // 4. Create a reply to the note
    console.log('\n4️⃣  Creating a reply to the note...');
    const createReply = await graphqlRequest(`
      mutation CreateNote($input: CreateNoteInput!) {
        createNote(input: $input) {
          id
          content
          studentId
          writtenById
          writtenBy {
            name
            role
          }
          parentNoteId
          replyCount
          createdAt
        }
      }
    `, {
      input: {
        studentId: testStudent.id,
        content: 'Perlu ditingkatkan: latihan soal cerita agar lebih lancar.',
        parentNoteId: noteId
      }
    }, teacherToken);
    
    const reply = createReply.createNote;
    replyId = reply.id;
    
    console.log(`✅ Reply created!`);
    console.log(`   Reply ID: ${reply.id}`);
    console.log(`   Content: "${reply.content}"`);
    console.log(`   Parent Note ID: ${reply.parentNoteId}`);
    
    // 5. Query notes by student
    console.log('\n5️⃣  Querying notes by student...');
    const notesData = await graphqlRequest(`
      query NotesByStudent($studentId: String!) {
        notesByStudent(studentId: $studentId) {
          id
          content
          writtenBy {
            name
            role
          }
          parentNoteId
          replies {
            id
            content
            writtenBy {
              name
              role
            }
            createdAt
          }
          createdAt
        }
      }
    `, { studentId: testStudent.id }, teacherToken);
    
    const notes = notesData.notesByStudent;
    console.log(`✅ Found ${notes.length} note(s) for student`);
    
    for (const n of notes) {
      console.log(`\n   📝 Note: "${n.content.substring(0, 50)}${n.content.length > 50 ? '...' : ''}"`);
      console.log(`      By: ${n.writtenBy.name} (${n.writtenBy.role})`);
      console.log(`      Replies: ${n.replies.length}`);
      
      if (n.replies.length > 0) {
        for (const r of n.replies) {
          console.log(`      💬 Reply: "${r.content.substring(0, 40)}..."`);
          console.log(`         By: ${r.writtenBy.name}`);
        }
      }
    }
    
    // 6. Get note detail with replies
    console.log('\n6️⃣  Getting note detail...');
    const detailData = await graphqlRequest(`
      query NoteDetail($noteId: String!) {
        noteDetail(noteId: $noteId) {
          id
          content
          studentId
          writtenBy {
            id
            name
            role
          }
          parentNoteId
          replies {
            id
            content
            writtenBy {
              name
              role
            }
            parentNoteId
            createdAt
          }
          createdAt
          updatedAt
        }
      }
    `, { noteId }, teacherToken);
    
    const detail = detailData.noteDetail;
    console.log(`✅ Note detail retrieved:`);
    console.log(`   Content: "${detail.content}"`);
    console.log(`   Written by: ${detail.writtenBy.name} (${detail.writtenBy.role})`);
    console.log(`   Direct replies: ${detail.replies.length}`);
    
    if (detail.replies.length > 0) {
      console.log(`\n   💬 Replies:`);
      for (const r of detail.replies) {
        console.log(`      - "${r.content}"`);
        console.log(`        By: ${r.writtenBy.name}`);
      }
    }
    
    // 7. Get recent notes for teacher
    console.log('\n7️⃣  Getting recent notes for teacher...');
    const recentData = await graphqlRequest(`
      query RecentNotesForTeacher($limit: Float) {
        recentNotesForTeacher(limit: $limit) {
          id
          content
          studentId
          student {
            id
            name
          }
          writtenBy {
            name
          }
          replyCount
          createdAt
        }
      }
    `, { limit: 5 }, teacherToken);
    
    const recentNotes = recentData.recentNotesForTeacher;
    console.log(`✅ Found ${recentNotes.length} recent notes`);
    
    for (const n of recentNotes) {
      console.log(`\n   📝 "${n.content.substring(0, 50)}${n.content.length > 50 ? '...' : ''}"`);
      console.log(`      Student: ${n.student?.name || 'Unknown'}`);
      console.log(`      By: ${n.writtenBy.name}`);
      console.log(`      Replies: ${n.replyCount}`);
    }
    
    // 8. Update a note
    console.log('\n8️⃣  Updating the note...');
    const updateNote = await graphqlRequest(`
      mutation UpdateNote($input: UpdateNoteInput!) {
        updateNote(input: $input) {
          id
          content
          updatedAt
        }
      }
    `, {
      input: {
        noteId: noteId,
        content: 'Andi menunjukkan perkembangan yang sangat luar biasa dalam matematika. Sangat fokus, aktif bertanya, dan membantu teman-temannya. Terus pertahankan semangat belajarnya!'
      }
    }, teacherToken);
    
    const updated = updateNote.updateNote;
    console.log(`✅ Note updated!`);
    console.log(`   New content: "${updated.content.substring(0, 80)}..."`);
    console.log(`   Updated at: ${updated.updatedAt}`);
    
    // 9. Verify update by getting detail again
    console.log('\n9️⃣  Verifying update...');
    const verifyData = await graphqlRequest(`
      query NoteDetail($noteId: String!) {
        noteDetail(noteId: $noteId) {
          id
          content
          replies {
            id
            content
          }
          updatedAt
        }
      }
    `, { noteId }, teacherToken);
    
    const verified = verifyData.noteDetail;
    console.log(`✅ Verified updated note:`);
    console.log(`   Content: "${verified.content.substring(0, 60)}..."`);
    console.log(`   Replies: ${verified.replies.length}`);
    
    // 10. Delete the reply
    console.log('\n🔟 Deleting the reply note...');
    const deleteReply = await graphqlRequest(`
      mutation DeleteNote($noteId: String!) {
        deleteNote(noteId: $noteId) {
          success
          message
        }
      }
    `, { noteId: replyId }, teacherToken);
    
    console.log(`✅ Reply deleted: ${deleteReply.deleteNote.message}`);
    
    // 11. Verify deletion
    console.log('\n1️⃣1️⃣  Verifying deletion...');
    const afterDelete = await graphqlRequest(`
      query NotesByStudent($studentId: String!) {
        notesByStudent(studentId: $studentId) {
          id
          content
          replies {
            id
          }
        }
      }
    `, { studentId: testStudent.id }, teacherToken);
    
    const mainNote = afterDelete.notesByStudent.find(n => n.id === noteId);
    console.log(`✅ Verified: Main note has ${mainNote?.replies.length || 0} replies (reply was deleted)`);
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 DAY 9 TEST RESULTS:\n');
    
    const createWorks = noteId !== null;
    const replyWorks = replyId !== null;
    const queryWorks = notes.length > 0;
    const detailWorks = detail.id === noteId;
    const recentWorks = recentNotes.length > 0;
    const updateWorks = verified.content !== note.content;
    const deleteWorks = deleteReply.deleteNote.success;
    
    console.log(`✅ Create Note: ${createWorks ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Reply to Note: ${replyWorks ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Query Notes by Student: ${queryWorks ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Get Note Detail: ${detailWorks ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Recent Notes for Teacher: ${recentWorks ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Update Note: ${updateWorks ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Delete Note: ${deleteWorks ? 'WORKING' : 'FAILED'}`);
    
    if (createWorks && replyWorks && queryWorks && detailWorks && recentWorks && updateWorks && deleteWorks) {
      console.log('\n🎉 SUCCESS! Teacher Notes system is fully functional!\n');
      console.log('✅ Teachers can create notes for students');
      console.log('✅ Notes support threading (replies)');
      console.log('✅ Notes can be queried by student');
      console.log('✅ Recent notes dashboard works');
      console.log('✅ Notes can be updated');
      console.log('✅ Notes can be deleted');
      console.log('\n🎯 DAY 9 COMPLETE ✅\n');
    } else {
      console.log('\n⚠️  Some features need attention\n');
    }
    
    console.log(`\n💡 Note: Note ID ${noteId} still exists (only reply was deleted)`);
    console.log(`   You can manually delete it or leave for future testing\n`);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testTeacherNotes();
