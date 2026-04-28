# 📘 API DOCUMENTATION
**EDU_PROJECT_LMS - GraphQL API**  
**Version**: 1.0  
**Last Updated**: March 12, 2026

---

## 🌐 API Overview

### Base URL
```
Production: https://[your-backend].up.railway.app/graphql
Development: http://localhost:3001/graphql
```

### Protocol
- **GraphQL** over HTTP POST
- **WebSocket** for subscriptions (optional)

### Authentication
- JWT Token-based authentication
- Token format: `Bearer <token>`
- Token expiration: 24 hours (production)

---

## 🔐 Authentication

### Login

**Query**: `login`

**Description**: Authenticate user and receive JWT token

**Input**:
```graphql
mutation Login($email: String!, $password: String!) {
  login(loginInput: { email: $email, password: $password }) {
    access_token
    user {
      id
      email
      role
      name
    }
  }
}
```

**Variables**:
```json
{
  "email": "guru@lms-abk.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "data": {
    "login": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": "1",
        "email": "guru@lms-abk.com",
        "role": "TEACHER",
        "name": "Guru Satu"
      }
    }
  }
}
```

**Roles**:
- `TEACHER` - Can create assignments, grade, write reports
- `STUDENT` - Can submit assignments, view grades
- `PARENT` - Can view child's progress and reports

---

### Using Authentication Token

Include token in HTTP headers:

```http
POST /graphql
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Example with curl**:
```bash
curl -X POST https://api.edu-lms.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"{ me { id email role } }"}'
```

**Example with JavaScript**:
```javascript
const response = await fetch('https://api.edu-lms.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: '{ me { id email role } }'
  })
});
```

---

## 👤 User Queries

### Get Current User

**Query**: `me`

**Description**: Get authenticated user's information

```graphql
query GetCurrentUser {
  me {
    id
    email
    role
    name
    createdAt
    updatedAt
  }
}
```

**Response**:
```json
{
  "data": {
    "me": {
      "id": "1",
      "email": "guru@lms-abk.com",
      "role": "TEACHER",
      "name": "Guru Satu",
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-03-12T00:00:00Z"
    }
  }
}
```

---

### Get User by ID

**Query**: `user`

**Description**: Get any user by ID (requires appropriate permissions)

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    role
    name
    profile {
      avatar
      phone
      address
    }
  }
}
```

---

### List Users

**Query**: `users`

**Description**: Get list of users (filtered by role)

```graphql
query ListStudents {
  users(role: STUDENT) {
    id
    name
    email
    createdAt
  }
}
```

---

## 🎓 Teacher Queries

### Get Teacher's Students

**Query**: `myStudents`

**Description**: Get all students assigned to the teacher

```graphql
query GetMyStudents {
  myStudents {
    id
    name
    email
    level
    xp
    enrollments {
      classroom {
        id
        name
      }
    }
  }
}
```

---

### Get Teacher's Classrooms

**Query**: `myClassrooms`

**Description**: Get all classrooms taught by the teacher

```graphql
query GetMyClassrooms {
  myClassrooms {
    id
    name
    subject {
      id
      name
    }
    students {
      id
      name
    }
    _count {
      students
      assignments
    }
  }
}
```

---

### Get Pending Grading

**Query**: `pendingGrading`

**Description**: Get submissions waiting to be graded

```graphql
query GetPendingGrading {
  pendingGrading {
    id
    status
    submittedAt
    assignment {
      id
      title
      maxScore
    }
    student {
      id
      name
    }
  }
}
```

**Response Example**:
```json
{
  "data": {
    "pendingGrading": [
      {
        "id": "1",
        "status": "SUBMITTED",
        "submittedAt": "2026-03-12T10:00:00Z",
        "assignment": {
          "id": "5",
          "title": "Latihan Matematika #1",
          "maxScore": 100
        },
        "student": {
          "id": "3",
          "name": "Siswa Satu"
        }
      }
    ]
  }
}
```

---

## 📚 Classroom Queries

### Get Classroom Detail

**Query**: `classroom`

**Description**: Get detailed classroom information

```graphql
query GetClassroom($id: ID!) {
  classroom(id: $id) {
    id
    name
    description
    subject {
      id
      name
    }
    teacher {
      id
      name
    }
    students {
      id
      name
      email
    }
    assignments {
      id
      title
      dueDate
      status
    }
    _count {
      students
      assignments
    }
  }
}
```

---

### List Classrooms

**Query**: `classrooms`

**Description**: Get all classrooms

