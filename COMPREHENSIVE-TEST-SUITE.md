# 📋 COMPREHENSIVE MANUAL TESTING SUITE - DAY 13-14
**Application**: LMS ABK  
**Date**: March 12, 2026  
**Purpose**: Complete manual testing across all user roles and features  
**Duration**: 16 hours (2 days)

---

## 🎯 Testing Strategy

### Scope
- **3 User Roles**: Teacher, Student, Parent
- **10 Core Features**: Authentication, Assignments, Grading, Progress, Reports, Notes, Classrooms, Media, Levels, Navigation
- **4 Test Types**: Functional, UI/UX, Data Validation, Error Handling

### Test Environment
- **Backend**: https://railway-production-url.up.railway.app/graphql
- **Frontend**: http://localhost:3000 (or deployed URL)
- **Database**: Neon PostgreSQL (production staging)

### Test Accounts
```
Teacher:  guru@lms-abk.com / password123
Student:  siswa1@lms-abk.com / password123
Parent:   siswa1@lms-abk.com / password123 (switch to parent view)
```

---

## 📊 Test Coverage Matrix

| Feature | Teacher | Student | Parent | Priority |
|---------|---------|---------|--------|----------|
| **Login/Logout** | ✅ | ✅ | ✅ | HIGH |
| **Dashboard** | ✅ | ✅ | ✅ | HIGH |
| **View Assignments** | ✅ | ✅ | ❌ | HIGH |
| **Create Assignments** | ✅ | ❌ | ❌ | HIGH |
| **Submit Assignments** | ❌ | ✅ | ❌ | HIGH |
| **Grade Assignments** | ✅ | ❌ | ❌ | HIGH |
| **View Grades** | ✅ | ✅ | ✅ | HIGH |
| **View Progress** | ✅ | ✅ | ✅ | HIGH |
| **Daily Reports** | ✅ | ✅ | ✅ | HIGH |
| **Comment on Reports** | ❌ | ❌ | ✅ | MEDIUM |
| **Teacher Notes** | ✅ | ❌ | ✅ | MEDIUM |
| **Reply to Notes** | ✅ | ❌ | ✅ | MEDIUM |
| **View Classrooms** | ✅ | ✅ | ❌ | MEDIUM |
| **Manage Students** | ✅ | ❌ | ❌ | MEDIUM |
| **Upload Media** | ✅ | ❌ | ❌ | MEDIUM |
| **View XP/Levels** | ✅ | ✅ | ✅ | MEDIUM |
| **Navigation** | ✅ | ✅ | ✅ | HIGH |
| **Role Switching** | ❌ | ✅ | ✅ | HIGH |

**Total Test Cases**: 54 (18 per role × 3 roles)

---

## 🧪 TEST SUITE 1: AUTHENTICATION (6 tests)

### Test 1.1: Successful Login - Teacher
**Priority**: HIGH | **Role**: Teacher

**Preconditions**: None

**Steps**:
1. Navigate to /login
2. Enter email: `guru@lms-abk.com`
3. Enter password: `password123`
4. Click "Masuk" button
5. Observe redirect

**Expected Results**:
- [ ] Form submits without errors
- [ ] Redirects to `/dashboard`
- [ ] Teacher dashboard is displayed
- [ ] User name "Bu Ani Susanti" appears in navbar
- [ ] Navigation menu shows teacher options (Kelas, Siswa, Penilaian Tertunda)

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

**Notes**: _____________

---

### Test 1.2: Successful Login - Student
**Priority**: HIGH | **Role**: Student

**Preconditions**: None

**Steps**:
1. Navigate to /login
2. Enter email: `siswa1@lms-abk.com`
3. Enter password: `password123`
4. Click "Masuk" button
5. Observe redirect

**Expected Results**:
- [ ] Form submits without errors
- [ ] Redirects to `/dashboard`
- [ ] Student dashboard is displayed
- [ ] User name "Andi Pratama" appears in navbar
- [ ] Role switcher appears (Student/Parent toggle)
- [ ] XP and level information displayed

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 1.3: Failed Login - Invalid Email
**Priority**: HIGH | **Role**: All

**Steps**:
1. Navigate to /login
2. Enter email: `invalid@example.com`
3. Enter password: `password123`
4. Click "Masuk" button

