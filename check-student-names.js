// Check student names in database
const { PrismaClient } = require('./packages/database/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_0iTkjcsdhuV4@ep-soft-block-a1hhgzhl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function checkStudentNames() {
  console.log('\n🔍 Checking Student Names in Database\n');
  console.log('='.repeat(70));
  
  try {
    // Get all users with STUDENT_PARENT role
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT_PARENT'
      },
      select: {
        id: true,
        email: true,
        studentName: true,
        parentName: true,
        isActive: true
      }
    });
    
    console.log(`\n📊 Found ${students.length} student accounts\n`);
    
    let hasName = 0;
    let missingName = 0;
    
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.email}`);
      console.log(`   Student Name: ${student.studentName || '❌ NULL/MISSING'}`);
      console.log(`   Parent Name:  ${student.parentName || '❌ NULL/MISSING'}`);
      console.log(`   Active:       ${student.isActive ? '✅' : '❌'}`);
      console.log(`   ID:           ${student.id}`);
      console.log('');
      
      if (student.studentName && student.parentName) {
        hasName++;
      } else {
        missingName++;
      }
    });
    
    console.log('='.repeat(70));
    console.log('\n📈 Summary:');
    console.log(`   ✅ Students with names: ${hasName}`);
    console.log(`   ❌ Students missing names: ${missingName}`);
    
    if (missingName > 0) {
      console.log('\n💡 Issue Identified:');
      console.log('   Student accounts exist but studentName/parentName fields are NULL');
      console.log('\n📝 Fix Required:');
      console.log('   1. Update seed.ts to set names during seeding');
      console.log('   2. Or run UPDATE query to add names to existing students');
      console.log('   3. Or provide UI for students to set their names');
    } else {
      console.log('\n✅ All students have names set correctly!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudentNames();