```graphql
query ListClassrooms {
  classrooms {
    id
    name
    subject {
      name
    }
    teacher {
      name
    }
    _count {
      students
    }
  }
}
```

---

## 📝 Assignment Queries

### Get Assignment Detail

**Query**: `assignment`

**Description**: Get detailed assignment information

```graphql
query GetAssignment($id: ID!) {
  assignment(id: $id) {
    id
    title
    description
    instructions
    dueDate
    maxScore
    xpReward
    status
    classroom {
      id
      name
    }
    submissions {
      id
      status
      score
      submittedAt
      student {
        id
        name
      }
    }
  }
}
```

---

### List Assignments (Student)

**Query**: `myAssignments`

**Description**: Get assignments for logged-in student

```graphql
query GetMyAssignments {
  myAssignments {
    id
    title
    description
    dueDate
    maxScore
    xpReward
    status
    classroom {
      name
    }
    mySubmission {
      id
      status
      score
      feedback
      submittedAt
    }
  }
}
```

---

### List Assignments (Teacher)

**Query**: `assignments`

**Description**: Get all assignments (with filters)

```graphql
query ListAssignments($classroomId: ID, $status: AssignmentStatus) {
  assignments(classroomId: $classroomId, status: $status) {
    id
    title
    dueDate
    status
    _count {
      submissions
    }
  }
}
```

---

## 📤 Submission Queries

### Get Submission Detail

**Query**: `submission`

**Description**: Get detailed submission information

```graphql
query GetSubmission($id: ID!) {
  submission(id: $id) {
    id
    status
    content
    attachments
    score
    feedback
    submittedAt
    gradedAt
    assignment {
      id
      title
      maxScore
      xpReward
    }
    student {
      id
      name
    }
  }
}
```

---

### List Student's Submissions

**Query**: `mySubmissions`

**Description**: Get all submissions for logged-in student

```graphql
query GetMySubmissions {
  mySubmissions {
    id
    status
    score
    submittedAt
    assignment {
      id
      title
      maxScore
      dueDate
    }
  }
}
```

---

## 📊 Progress Queries

### Get Student Progress

**Query**: `studentProgress`

**Description**: Get progress statistics for a student

```graphql
query GetStudentProgress($studentId: ID!) {
  studentProgress(studentId: $studentId) {
    totalXP
    level
    totalAssignments
    completedAssignments
    averageScore
    submissionRate
    onTimeRate
    streakDays
  }
}
```

**Response Example**:
```json
{
  "data": {
    "studentProgress": {
      "totalXP": 1250,
      "level": 5,
      "totalAssignments": 20,
      "completedAssignments": 18,
      "averageScore": 85.5,
      "submissionRate": 90,
      "onTimeRate": 95,
      "streakDays": 7
    }
  }
}
```

---

### Get Classroom Progress

**Query**: `classroomProgress`

**Description**: Get aggregate progress for entire classroom

```graphql
query GetClassroomProgress($classroomId: ID!) {
  classroomProgress(classroomId: $classroomId) {
    totalStudents
    averageScore
    averageCompletion
    topPerformers {
      id
      name
      totalXP
      level
    }
    strugglingStudents {
      id
      name
      completionRate
    }
  }
}
```

---

## 📋 Daily Reports Queries

### Get Daily Reports (Parent/Teacher)

**Query**: `dailyReports`

**Description**: Get daily reports for students

```graphql
query GetDailyReports($studentId: ID, $startDate: DateTime, $endDate: DateTime) {
  dailyReports(
    studentId: $studentId
    startDate: $startDate
    endDate: $endDate
  ) {
    id
    date
    content
    mood
    attendance
    teacher {
      name
    }
    student {
      id
      name
    }
    createdAt
  }
}
```

---

### Get Recent Notes (Teacher)

**Query**: `recentNotesForTeacher`

**Description**: Get teacher's recent daily reports/notes

```graphql
query GetRecentNotes {
  recentNotesForTeacher(limit: 10) {
    id
    date
    content
    student {
      id
      name
    }
    createdAt
  }
}
```

---

## ✏️ Mutations

### Create Assignment

**Mutation**: `createAssignment`

**Description**: Create new assignment (Teacher only)

```graphql
mutation CreateAssignment($input: CreateAssignmentInput!) {
  createAssignment(createAssignmentInput: $input) {
    id
    title
    description
    dueDate
    maxScore
    xpReward
  }
}
```

**Variables**:
```json
{
  "input": {
    "title": "Latihan Matematika #2",
    "description": "Penjumlahan dan Pengurangan",
    "instructions": "Kerjakan semua soal dengan teliti",
    "dueDate": "2026-03-20T23:59:59Z",
    "maxScore": 100,
    "xpReward": 50,
    "classroomId": "1"
  }
}
```