**Expected Results**:
- [ ] Error message appears
- [ ] Error states "Email atau password salah" or similar
- [ ] Form remains on login page
- [ ] Password field is cleared (security best practice)
- [ ] Error has red background
- [ ] Error has `role="alert"` (accessibility)

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 1.4: Failed Login - Invalid Password
**Priority**: HIGH | **Role**: All

**Steps**:
1. Navigate to /login
2. Enter email: `guru@lms-abk.com`
3. Enter password: `wrongpassword`
4. Click "Masuk" button

**Expected Results**:
- [ ] Error message appears
- [ ] Error is clearly visible
- [ ] Form remains on login page
- [ ] Does not reveal whether email exists (security)

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 1.5: Form Validation - Empty Fields
**Priority**: MEDIUM | **Role**: All

**Steps**:
1. Navigate to /login
2. Leave both fields empty
3. Click "Masuk" button

**Expected Results**:
- [ ] Email field shows "Email tidak valid"
- [ ] Password field shows "Password minimal 6 karakter"
- [ ] Errors appear below respective fields
- [ ] Form does not submit
- [ ] Submit button disabled or shows validation errors

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 1.6: Logout Functionality
**Priority**: HIGH | **Role**: All

**Steps**:
1. Log in as any user
2. Navigate to dashboard
3. Click user menu in navbar
4. Click "Keluar" (Logout)

**Expected Results**:
- [ ] User is logged out
- [ ] Redirects to /login
- [ ] Cannot access /dashboard without re-login
- [ ] Session is terminated
- [ ] Token is cleared from storage

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

## 🧪 TEST SUITE 2: TEACHER DASHBOARD (8 tests)

### Test 2.1: Dashboard Loads Successfully
**Priority**: HIGH | **Role**: Teacher

**Preconditions**: Logged in as teacher

**Steps**:
1. Navigate to /dashboard
2. Observe page content

**Expected Results**:
- [ ] Page loads within 3 seconds
- [ ] No error messages
- [ ] Statistics cards displayed (students, assignments, submissions)
- [ ] Recent activity section displayed
- [ ] Pending grading section displayed (if any)
- [ ] Navigation sidebar visible
- [ ] User info in navbar

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 2.2: View My Students
**Priority**: HIGH | **Role**: Teacher

**Preconditions**: Logged in as teacher

**Steps**:
1. Click "Siswa" in sidebar
2. Observe students list

**Expected Results**:
- [ ] Students list loads
- [ ] Shows at least 4 students (Andi, Budi, Citra, Deni)
- [ ] Each student card shows:
  - Name
  - Level and XP
  - Progress percentage
  - Actions (View Details)
- [ ] Cards are responsive
- [ ] Loading state shown while fetching

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 2.3: View Student Detail
**Priority**: HIGH | **Role**: Teacher

**Preconditions**: Logged in as teacher, on students list

**Steps**:
1. Click "Lihat Detail" on Andi Pratama
2. Observe student detail page

**Expected Results**:
- [ ] Student detail page loads
- [ ] Shows student name "Andi Pratama"
- [ ] Shows current level and XP
- [ ] Shows progress by subject
- [ ] Shows recent submissions
- [ ] Shows XP history/timeline
- [ ] Back button works

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 2.4: View Classrooms
**Priority**: MEDIUM | **Role**: Teacher

**Preconditions**: Logged in as teacher

**Steps**:
1. Click "Kelas" in sidebar
2. Observe classrooms list

**Expected Results**:
- [ ] Classrooms list loads
- [ ] Shows at least 1 classroom
- [ ] Each classroom shows:
  - Name
  - Number of students
  - Number of subjects
  - Actions (View Details)

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 2.5: View Classroom Detail
**Priority**: MEDIUM | **Role**: Teacher

**Preconditions**: Logged in as teacher

**Steps**:
1. Navigate to classrooms
2. Click on a classroom
3. Observe classroom detail

**Expected Results**:
- [ ] Classroom detail loads
- [ ] Shows classroom name
- [ ] Shows list of students in classroom
- [ ] Shows list of subjects
- [ ] Can navigate to subjects
- [ ] Breadcrumb navigation works

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 2.6: View Pending Grading
**Priority**: HIGH | **Role**: Teacher

**Preconditions**: Logged in as teacher

**Steps**:
1. Click "Penilaian Tertunda" in sidebar
2. Observe pending submissions list

**Expected Results**:
- [ ] Pending submissions list loads
- [ ] Shows only SUBMITTED status assignments
- [ ] Each submission shows:
  - Student name
  - Assignment title
  - Subject
  - Submission date
  - Actions (Grade)
- [ ] If no pending: Shows empty state message

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 2.7: View Media Library
**Priority**: MEDIUM | **Role**: Teacher

**Preconditions**: Logged in as teacher

**Steps**:
1. Click "Media Library" in sidebar
2. Observe media list

**Expected Results**:
- [ ] Media library page loads
- [ ] Shows list of uploaded media
- [ ] Each item shows:
  - Thumbnail (if image/video)
  - File name
  - File size
  - Upload date
  - Actions (View, Delete)
- [ ] Upload button visible

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 2.8: Navigation Consistency
**Priority**: HIGH | **Role**: Teacher

**Preconditions**: Logged in as teacher

**Steps**:
1. Navigate through all menu items
2. Check active state indicators
3. Check breadcrumbs

**Expected Results**:
- [ ] Active menu item is highlighted
- [ ] Breadcrumbs show current location
- [ ] Back button works on all pages
- [ ] Page titles are descriptive
- [ ] URLs are clean and logical

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

## 🧪 TEST SUITE 3: ASSIGNMENT MANAGEMENT (12 tests)

### Test 3.1: View Assignments List (Teacher)
**Priority**: HIGH | **Role**: Teacher

**Preconditions**: Logged in as teacher

**Steps**:
1. Navigate to a lesson page
2. View assignments list
3. Observe assignment cards

**Expected Results**:
- [ ] Assignments list loads
- [ ] Shows existing assignments
- [ ] Each assignment shows:
  - Title
  - Type (QUIZ/TASK_ANALYSIS)
  - Due date
  - Points
  - Number of submissions
  - Status
- [ ] Create assignment button visible

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 3.2: Create Quiz Assignment
**Priority**: HIGH | **Role**: Teacher

**Preconditions**: Logged in as teacher, on lesson page

**Steps**:
1. Click "Buat Tugas Baru"
2. Fill in form:
   - Title: "Test Quiz"
   - Type: QUIZ
   - Instructions: "Test instructions"
   - Points: 10
3. Submit form

**Expected Results**:
- [ ] Form validates required fields
- [ ] Assignment is created
- [ ] Success message appears
- [ ] Redirects to assignment detail or list
- [ ] New assignment appears in list

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 3.3: Create Task Assignment with Media
**Priority**: HIGH | **Role**: Teacher

**Preconditions**: Logged in as teacher

**Steps**:
1. Create new assignment
2. Set type: TASK_ANALYSIS
3. Upload an image or video
4. Set points and due date
5. Submit

**Expected Results**:
- [ ] File upload works
- [ ] File preview appears
- [ ] Assignment saves with media
- [ ] Media is accessible after creation

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 3.4: Edit Assignment
**Priority**: MEDIUM | **Role**: Teacher

**Preconditions**: Assignment exists

**Steps**:
1. Navigate to assignment detail
2. Click "Edit"
3. Change title and points
4. Save changes

**Expected Results**:
- [ ] Edit form pre-fills with current data
- [ ] Changes save successfully
- [ ] Updated data appears immediately
- [ ] Success notification shown

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 3.5: Delete Assignment
**Priority**: MEDIUM | **Role**: Teacher

**Preconditions**: Assignment exists with no submissions

**Steps**:
1. Navigate to assignment
2. Click "Delete"
3. Confirm deletion

**Expected Results**:
- [ ] Confirmation dialog appears
- [ ] Dialog explains consequences
- [ ] Cancel button works
- [ ] Confirm button deletes assignment
- [ ] Assignment removed from list
- [ ] Success message shown

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 3.6: View Assignment Detail (Teacher)
**Priority**: HIGH | **Role**: Teacher

**Preconditions**: Assignment exists

**Steps**:
1. Click on assignment from list
2. Observe detail page