---

### Update Assignment

**Mutation**: `updateAssignment`

```graphql
mutation UpdateAssignment($id: ID!, $input: UpdateAssignmentInput!) {
  updateAssignment(id: $id, updateAssignmentInput: $input) {
    id
    title
    dueDate
    status
  }
}
```

---

### Delete Assignment

**Mutation**: `deleteAssignment`

```graphql
mutation DeleteAssignment($id: ID!) {
  deleteAssignment(id: $id) {
    id
    title
  }
}
```

---

### Submit Assignment (Student)

**Mutation**: `submitAssignment`

**Description**: Submit or update assignment submission

```graphql
mutation SubmitAssignment($input: SubmitAssignmentInput!) {
  submitAssignment(submitAssignmentInput: $input) {
    id
    status
    content
    attachments
    submittedAt
  }
}
```

**Variables**:
```json
{
  "input": {
    "assignmentId": "5",
    "content": "Ini adalah jawaban saya untuk tugas matematika...",
    "attachments": ["https://storage.com/file1.pdf"]
  }
}
```

---

### Grade Submission (Teacher)

**Mutation**: `gradeSubmission`

**Description**: Grade a student's submission

```graphql
mutation GradeSubmission($input: GradeSubmissionInput!) {
  gradeSubmission(gradeSubmissionInput: $input) {
    id
    score
    feedback
    gradedAt
    xpAwarded
    student {
      totalXP
      level
    }
  }
}
```

**Variables**:
```json
{
  "input": {
    "submissionId": "12",
    "score": 85,
    "feedback": "Bagus! Perhitungan sudah benar, tapi masih ada kesalahan kecil di soal nomor 3."
  }
}
```

---

### Create Daily Report (Teacher)

**Mutation**: `createDailyReport`

**Description**: Write daily report for a student

```graphql
mutation CreateDailyReport($input: CreateDailyReportInput!) {
  createDailyReport(createDailyReportInput: $input) {
    id
    date
    content
    mood
    attendance
    student {
      name
    }
  }
}
```

**Variables**:
```json
{
  "input": {
    "studentId": "3",
    "date": "2026-03-12",
    "content": "Hari ini Siswa aktif bertanya dan mengerjakan tugas dengan baik.",
    "mood": "HAPPY",
    "attendance": "PRESENT"
  }
}
```

**Mood Options**:
- `HAPPY` - Senang, ceria
- `NEUTRAL` - Biasa saja
- `SAD` - Sedih, murung
- `EXCITED` - Bersemangat
- `TIRED` - Lelah

**Attendance Options**:
- `PRESENT` - Hadir
- `ABSENT` - Tidak hadir
- `SICK` - Sakit
- `PERMISSION` - Izin

---

## 🎮 Gamification

### XP Calculation

**Base Formula**:
```
XP = (score / maxScore) * xpReward
```

**Bonus XP**:
- On-time submission: +10% XP
- Perfect score (100): +20% XP
- Streak (3+ days): +5% XP

**Example**:
```
Assignment: maxScore = 100, xpReward = 50
Student Score: 85
Base XP: (85 / 100) * 50 = 42.5 XP
On-time bonus: 42.5 * 1.1 = 46.75 XP
Rounded: 47 XP
```

---

### Level Progression

**Level Formula**:
```
Level = floor(sqrt(totalXP / 100)) + 1
```

**XP Required per Level**:
| Level | XP Required | Total XP |
|-------|-------------|----------|
| 1 | 0 | 0 |
| 2 | 100 | 100 |
| 3 | 300 | 400 |
| 4 | 500 | 900 |
| 5 | 700 | 1,600 |
| 10 | 1,900 | 10,000 |

---

## 📊 GraphQL Schema Types

### User Type
```graphql
type User {
  id: ID!
  email: String!
  role: UserRole!
  name: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  taughtClassrooms: [Classroom!]
  enrollments: [Enrollment!]
  submissions: [Submission!]
  dailyReports: [DailyReport!]
  
  # Gamification
  totalXP: Int
  level: Int
}
```

---

### Assignment Type
```graphql
type Assignment {
  id: ID!
  title: String!
  description: String
  instructions: String
  dueDate: DateTime!
  maxScore: Int!
  xpReward: Int!
  status: AssignmentStatus!
  
  # Relations
  classroom: Classroom!
  submissions: [Submission!]
  
  # Computed
  _count: AssignmentCount
}
```