**Expected Results**:
- [ ] Assignment details displayed:
  - Title
  - Instructions
  - Type
  - Points
  - Due date
  - Media (if any)
- [ ] List of submissions shown
- [ ] Submission statistics shown
- [ ] Can navigate to submissions

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 3.7: View Assignments (Student)
**Priority**: HIGH | **Role**: Student

**Preconditions**: Logged in as student

**Steps**:
1. Navigate to assignments page
2. View list of assignments

**Expected Results**:
- [ ] Shows all available assignments
- [ ] Indicates submitted vs not submitted
- [ ] Shows due dates
- [ ] Shows points/grades if graded
- [ ] Overdue assignments marked clearly
- [ ] Can filter by status

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 3.8: Submit Quiz Assignment (Student)
**Priority**: HIGH | **Role**: Student

**Preconditions**: QUIZ assignment exists, not yet submitted

**Steps**:
1. Click on QUIZ assignment
2. Read instructions
3. Enter answer text
4. Click "Submit"
5. Confirm submission

**Expected Results**:
- [ ] Can type answer
- [ ] Confirmation dialog appears
- [ ] Submission is recorded
- [ ] Status changes to SUBMITTED
- [ ] Success message shown
- [ ] Cannot edit after submission

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 3.9: Submit Task Assignment with File (Student)
**Priority**: HIGH | **Role**: Student

**Preconditions**: TASK_ANALYSIS assignment exists

**Steps**:
1. Click on TASK assignment
2. Upload file or enter text
3. Submit assignment
4. Confirm

**Expected Results**:
- [ ] Can upload file
- [ ] File size validated
- [ ] File type validated
- [ ] Submission recorded
- [ ] File is accessible after submission

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 3.10: View Submission Status (Student)
**Priority**: HIGH | **Role**: Student

**Preconditions**: Student has submitted assignment

**Steps**:
1. View submitted assignment
2. Check status

**Expected Results**:
- [ ] Status shows "Sudah Diserahkan"
- [ ] Submission date visible
- [ ] If graded: Shows grade and feedback
- [ ] If not graded: Shows "Menunggu Penilaian"
- [ ] Teacher feedback visible when provided

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 3.11: Cannot Resubmit (Student)
**Priority**: MEDIUM | **Role**: Student

**Preconditions**: Student has submitted assignment

**Steps**:
1. Try to access submitted assignment
2. Look for submit button

**Expected Results**:
- [ ] Submit button is disabled or hidden
- [ ] Message indicates already submitted
- [ ] Can view previous submission
- [ ] Cannot edit submission

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 3.12: View Assignment (Parent)
**Priority**: MEDIUM | **Role**: Parent

**Preconditions**: Logged in as student, switched to parent view

**Steps**:
1. Switch to parent view
2. Navigate to assignments (if available)
3. View child's assignments

**Expected Results**:
- [ ] Can see child's assignments
- [ ] Can see submission status
- [ ] Can see grades (if graded)
- [ ] Cannot submit assignments
- [ ] Cannot edit assignments

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

## 🧪 TEST SUITE 4: GRADING SYSTEM (8 tests)

### Test 4.1: Grade Quiz Assignment
**Priority**: HIGH | **Role**: Teacher

**Preconditions**: Student has submitted QUIZ assignment

**Steps**:
1. Navigate to pending grading
2. Click on submission
3. Review student answer
4. Enter grade (0-100)
5. Enter feedback
6. Click "Simpan Nilai"

**Expected Results**:
- [ ] Grade form validates (0-100 range)
- [ ] Grade is saved
- [ ] XP is awarded to student
- [ ] Status changes to GRADED
- [ ] Feedback is saved
- [ ] Student can view grade
- [ ] Success notification shown

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 4.2: Grade Task Assignment
**Priority**: HIGH | **Role**: Teacher

**(Similar to Test 4.1, but with TASK_ANALYSIS type)**

---

### Test 4.3: Grade Validation - Out of Range
**Priority**: MEDIUM | **Role**: Teacher

**Steps**:
1. Try to enter grade > 100
2. Try to enter grade < 0
3. Try to enter non-numeric value

**Expected Results**:
- [ ] Validation error appears
- [ ] Cannot save invalid grade
- [ ] Error message is clear
- [ ] Form remains editable

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 4.4: Update Grade (Re-grade)
**Priority**: MEDIUM | **Role**: Teacher

**Preconditions**: Assignment already graded

**Steps**:
1. Navigate to graded submission
2. Edit grade
3. Update feedback
4. Save changes

**Expected Results**:
- [ ] Can update previous grade
- [ ] XP is recalculated
- [ ] Updated feedback shown
- [ ] Audit trail maintained (optional)
- [ ] Student sees updated grade

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 4.5: View Grades (Student)
**Priority**: HIGH | **Role**: Student

**Preconditions**: Logged in as student, has graded assignments

**Steps**:
1. Navigate to grades page
2. View all grades

**Expected Results**:
- [ ] List of graded assignments shown
- [ ] Each shows:
  - Assignment name
  - Grade/Points earned
  - Total points possible
  - Percentage
  - Teacher feedback
  - XP earned
- [ ] Overall average shown (optional)

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 4.6: View Grade Detail (Student)
**Priority**: MEDIUM | **Role**: Student

**Steps**:
1. Click on graded assignment
2. View full details

**Expected Results**:
- [ ] Shows original submission
- [ ] Shows grade and feedback
- [ ] Shows grading date
- [ ] Shows teacher name
- [ ] Can view submission media if any

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 4.7: View Child Grades (Parent)
**Priority**: MEDIUM | **Role**: Parent

**Steps**:
1. Switch to parent view
2. Navigate to grades section
3. View child's grades

**Expected Results**:
- [ ] Can see all child's grades
- [ ] Can see feedback from teacher
- [ ] Can see progress over time
- [ ] Cannot modify grades
- [ ] Can see which assignments pending

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 4.8: XP Award on Grading
**Priority**: HIGH | **Role**: Teacher + Student

**Steps**:
1. Teacher grades assignment with 80/100
2. Check student XP before and after

**Expected Results**:
- [ ] XP is awarded proportionally
- [ ] 80/100 on 10pt assignment = 8 XP
- [ ] XP appears in student profile immediately
- [ ] XP contributes to level progress
- [ ] XP transaction logged

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

## 🧪 TEST SUITE 5: PROGRESS & GAMIFICATION (8 tests)

### Test 5.1: View Student Progress (Teacher)
**Priority**: HIGH | **Role**: Teacher

**Steps**:
1. Navigate to student detail
2. View progress section

**Expected Results**:
- [ ] Shows progress by subject
- [ ] Shows lessons completed
- [ ] Shows percentage complete
- [ ] Shows XP earned
- [ ] Shows current level
- [ ] Progress bars visible
- [ ] Color-coded status

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 5.2: Mark Lesson Complete (Teacher)
**Priority**: MEDIUM | **Role**: Teacher

**Steps**:
1. Navigate to lesson
2. Mark as complete for student
3. Check progress updates

**Expected Results**:
- [ ] Can mark lesson complete
- [ ] Lesson status updates
- [ ] Subject progress percentage updates
- [ ] Student can see completion

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 5.3: View Own Progress (Student)
**Priority**: HIGH | **Role**: Student

**Steps**:
1. Navigate to dashboard
2. View progress section

**Expected Results**:
- [ ] Shows current level and XP
- [ ] Shows XP needed for next level
- [ ] Shows progress by subject
- [ ] Shows recent achievements
- [ ] Visual progress indicators
- [ ] Motivational messaging

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 5.4: Level Up Functionality
**Priority**: HIGH | **Role**: Student

**Preconditions**: Student near level threshold (e.g., 95 XP, needs 100)

**Steps**:
1. Teacher grades assignment giving 10 XP
2. Check student level after

**Expected Results**:
- [ ] XP increases to 105
- [ ] Level increases from 1 to 2
- [ ] Level progress resets
- [ ] Celebration/notification shown (optional)
- [ ] Badge appears (optional)

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 5.5: XP Calculation Accuracy
**Priority**: HIGH | **Role**: All

**Steps**:
1. Create assignment worth 10 points
2. Student submits
3. Teacher grades with 75/100
4. Check XP awarded