---

### Submission Type
```graphql
type Submission {
  id: ID!
  status: SubmissionStatus!
  content: String
  attachments: [String!]
  score: Int
  feedback: String
  submittedAt: DateTime
  gradedAt: DateTime
  
  # Relations
  assignment: Assignment!
  student: User!
}
```

---

### Enums

**UserRole**:
```graphql
enum UserRole {
  TEACHER
  STUDENT
  PARENT
  ADMIN
}
```

**AssignmentStatus**:
```graphql
enum AssignmentStatus {
  DRAFT        # Not published yet
  ACTIVE       # Open for submissions
  CLOSED       # Past due date
  ARCHIVED     # No longer visible
}
```

**SubmissionStatus**:
```graphql
enum SubmissionStatus {
  NOT_SUBMITTED   # Student hasn't submitted
  DRAFT           # Student working on it
  SUBMITTED       # Submitted, waiting for grade
  GRADED          # Graded by teacher
  LATE            # Submitted after due date
}
```

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "statusCode": 401
      }
    }
  ]
}
```

---

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHENTICATED` | 401 | No valid token provided |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_USER_INPUT` | 400 | Invalid input data |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

### Error Examples

**Unauthorized**:
```json
{
  "errors": [{
    "message": "Unauthorized",
    "extensions": { "code": "UNAUTHENTICATED" }
  }]
}
```

**Forbidden**:
```json
{
  "errors": [{
    "message": "You don't have permission to access this resource",
    "extensions": { "code": "FORBIDDEN" }
  }]
}
```

**Not Found**:
```json
{
  "errors": [{
    "message": "Assignment with ID 999 not found",
    "extensions": { "code": "NOT_FOUND" }
  }]
}
```

---

## 🔒 Rate Limiting

### Limits
- **Authenticated**: 100 requests per minute
- **Unauthenticated**: 20 requests per minute

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1678636800
```

### 429 Response
```json
{
  "errors": [{
    "message": "Too many requests, please try again later",
    "extensions": { 
      "code": "RATE_LIMIT_EXCEEDED",
      "retryAfter": 60
    }
  }]
}
```

---

## 📚 Query Examples

### Complete Teacher Dashboard Data

```graphql
query TeacherDashboard {
  me {
    id
    name
    email
  }
  
  myClassrooms {
    id
    name
    subject { name }
    _count { students assignments }
  }
  
  myStudents {
    id
    name
    level
    totalXP
  }
  
  pendingGrading {
    id
    assignment { title }
    student { name }
    submittedAt
  }
  
  recentNotesForTeacher(limit: 5) {
    id
    date
    content
    student { name }
  }
}
```

---

### Complete Student Dashboard Data

```graphql
query StudentDashboard {
  me {
    id
    name
    totalXP
    level
  }
  
  myAssignments {
    id
    title
    dueDate
    maxScore
    xpReward
    status
    classroom { name }
    mySubmission {
      status
      score
      feedback
    }
  }
  
  studentProgress(studentId: "me") {
    averageScore
    completionRate
    streakDays
  }
}
```

---

### Complete Parent Dashboard Data

```graphql
query ParentDashboard($childId: ID!) {
  user(id: $childId) {
    id
    name
    totalXP
    level
  }
  
  studentProgress(studentId: $childId) {
    totalAssignments
    completedAssignments
    averageScore
    submissionRate
  }
  
  dailyReports(studentId: $childId, limit: 7) {
    id
    date
    content
    mood
    attendance
    teacher { name }
  }
}
```

---

## 🛠️ Testing with GraphQL Playground

### Enable Playground (Development Only)

Set in environment:
```env
GRAPHQL_PLAYGROUND=true
GRAPHQL_INTROSPECTION=true
```

**URL**: http://localhost:3001/graphql

### Sample Test Flow

1. **Login**:
```graphql
mutation {
  login(loginInput: {
    email: "guru@lms-abk.com"
    password: "password123"
  }) {
    access_token
  }
}
```

2. **Set Authorization Header**:
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

3. **Query Data**:
```graphql
{
  me { name role }
  myClassrooms { name }
}
```

---

## 📞 Support

### Issues
- Report bugs: GitHub Issues
- Feature requests: GitHub Discussions
- Security issues: Email admin@edu-lms.com

### Resources
- GraphQL Docs: https://graphql.org
- Playground: http://localhost:3001/graphql (dev)
- Status Page: [To be added]

---

**Version**: 1.0  
**Last Updated**: March 12, 2026  
**Next Review**: After DAY 20 pilot feedback