**Expected Results**:
- [ ] XP = (grade/100) * points
- [ ] 75/100 * 10 = 7.5 XP
- [ ] System rounds appropriately
- [ ] XP matches displayed value

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 5.6: View Child Progress (Parent)
**Priority**: MEDIUM | **Role**: Parent

**Steps**:
1. Switch to parent view
2. View child's progress

**Expected Results**:
- [ ] Can see child's level and XP
- [ ] Can see subject progress
- [ ] Can see completed lessons
- [ ] Can see achievement timeline
- [ ] Visual charts/graphs shown

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 5.7: Subject Progress Calculation
**Priority**: MEDIUM | **Role**: Teacher

**Steps**:
1. View subject with 10 lessons
2. Mark 3 lessons complete
3. Check progress percentage

**Expected Results**:
- [ ] Shows 3/10 lessons complete
- [ ] Shows 30% progress
- [ ] Progress bar reflects percentage
- [ ] Updates in real-time

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 5.8: Overall Progress Dashboard
**Priority**: MEDIUM | **Role**: Teacher

**Steps**:
1. View class progress overview
2. See all students at once

**Expected Results**:
- [ ] Shows all students in class
- [ ] Shows each student's level
- [ ] Shows each student's overall progress
- [ ] Can sort by progress
- [ ] Can identify struggling students
- [ ] Exportable (optional)

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

## 🧪 TEST SUITE 6: DAILY REPORTS & NOTES (12 tests)

### Test 6.1: Create Daily Report (Teacher)
**Priority**: HIGH | **Role**: Teacher

**Steps**:
1. Navigate to student detail
2. Click "Create Daily Report"
3. Fill form:
   - Date: Today
   - Mood: HAPPY
   - Activities: List 3 activities
   - Notes: General notes
4. Submit

**Expected Results**:
- [ ] Form validates required fields
- [ ] Report is created
- [ ] Success notification shown
- [ ] Report appears in list
- [ ] Date cannot be future date

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 6.2: View Daily Reports (Teacher)
**Priority**: HIGH | **Role**: Teacher

**Steps**:
1. Navigate to student's reports
2. View list of reports

**Expected Results**:
- [ ] Shows all reports for student
- [ ] Sorted by date (newest first)
- [ ] Each shows: date, mood, preview
- [ ] Can click to view full report
- [ ] Can filter by date range

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 6.3: Update Daily Report (Teacher)
**Priority**: MEDIUM | **Role**: Teacher

**Preconditions**: Report exists

**Steps**:
1. Open existing report
2. Click edit
3. Change mood and activities
4. Save changes

**Expected Results**:
- [ ] Can edit own reports
- [ ] Changes save successfully
- [ ] Updated timestamp shown
- [ ] Parents see updates

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 6.4: View Daily Report (Student)
**Priority**: HIGH | **Role**: Student

**Steps**:
1. Navigate to daily reports
2. View today's report

**Expected Results**:
- [ ] Can see own reports
- [ ] Shows mood with emoji or color
- [ ] Shows activities list
- [ ] Shows teacher notes
- [ ] Shows parent comments (if any)
- [ ] Date is clearly displayed

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 6.5: View Child Report (Parent)
**Priority**: HIGH | **Role**: Parent

**Steps**:
1. Switch to parent view
2. Navigate to daily reports
3. View reports

**Expected Results**:
- [ ] Can see all child's reports
- [ ] Can see mood trends
- [ ] Can see teacher notes
- [ ] Can add comments
- [ ] Reports sorted chronologically

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 6.6: Add Comment on Report (Parent)
**Priority**: MEDIUM | **Role**: Parent

**Preconditions**: Report exists

**Steps**:
1. Open daily report
2. Find comment section
3. Type comment
4. Submit

**Expected Results**:
- [ ] Comment field visible
- [ ] Can type comment
- [ ] Comment saves
- [ ] Comment appears below report
- [ ] Teacher can see comment
- [ ] Timestamp shown

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 6.7: Create Teacher Note (Teacher)
**Priority**: HIGH | **Role**: Teacher

**Steps**:
1. Navigate to student
2. Click "Create Note"
3. Enter content
4. Submit

**Expected Results**:
- [ ] Note form appears
- [ ] Can type note content
- [ ] Note saves
- [ ] Success message
- [ ] Note appears in student's notes list
- [ ] Parent can see note

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 6.8: Reply to Note (Teacher or Parent)
**Priority**: MEDIUM | **Role**: Teacher/Parent

**Preconditions**: Note exists

**Steps**:
1. Open existing note
2. Click "Reply"
3. Type reply
4. Submit

**Expected Results**:
- [ ] Reply form appears
- [ ] Reply saves
- [ ] Reply appears as threaded reply
- [ ] Original note author notified (optional)
- [ ] Reply timestamp shown
- [ ] Both roles can see thread

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 6.9: View Notes (Student)
**Priority**: MEDIUM | **Role**: Student

**Steps**:
1. Navigate to notes section
2. View notes about self

**Expected Results**:
- [ ] Can see notes from teacher
- [ ] Can see parent replies
- [ ] Cannot edit or delete
- [ ] Can read full thread
- [ ] Sorted by date

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 6.10: Update Note (Teacher)
**Priority**: MEDIUM | **Role**: Teacher

**Steps**:
1. Find own note
2. Click edit
3. Update content
4. Save

**Expected Results**:
- [ ] Can edit own notes only
- [ ] Changes save
- [ ] Updated timestamp shown
- [ ] Cannot edit other teachers' notes

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 6.11: Delete Note (Teacher)
**Priority**: MEDIUM | **Role**: Teacher

**Steps**:
1. Find own note
2. Click delete
3. Confirm

**Expected Results**:
- [ ] Confirmation dialog appears
- [ ] Can delete own notes only
- [ ] Note is removed
- [ ] Replies are also deleted
- [ ] Cannot recover after delete

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

### Test 6.12: Notes Dashboard (Teacher)
**Priority**: MEDIUM | **Role**: Teacher

**Steps**:
1. View recent notes dashboard
2. See all recent notes

**Expected Results**:
- [ ] Shows recent 5-10 notes
- [ ] Shows across all students
- [ ] Can click to view detail
- [ ] Can filter by student
- [ ] Can search notes

**Actual Results**: _____________

**Status**: [ ] PASS  [ ] FAIL  [ ] BLOCKED

---

## 📊 TEST EXECUTION TRACKING

### Test Summary Template

| Suite | Total Tests | Passed | Failed | Blocked | % Pass |
|-------|-------------|--------|--------|---------|--------|
| 1. Authentication | 6 | 0 | 0 | 0 | 0% |
| 2. Teacher Dashboard | 8 | 0 | 0 | 0 | 0% |
| 3. Assignment Management | 12 | 0 | 0 | 0 | 0% |
| 4. Grading System | 8 | 0 | 0 | 0 | 0% |
| 5. Progress & Gamification | 8 | 0 | 0 | 0 | 0% |
| 6. Daily Reports & Notes | 12 | 0 | 0 | 0 | 0% |
| **TOTAL** | **54** | **0** | **0** | **0** | **0%** |

---

## 📝 Bug Report Template

```markdown
# BUG-[ID]: [Short Title]

**Date Found**: [Date]
**Tester**: [Name]
**Severity**: Critical | Major | Minor | Cosmetic

## Description
[Clear description of the bug]

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: [Browser name and version]
- OS: [Operating system]
- Screen Size: [Resolution]
- User Role: [Teacher/Student/Parent]

## Screenshots
[Attach screenshots]

## Additional Notes
[Any other relevant information]
```

---

## ✅ COMPLETION CHECKLIST

### Before Testing
- [ ] Test environment set up
- [ ] Test accounts confirmed working
- [ ] Browser and tools ready
- [ ] Recording method prepared (spreadsheet/screenshots)

### During Testing
- [ ] Follow each test step exactly
- [ ] Record all results (pass/fail/blocked)
- [ ] Take screenshots of failures
- [ ] Note any unexpected behavior
- [ ] Keep browser console open for errors

### After Testing
- [ ] Complete test summary table
- [ ] Create bug reports for all failures
- [ ] Prioritize bugs by severity
- [ ] Share results with team
- [ ] Retest after bug fixes

---

*Manual testing suite created for DAY 13-14*  
*Total test cases: 54 across 6 suites*  
*Estimated time: 16 hours (2 days)*
