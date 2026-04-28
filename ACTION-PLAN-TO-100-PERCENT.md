# 🎯 ACTION PLAN: Mencapai 100% Functional LMS ABK

**Target:** Semua fitur FASE 1 berfungsi 100%  
**Current Status:** 73/100  
**Target Status:** 100/100  
**Estimated Time:** 3-4 minggu kerja intensif  
**Date Created:** March 11, 2026

---

## 📊 ROADMAP OVERVIEW

```
Week 1: Critical Bugs (73% → 85%)
Week 2: Core Features (85% → 92%)
Week 3: Polish & Testing (92% → 97%)
Week 4: Production Ready (97% → 100%)
```

---

## 🚨 WEEK 1: CRITICAL FIXES (Priority 1)
**Goal:** Fix blocking issues, get to 85%  
**Estimated Time:** 5 hari kerja (40 jam)

### DAY 1: Fix Assignment Creation (8 jam)

#### Issue #1: "Materi tidak ditemukan" Error
**Root Cause Analysis Needed:**

```bash
# Step 1: Investigate GraphQL schema
cd apps/backend/src/assignments
# Check assignments.resolver.ts
# Check assignments.service.ts
```

**Expected Issues:**
1. Lesson validation failing
2. Frontend tidak kirim correct `lessonId`
3. GraphQL mutation input schema mismatch

**Fix Steps:**

**1.1 Check Backend Resolver (2 jam)**
```typescript
// apps/backend/src/assignments/assignments.resolver.ts

@Mutation(() => AssignmentModel)
async createAssignment(
  @Args('input') input: CreateAssignmentInput,
  @CurrentUser() user: UserModel,
) {
  // Add logging
  console.log('Creating assignment with input:', input);
  console.log('lessonId:', input.lessonId);
  
  // Validate lesson exists
  const lesson = await this.lessonsService.findOne(input.lessonId);
  if (!lesson) {
    throw new Error(`Lesson with ID ${input.lessonId} not found`);
  }
  
  return this.assignmentsService.create(input, user.id);
}
```

**1.2 Fix Frontend Form (3 jam)**
```typescript
// apps/frontend/src/components/assignments/create-assignment-dialog.tsx

// ENSURE lessonId is passed correctly:
const [formData, setFormData] = useState({
  title: '',
  description: '',
  type: 'QUIZ' as AssignmentType,
  lessonId: lessonId || '', // Get from props or context
  dueDate: null,
  xpReward: 10,
  isDraft: true,
});

// Validate before submit:
const handleSubmit = async () => {
  if (!formData.lessonId) {
    toast.error('Pilih materi terlebih dahulu');
    return;
  }
  
  // ... rest of submit logic
};
```

**1.3 Update GraphQL Mutation (1 jam)**
```typescript
// apps/frontend/src/lib/graphql/mutations/assignments.ts

export const CREATE_ASSIGNMENT = gql`
  mutation CreateAssignment($input: CreateAssignmentInput!) {
    createAssignment(input: $input) {
      id
      title
      description
      type
      lessonId
      isDraft
      dueDate
      xpReward
      createdAt
    }
  }
`;
```

**1.4 Test End-to-End (2 jam)**
- [ ] Login as teacher
- [ ] Navigate to lesson detail
- [ ] Click "Create Assignment"
- [ ] Fill form with all required fields
- [ ] Submit and verify assignment created
- [ ] Check database for new record

**Acceptance Criteria:**
- ✅ No "Materi tidak ditemukan" error
- ✅ Assignment created successfully
- ✅ Visible in assignments list
- ✅ Database record present

---

### DAY 2: Fix Student Name Display (6 jam)

#### Issue #2: Student Names Showing "undefined"

**Root Cause:**
- GraphQL query tidak fetch correct fields
- User model field mapping issue
- Frontend destructuring salah

**Fix Steps:**

**2.1 Fix GraphQL Schema (1 jam)**
```graphql
# apps/backend/src/users/users.graphql or schema.gql

type UserModel {
  id: ID!
  email: String!
  role: UserRole!
  
  # ENSURE these fields exist:
  studentName: String
  parentName: String
  teacherName: String
  
  avatar: String
  isActive: Boolean!
  isVerified: Boolean!
  lastLoginAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

**2.2 Update All GraphQL Queries (2 jam)**

Files to update:
```typescript
// apps/frontend/src/lib/graphql/queries/students.ts

export const GET_STUDENTS = gql`
  query GetStudents {
    students {
      id
      user {
        id
        email
        studentName   # ADD THIS
        parentName    # ADD THIS
        avatar
        isActive
      }
      level
      xp
      nextLevelXp
      createdAt
    }
  }
`;

// apps/frontend/src/lib/graphql/queries/classrooms.ts

export const GET_CLASSROOM_DETAIL = gql`
  query GetClassroomDetail($id: ID!) {
    classroom(id: $id) {
      id
      name
      students {
        id
        user {
          id
          email
          studentName   # ADD THIS
          parentName    # ADD THIS
        }
        level
        xp
      }
      subjects {
        id
        name
      }
    }
  }
`;

// Update ALL queries that fetch user data
```

**2.3 Update Backend Resolver (1 jam)**
```typescript
// apps/backend/src/users/users.resolver.ts

@ResolveField(() => String, { nullable: true })
studentName(@Parent() user: User) {
  return user.studentName;
}

@ResolveField(() => String, { nullable: true })
parentName(@Parent() user: User) {
  return user.parentName;
}

@ResolveField(() => String, { nullable: true })
teacherName(@Parent() user: User) {
  return user.teacherName;
}
```

**2.4 Update Frontend Components (1 jam)**
```typescript
// apps/frontend/src/components/students/student-card.tsx

const StudentCard = ({ student }) => {
  // Get name with fallback
  const displayName = student.user.studentName 
    || student.user.parentName 
    || student.user.email.split('@')[0];
    
  return (
    <div>
      <h3>{displayName}</h3>
      {/* ... rest of component */}
    </div>
  );
};
```

**2.5 Verify All Views (1 jam)**
Test in these pages:
- [ ] Students list page
- [ ] Classroom detail (student list)
- [ ] Grading queue
- [ ] Submission views
- [ ] Dashboard stats
- [ ] Assignment submissions

**Acceptance Criteria:**
- ✅ All student names display correctly
- ✅ No "undefined" anywhere
- ✅ Parent names visible when applicable
- ✅ Fallback to email if name missing

---

### DAY 3: Update Test Scripts (8 jam)

#### Issue #3: Outdated GraphQL Queries in Tests

**Strategy:** Create centralized query definitions

**3.1 Create Centralized Queries File (2 jam)**
```javascript
// test-queries.js (NEW FILE)

const QUERIES = {
  // AUTH
  LOGIN: `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        accessToken
        user {
          id
          email
          role
          studentName
          parentName
          teacherName
        }
      }
    }
  `,
  
  ME: `
    query Me {
      me {
        id
        email
        role
        studentName
        parentName
        teacherName
      }
    }
  `,
  
  // CLASSROOMS
  GET_CLASSROOMS: `
    query GetClassrooms {
      classrooms {
        id
        name
        grade
        academicYear
        studentsCount
        subjectsCount
      }
    }
  `,
  
  // SUBJECTS
  CREATE_SUBJECT: `
    mutation CreateSubject($input: CreateSubjectInput!) {
      createSubject(input: $input) {
        id
        name
        description
        icon
        color
      }
    }
  `,
  
  // ASSIGNMENTS
  CREATE_ASSIGNMENT: `
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
  `,
  
  // Add all queries here...
};

module.exports = { QUERIES };
```

**3.2 Update Test Scripts (4 jam)**

Update these files to use centralized queries:
- [ ] test-day1-8-complete.js
- [ ] test-assignment-features.js
- [ ] test-classrooms-list.js
- [ ] test-crud-operations.js
- [ ] test-specific-classroom.js
- [ ] test-assignment-for-student.js
- [ ] test-assignment-quick.js
- [ ] test-submission-detail.js

Example:
```javascript
// test-day1-8-complete.js

const { QUERIES } = require('./test-queries');

// OLD (WRONG):
// const LOGIN_MUTATION = `mutation { login(email: "...", password: "...") { ... } }`;

// NEW (CORRECT):
const response = await graphqlRequest(QUERIES.LOGIN, {
  input: {
    email: 'guru@lms-abk.com',
    password: 'Guru123!'
  }
});
```

**3.3 Run All Tests (1 jam)**
```bash
# Run each test and fix errors
node test-comprehensive.js
node test-day1-8-complete.js
node test-assignment-features.js
node test-classrooms-list.js
node test-crud-operations.js

# Target: 80%+ passing
```

**3.4 Document Test Results (1 jam)**
Update TEST-RESULTS.md with:
- Which tests passing
- Which tests failing (with reasons)
- Expected vs actual results

**Acceptance Criteria:**
- ✅ At least 80% of test scripts passing
- ✅ No GraphQL validation errors
- ✅ All queries use centralized definitions
- ✅ Clear documentation of test results

---

### DAY 4: Seed Complete Test Data (4 jam)

#### Issue #7: Only 1 Student Has Submissions

**Goal:** All 4 students have realistic test data

**4.1 Create Comprehensive Seed Script (2 jam)**
```typescript
// packages/database/prisma/seed-pilot.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding pilot test data...');
  
  // Get all students
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT_PARENT' }
  });
  
  // Get all assignments
  const assignments = await prisma.assignment.findMany({
    where: { isActive: true }
  });
  
  console.log(`Found ${students.length} students`);
  console.log(`Found ${assignments.length} assignments`);
  
  // Create submissions for each student
  for (const student of students) {
    const studentData = await prisma.student.findUnique({
      where: { userId: student.id }
    });
    
    if (!studentData) continue;
    
    // Each student does 2-3 assignments (varied)
    const assignmentsToComplete = assignments.slice(0, Math.floor(Math.random() * 2) + 2);
    
    for (const assignment of assignmentsToComplete) {
      // Create submission
      const submission = await prisma.submission.create({
        data: {
          studentId: studentData.id,
          assignmentId: assignment.id,
          status: ['DRAFT', 'SUBMITTED', 'GRADED'][Math.floor(Math.random() * 3)],
          submittedAt: new Date(),
        }
      });
      
      console.log(`✅ Created submission for ${student.email} on ${assignment.title}`);
      
      // If QUIZ, create answers
      if (assignment.type === 'QUIZ') {
        const questions = await prisma.quizQuestion.findMany({
          where: { assignmentId: assignment.id }
        });
        
        for (const question of questions) {
          const options = await prisma.quizOption.findMany({
            where: { questionId: question.id }
          });
          
          // Random answer
          const randomOption = options[Math.floor(Math.random() * options.length)];
          
          await prisma.quizAnswer.create({
            data: {
              submissionId: submission.id,
              questionId: question.id,
              selectedOptionId: randomOption.id
            }
          });
        }
      }
      
      // If TASK_ANALYSIS, create step submissions
      if (assignment.type === 'TASK_ANALYSIS') {
        const steps = await prisma.taskStep.findMany({
          where: { assignmentId: assignment.id }
        });
        
        for (const step of steps) {
          await prisma.stepSubmission.create({
            data: {
              submissionId: submission.id,
              stepId: step.id,
              status: ['PENDING', 'APPROVED', 'REJECTED'][Math.floor(Math.random() * 3)],
              teacherComment: 'Bagus!',
            }
          });
        }
      }
      
      // If GRADED, create grading
      if (submission.status === 'GRADED') {
        const teacher = await prisma.user.findFirst({
          where: { role: 'TEACHER' }
        });
        
        await prisma.grading.create({
          data: {
            submissionId: submission.id,
            teacherId: teacher!.id,
            score: Math.floor(Math.random() * 30) + 70, // 70-100
            feedback: 'Pekerjaan yang baik! Pertahankan.',
            gradedAt: new Date(),
          }
        });
        
        // Update student XP
        const xpGain = assignment.xpReward || 10;
        await prisma.student.update({
          where: { id: studentData.id },
          data: {
            xp: { increment: xpGain },
            level: Math.floor((studentData.xp + xpGain) / 100) + 1,
          }
        });
      }
    }
  }
  
  // Create teacher notes for each student
  const teacher = await prisma.user.findFirst({
    where: { role: 'TEACHER' }
  });
  
  for (const student of students) {
    const studentData = await prisma.student.findUnique({
      where: { userId: student.id }
    });
    
    if (!studentData) continue;
    
    await prisma.note.create({
      data: {
        studentId: studentData.id,
        authorId: teacher!.id,
        content: `Perkembangan ${student.studentName || 'siswa'} sangat baik minggu ini!`,
        isPrivate: false,
      }
    });
    
    console.log(`✅ Created note for ${student.email}`);
  }
  
  // Create daily reports
  for (const student of students) {
    const studentData = await prisma.student.findUnique({
      where: { userId: student.id }
    });
    
    if (!studentData) continue;
    
    // Create 3 daily reports (different days)
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      await prisma.dailyReport.create({
        data: {
          studentId: studentData.id,
          reportDate: date,
          mood: ['VERY_SAD', 'SAD', 'NEUTRAL', 'HAPPY', 'VERY_HAPPY'][Math.floor(Math.random() * 5)],
          activities: ['Makan', 'Belajar', 'Bermain'],
          notes: 'Hari yang menyenangkan!',
          challenges: i % 2 === 0 ? 'Sedikit kesulitan fokus' : null,
        }
      });
    }
    
    console.log(`✅ Created daily reports for ${student.email}`);
  }
  
  console.log('✅ Pilot seed data complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**4.2 Run Seed Script (1 jam)**
```bash
cd packages/database
npx tsx prisma/seed-pilot.ts
```

**4.3 Verify Data (1 jam)**
```bash
# Check submissions
node check-database.js

# Expected:
# - All 4 students have 2-3 submissions each
# - Mix of DRAFT, SUBMITTED, GRADED
# - All students have teacher notes
# - All students have daily reports
```

**Acceptance Criteria:**
- ✅ All 4 students have submissions
- ✅ Varied statuses (DRAFT, SUBMITTED, GRADED)
- ✅ XP and levels calculated correctly
- ✅ Teacher notes exist for all
- ✅ Daily reports populated
- ✅ Dashboard shows realistic data

---

### DAY 5: Setup R2 Storage (4 jam)

#### Issue #8: R2 Storage Not Configured

**Goal:** Enable file uploads untuk images, videos, PDFs

**5.1 Create Cloudflare R2 Account (30 min)**
1. Go to https://dash.cloudflare.com/
2. Sign up / Login
3. Go to R2 Object Storage
4. Create bucket: `lms-abk-storage`
5. Get credentials:
   - Account ID
   - Access Key ID
   - Secret Access Key

**5.2 Configure Environment (30 min)**
```bash
# .env (apps/backend)

# Cloudflare R2 Storage
R2_ACCOUNT_ID="your-account-id-here"
R2_ACCESS_KEY_ID="your-access-key-here"
R2_SECRET_ACCESS_KEY="your-secret-key-here"
R2_BUCKET_NAME="lms-abk-storage"
R2_PUBLIC_URL="https://lms-abk-storage.your-account.r2.cloudflarestorage.com"
```

**5.3 Test Upload (1 hour)**
```bash
# Start servers
pnpm dev

# Open browser
http://localhost:3000/dashboard/media-test

# Test uploads:
# 1. Upload image (< 5MB)
# 2. Upload PDF (< 10MB)
# 3. Verify file appears in R2 dashboard
# 4. Verify public URL works
```

**5.4 Test Assignment Media (1 hour)**
- [ ] Create quiz dengan gambar di soal
- [ ] Create quiz dengan gambar di pilihan jawaban
- [ ] Create task analysis dengan reference image
- [ ] Student upload foto untuk task step
- [ ] Verify all images load correctly

**5.5 Configure CORS (1 hour)**
```json
// R2 Bucket CORS settings
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-production-domain.com"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

**Acceptance Criteria:**
- ✅ R2 bucket created and configured
- ✅ Environment variables set
- ✅ File upload working (image, video, PDF)
- ✅ Public URLs accessible
- ✅ CORS configured correctly
- ✅ No console errors on upload

---

## 🔨 WEEK 2: CORE FEATURES (Priority 2)
**Goal:** Complete all FASE 1 features, reach 92%  
**Estimated Time:** 5 hari kerja (40 jam)

### DAY 6: Edit Assignment UI (6 jam)

**6.1 Create EditAssignmentDialog Component (3 jam)**
```typescript
// apps/frontend/src/components/assignments/edit-assignment-dialog.tsx

'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { graphqlRequest } from '@/lib/graphql-client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const UPDATE_ASSIGNMENT = `
  mutation UpdateAssignment($input: UpdateAssignmentInput!) {
    updateAssignment(input: $input) {
      id
      title
      description
      dueDate
      xpReward
    }
  }
`;

interface EditAssignmentDialogProps {
  assignment: {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    xpReward: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditAssignmentDialog({
  assignment,
  open,
  onOpenChange,
  onSuccess,
}: EditAssignmentDialogProps) {
  const [formData, setFormData] = useState({
    title: assignment.title,
    description: assignment.description || '',
    dueDate: assignment.dueDate || '',
    xpReward: assignment.xpReward,
  });

  const updateMutation = useMutation({
    mutationFn: async (input: any) => {
      const response = await graphqlRequest(UPDATE_ASSIGNMENT, {
        input: {
          id: assignment.id,
          ...input,
        },
      });
      return response.updateAssignment;
    },
    onSuccess: () => {
      toast.success('Tugas berhasil diperbarui');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal memperbarui tugas');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Judul tugas harus diisi');
      return;
    }
    
    if (formData.xpReward < 0 || formData.xpReward > 100) {
      toast.error('XP harus antara 0-100');
      return;
    }
    
    updateMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Tugas</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Judul Tugas *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Quiz Perkalian 1-10"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Deskripsi</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan tentang tugas ini..."
              rows={4}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Batas Waktu</label>
            <Input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">XP Reward</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.xpReward}
              onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Quiz: 10 XP, Task Analysis: 20 XP (rekomendasi)
            </p>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**6.2 Add Edit Button to Assignment Detail (1 jam)**
```typescript
// apps/frontend/src/app/dashboard/assignments/[id]/page.tsx

'use client';

import { useState } from 'react';
import { EditAssignmentDialog } from '@/components/assignments/edit-assignment-dialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export default function AssignmentDetailPage({ params }: { params: { id: string } }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // ... existing code ...
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>{assignment.title}</h1>
        
        {/* Add Edit Button */}
        {user?.role === 'TEACHER' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditDialogOpen(true)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </div>
      
      {/* ... rest of content ... */}
      
      <EditAssignmentDialog
        assignment={assignment}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {
          // Refresh assignment data
          refetch();
        }}
      />
    </div>
  );
}
```

**6.3 Test Edit Functionality (2 jam)**
- [ ] Login as teacher
- [ ] Open assignment detail
- [ ] Click Edit button
- [ ] Change title, description, due date, XP
- [ ] Save changes
- [ ] Verify changes reflected in UI
- [ ] Verify database updated
- [ ] Test validation (empty title, invalid XP)

**Acceptance Criteria:**
- ✅ Edit dialog opens correctly
- ✅ Form pre-filled with current values
- ✅ Can update all fields
- ✅ Validation works
- ✅ Changes saved to database
- ✅ UI updates after save

---

### DAY 7: Role Switching UI (4 jam)

**Goal:** Student_Parent dapat switch antara student view ↔ parent view

**7.1 Update Auth Store (1 jam)**
```typescript
// apps/frontend/src/store/auth-store.ts

interface AuthState {
  user: User | null;
  accessToken: string | null;
  viewMode: 'student' | 'parent'; // ADD THIS
  currentChildId: string | null; // For parent viewing specific child
  
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setViewMode: (mode: 'student' | 'parent') => void; // ADD THIS
  setCurrentChild: (childId: string | null) => void; // ADD THIS
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  viewMode: 'student',
  currentChildId: null,
  
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setCurrentChild: (childId) => set({ currentChildId: childId }),
  
  logout: () => set({ 
    user: null, 
    accessToken: null, 
    viewMode: 'student',
    currentChildId: null 
  }),
}));
```

**7.2 Create Role Switch Component (1 jam)**
```typescript
// apps/frontend/src/components/layout/role-switcher.tsx

'use client';

import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { User, Users } from 'lucide-react';

export function RoleSwitcher() {
  const { user, viewMode, setViewMode } = useAuthStore();
  
  // Only show for STUDENT_PARENT role
  if (user?.role !== 'STUDENT_PARENT') {
    return null;
  }
  
  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
      <Button
        variant={viewMode === 'student' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('student')}
      >
        <User className="w-4 h-4 mr-2" />
        Siswa
      </Button>
      
      <Button
        variant={viewMode === 'parent' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('parent')}
      >
        <Users className="w-4 h-4 mr-2" />
        Orang Tua
      </Button>
    </div>
  );
}
```

**7.3 Add to Dashboard Layout (30 min)**
```typescript
// apps/frontend/src/app/dashboard/layout.tsx

import { RoleSwitcher } from '@/components/layout/role-switcher';

export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>
        {/* ... sidebar ... */}
      </nav>
      
      <header>
        <RoleSwitcher /> {/* ADD HERE */}
        {/* ... user menu ... */}
      </header>
      
      <main>{children}</main>
    </div>
  );
}
```

**7.4 Update Views Based on Role (1 hour)**
```typescript
// apps/frontend/src/app/dashboard/page.tsx

'use client';

import { useAuthStore } from '@/store/auth-store';
import { StudentDashboard } from '@/components/dashboard/student-dashboard';
import { ParentDashboard } from '@/components/dashboard/parent-dashboard';

export default function DashboardPage() {
  const { viewMode, user } = useAuthStore();
  
  if (user?.role === 'TEACHER') {
    return <TeacherDashboard />;
  }
  
  if (viewMode === 'parent') {
    return <ParentDashboard />;
  }
  
  return <StudentDashboard />;
}
```

**7.5 Test Role Switching (30 min)**
- [ ] Login as student (siswa1@lms-abk.com)
- [ ] See role switcher in header
- [ ] Click "Orang Tua" button
- [ ] Dashboard changes to parent view
- [ ] Click "Siswa" button
- [ ] Back to student view
- [ ] Verify state persists across page navigation

**Acceptance Criteria:**
- ✅ Role switcher visible for STUDENT_PARENT
- ✅ Can switch between student ↔ parent view
- ✅ Dashboard content changes accordingly
- ✅ State persists during session

---

### DAY 8: Teacher Notes & Communication (6 jam)

**Goal:** Implement teacher notes dengan reply functionality

**8.1 Create Backend Notes Mutations (1 jam)**
```typescript
// apps/backend/src/notes/notes.resolver.ts

@Mutation(() => NoteModel)
@UseGuards(JwtAuthGuard)
async createNote(
  @Args('input') input: CreateNoteInput,
  @CurrentUser() user: UserModel,
) {
  return this.notesService.create({
    ...input,
    authorId: user.id,
  });
}

@Mutation(() => NoteModel)
@UseGuards(JwtAuthGuard)
async replyToNote(
  @Args('parentNoteId') parentNoteId: string,
  @Args('content') content: string,
  @CurrentUser() user: UserModel,
) {
  return this.notesService.reply(parentNoteId, {
    content,
    authorId: user.id,
  });
}
```

**8.2 Create Notes UI Component (2 jam)**
```typescript
// apps/frontend/src/components/notes/notes-thread.tsx

'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { graphqlRequest } from '@/lib/graphql-client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const GET_NOTES = `
  query GetNotes($studentId: ID!) {
    notes(studentId: $studentId) {
      id
      content
      isPrivate
      createdAt
      author {
        id
        teacherName
        studentName
        parentName
        role
      }
      replies {
        id
        content
        createdAt
        author {
          id
          teacherName
          studentName
          parentName
          role
        }
      }
    }
  }
`;

const CREATE_NOTE = `
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      id
      content
      createdAt
    }
  }
`;

const REPLY_TO_NOTE = `
  mutation ReplyToNote($parentNoteId: ID!, $content: String!) {
    replyToNote(parentNoteId: $parentNoteId, content: $content) {
      id
      content
      createdAt
    }
  }
`;

export function NotesThread({ studentId, accessToken }: { studentId: string; accessToken: string }) {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const { data, refetch } = useQuery({
    queryKey: ['notes', studentId],
    queryFn: async () => {
      const response = await graphqlRequest(
        GET_NOTES,
        { studentId },
        accessToken
      );
      return response.notes;
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      return graphqlRequest(
        CREATE_NOTE,
        {
          input: {
            studentId,
            content,
            isPrivate: false,
          },
        },
        accessToken
      );
    },
    onSuccess: () => {
      setNewNoteContent('');
      refetch();
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ noteId, content }: { noteId: string; content: string }) => {
      return graphqlRequest(
        REPLY_TO_NOTE,
        { parentNoteId: noteId, content },
        accessToken
      );
    },
    onSuccess: () => {
      setReplyingTo(null);
      setReplyContent('');
      refetch();
    },
  });

  const handleCreateNote = () => {
    if (!newNoteContent.trim()) return;
    createNoteMutation.mutate(newNoteContent);
  };

  const handleReply = (noteId: string) => {
    if (!replyContent.trim()) return;
    replyMutation.mutate({ noteId, content: replyContent });
  };

  const notes = data || [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Catatan Guru</h2>
      
      {/* Create new note (Teacher only) */}
      <Card className="p-4">
        <Textarea
          placeholder="Tulis catatan untuk siswa..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          rows={3}
        />
        <Button
          onClick={handleCreateNote}
          disabled={!newNoteContent.trim() || createNoteMutation.isPending}
          className="mt-2"
        >
          Kirim Catatan
        </Button>
      </Card>
      
      {/* Notes list */}
      <div className="space-y-4">
        {notes.map((note: any) => (
          <Card key={note.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">
                  {note.author.teacherName || note.author.parentName || note.author.studentName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(note.createdAt), {
                    addSuffix: true,
                    locale: id,
                  })}
                </p>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {note.author.role === 'TEACHER' ? 'Guru' : 'Orang Tua'}
              </span>
            </div>
            
            <p className="text-sm mb-3">{note.content}</p>
            
            {/* Replies */}
            {note.replies && note.replies.length > 0 && (
              <div className="ml-6 mt-3 space-y-3 border-l-2 pl-4">
                {note.replies.map((reply: any) => (
                  <div key={reply.id} className="bg-muted/50 rounded p-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm">
                        {reply.author.teacherName || reply.author.parentName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.createdAt), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </p>
                    </div>
                    <p className="text-sm">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Reply form */}
            {replyingTo === note.id ? (
              <div className="ml-6 mt-3">
                <Textarea
                  placeholder="Tulis balasan..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={2}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => handleReply(note.id)}
                    disabled={!replyContent.trim() || replyMutation.isPending}
                  >
                    Kirim Balasan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setReplyingTo(note.id)}
                className="mt-2"
              >
                Balas
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
```

**8.3 Add Notes to Student Detail Page (1 jam)**
```typescript
// apps/frontend/src/app/dashboard/students/[studentId]/page.tsx

import { NotesThread } from '@/components/notes/notes-thread';

export default function StudentDetailPage({ params }: { params: { studentId: string } }) {
  const { accessToken } = useAuthStore();
  
  return (
    <div className="space-y-6">
      {/* Student info */}
      <StudentInfoCard studentId={params.studentId} />
      
      {/* Progress stats */}
      <StudentProgress studentId={params.studentId} />
      
      {/* Notes section */}
      <NotesThread 
        studentId={params.studentId} 
        accessToken={accessToken!} 
      />
    </div>
  );
}
```

**8.4 Test Notes Feature (2 jam)**
- [ ] Login as teacher
- [ ] Open student detail page
- [ ] Write new note
- [ ] Verify note appears
- [ ] Logout, login as parent (student account)
- [ ] View note from teacher
- [ ] Reply to note
- [ ] Verify reply appears
- [ ] Switch back to teacher, see reply
- [ ] Test threaded conversations (multiple replies)

**Acceptance Criteria:**
- ✅ Teacher can write notes
- ✅ Parent can read notes
- ✅ Parent can reply
- ✅ Threaded conversations work
- ✅ Real-time-like feel (refetch after actions)
- ✅ Proper author attribution

---

### DAY 9: Daily Reports (6 jam)

**Goal:** Parents can submit daily reports with mood tracking

**8.1 Create Daily Report Form (2 jam)**
```typescript
// apps/frontend/src/components/reports/daily-report-form.tsx

'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { graphqlRequest } from '@/lib/graphql-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const CREATE_DAILY_REPORT = `
  mutation CreateDailyReport($input: CreateDailyReportInput!) {
    createDailyReport(input: $input) {
      id
      reportDate
      mood
      activities
      notes
    }
  }
`;

const MOOD_OPTIONS = [
  { value: 'VERY_SAD', emoji: '😭', label: 'Sangat Sedih' },
  { value: 'SAD', emoji: '😟', label: 'Sedih' },
  { value: 'NEUTRAL', emoji: '😐', label: 'Biasa Saja' },
  { value: 'HAPPY', emoji: '🙂', label: 'Senang' },
  { value: 'VERY_HAPPY', emoji: '😄', label: 'Sangat Senang' },
];

const ACTIVITY_OPTIONS = [
  'Makan pagi',
  'Mandi',
  'Belajar',
  'Mengerjakan tugas',
  'Bermain',
  'Tidur siang',
  'Makan siang',
  'Makan malam',
  'Olahraga',
  'Menonton TV',
];

export function DailyReportForm({ studentId, accessToken, onSuccess }: any) {
  const [selectedMood, setSelectedMood] = useState<string>('NEUTRAL');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [challenges, setChallenges] = useState('');

  const createMutation = useMutation({
    mutationFn: async (input: any) => {
      return graphqlRequest(CREATE_DAILY_REPORT, { input }, accessToken);
    },
    onSuccess: () => {
      toast.success('Laporan harian berhasil dikirim');
      // Reset form
      setSelectedMood('NEUTRAL');
      setSelectedActivities([]);
      setNotes('');
      setChallenges('');
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal mengirim laporan');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedActivities.length === 0) {
      toast.error('Pilih minimal 1 kegiatan');
      return;
    }
    
    createMutation.mutate({
      studentId,
      reportDate: new Date().toISOString(),
      mood: selectedMood,
      activities: selectedActivities,
      notes,
      challenges: challenges || null,
    });
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Laporan Harian</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            Bagaimana mood anak hari ini? *
          </label>
          <div className="grid grid-cols-5 gap-2">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => setSelectedMood(mood.value)}
                className={`
                  p-4 border-2 rounded-lg text-center transition-all
                  ${selectedMood === mood.value 
                    ? 'border-primary bg-primary/10 scale-105' 
                    : 'border-border hover:border-primary/50'}
                `}
              >
                <div className="text-3xl mb-1">{mood.emoji}</div>
                <div className="text-xs font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Activities */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            Kegiatan yang dilakukan hari ini: *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ACTIVITY_OPTIONS.map((activity) => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox
                  id={activity}
                  checked={selectedActivities.includes(activity)}
                  onCheckedChange={() => toggleActivity(activity)}
                />
                <label htmlFor={activity} className="text-sm cursor-pointer">
                  {activity}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Notes */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Catatan tambahan:
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ceritakan tentang hari anak Anda..."
            rows={4}
          />
        </div>
        
        {/* Challenges */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Kendala atau kesulitan (jika ada):
          </label>
          <Textarea
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
            placeholder="Contoh: Anak kesulitan fokus saat belajar"
            rows={2}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Mengirim...' : 'Kirim Laporan'}
        </Button>
      </form>
    </Card>
  );
}
```

**9.2 Create Daily Report List View (1 jam)**
```typescript
// apps/frontend/src/components/reports/daily-reports-list.tsx

export function DailyReportsList({ studentId, accessToken }: any) {
  const { data: reports } = useQuery({
    queryKey: ['dailyReports', studentId],
    queryFn: async () => {
      const response = await graphqlRequest(
        `query GetDailyReports($studentId: ID!) {
          dailyReports(studentId: $studentId) {
            id
            reportDate
            mood
            activities
            notes
            challenges
            createdAt
          }
        }`,
        { studentId },
        accessToken
      );
      return response.dailyReports;
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Riwayat Laporan</h3>
      
      {reports?.map((report: any) => (
        <Card key={report.id} className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-medium">
                {format(new Date(report.reportDate), 'EEEE, d MMMM yyyy', { locale: id })}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(report.createdAt), {
                  addSuffix: true,
                  locale: id,
                })}
              </p>
            </div>
            <div className="text-3xl">
              {MOOD_OPTIONS.find((m) => m.value === report.mood)?.emoji}
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-medium">Kegiatan:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {report.activities.map((activity: string) => (
                  <span
                    key={activity}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
            
            {report.notes && (
              <div>
                <p className="font-medium">Catatan:</p>
                <p className="text-muted-foreground">{report.notes}</p>
              </div>
            )}
            
            {report.challenges && (
              <div>
                <p className="font-medium text-orange-600">Kendala:</p>
                <p className="text-muted-foreground">{report.challenges}</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
```

**9.3 Add to Parent Dashboard (1 jam)**
```typescript
// apps/frontend/src/components/dashboard/parent-dashboard.tsx

'use client';

import { useAuthStore } from '@/store/auth-store';
import { DailyReportForm } from '@/components/reports/daily-report-form';
import { DailyReportsList } from '@/components/reports/daily-reports-list';

export function ParentDashboard() {
  const { user, accessToken, currentChildId } = useAuthStore();
  
  // Get student ID (for now, use user's own student record)
  const studentId = user?.id; // This should be fetched properly
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Orang Tua</h1>
      
      {/* Child progress overview */}
      <ChildProgressCard studentId={studentId} />
      
      {/* Daily report form */}
      <DailyReportForm
        studentId={studentId}
        accessToken={accessToken}
        onSuccess={() => {
          // Refresh reports list
        }}
      />
      
      {/* Reports history */}
      <DailyReportsList 
        studentId={studentId} 
        accessToken={accessToken} 
      />
    </div>
  );
}
```

**9.4 Test Daily Reports (2 jam)**
- [ ] Login as parent (siswa1)
- [ ] Switch to parent view
- [ ] See daily report form
- [ ] Select mood (e.g., 😄 Sangat Senang)
- [ ] Check activities (multiple)
- [ ] Write notes and challenges
- [ ] Submit report
- [ ] Verify success message
- [ ] See report in history list
- [ ] Login as teacher
- [ ] View student detail
- [ ] See daily reports from parent
- [ ] Test different moods and activities
- [ ] Submit report for multiple days

**Acceptance Criteria:**
- ✅ Parent can submit daily reports
- ✅ All 5 mood options selectable
- ✅ Activity checkboxes work
- ✅ Optional notes and challenges
- ✅ Reports visible in history
- ✅ Teacher can view reports
- ✅ Proper date formatting

---

### DAY 10: Email Notifications (4 jam)

**Goal:** Setup Resend email service dan implement critical notifications

**10.1 Configure Resend (30 min)**
```bash
# Get API key from https://resend.com/
# Free tier: 100 emails/day, 3,000/month

# Add to .env (backend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"
FRONTEND_URL="http://localhost:3000"
```

**10.2 Create Email Templates (1 hour)**
```typescript
// apps/backend/src/email/templates/assignment-graded.ts

export const assignmentGradedTemplate = (data: {
  studentName: string;
  assignmentTitle: string;
  score: number;
  feedback: string;
  assignmentUrl: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .score { font-size: 48px; font-weight: bold; color: #4F46E5; text-align: center; margin: 20px 0; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📝 Tugas Sudah Dinilai!</h1>
    </div>
    <div class="content">
      <p>Halo <strong>${data.studentName}</strong>,</p>
      
      <p>Tugas kamu sudah dinilai oleh guru:</p>
      
      <p><strong>Tugas:</strong> ${data.assignmentTitle}</p>
      
      <div class="score">${data.score}/100</div>
      
      ${data.feedback ? `
        <div style="background: white; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0;">
          <p style="margin: 0;"><strong>Feedback dari Guru:</strong></p>
          <p style="margin: 10px 0 0 0;">${data.feedback}</p>
        </div>
      ` : ''}
      
      <p>Terus semangat belajar ya! 🎉</p>
      
      <a href="${data.assignmentUrl}" class="button">Lihat Detail Tugas</a>
    </div>
    <div class="footer">
      <p>Email ini dikirim otomatis dari LMS ABK</p>
      <p>Jangan balas email ini</p>
    </div>
  </div>
</body>
</html>
`;
```

**10.3 Implement Email Service (1 hour)**
```typescript
// apps/backend/src/email/email.service.ts

import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { assignmentGradedTemplate } from './templates/assignment-graded';

@Injectable()
export class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('RESEND_API_KEY');
    this.fromEmail = this.configService.get('EMAIL_FROM') || 'noreply@lms-abk.com';
    
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
  }

  async sendAssignmentGradedEmail(to: string, data: any) {
    if (!this.resend) {
      console.log('Email service not configured, skipping email');
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `📝 Tugas "${data.assignmentTitle}" sudah dinilai!`,
        html: assignmentGradedTemplate(data),
      });
      
      console.log(`✅ Sent assignment graded email to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  async sendNewAssignmentEmail(to: string, data: any) {
    // Similar implementation
  }

  async sendTeacherNoteEmail(to: string, data: any) {
    // Similar implementation
  }
}
```

**10.4 Trigger Emails on Events (1 hour)**
```typescript
// apps/backend/src/assignments/assignments.service.ts

async gradeSubmission(submissionId: string, gradeData: GradeSubmissionInput, teacherId: string) {
  // ... grading logic ...
  
  const grading = await this.prisma.grading.create({
    data: {
      submissionId,
      teacherId,
      score: gradeData.score,
      feedback: gradeData.feedback,
      gradedAt: new Date(),
    },
    include: {
      submission: {
        include: {
          student: {
            include: {
              user: true,
            },
          },
          assignment: true,
        },
      },
    },
  });
  
  // Send email notification
  await this.emailService.sendAssignmentGradedEmail(
    grading.submission.student.user.email,
    {
      studentName: grading.submission.student.user.studentName || 'Siswa',
      assignmentTitle: grading.submission.assignment.title,
      score: gradeData.score,
      feedback: gradeData.feedback,
      assignmentUrl: `${process.env.FRONTEND_URL}/dashboard/assignments/${grading.submission.assignment.id}`,
    }
  );
  
  return grading;
}
```

**10.5 Test Email Notifications (30 min)**
```bash
# Use Resend test mode or real email

# Test cases:
# 1. Grade an assignment → student receives email
# 2. Create new assignment → students receive email
# 3. Teacher writes note → parent receives email
```

**Acceptance Criteria:**
- ✅ Resend configured correctly
- ✅ Email templates look good
- ✅ Assignment graded → email sent
- ✅ New assignment → email sent
- ✅ Teacher note → email sent
- ✅ Emails arrive within 1 minute
- ✅ Links in emails work

---

## 🎨 WEEK 3: POLISH & TESTING (Priority 3)
**Goal:** UI/UX polish, accessibility, reach 97%  
**Estimated Time:** 5 hari kerja (40 jam)

### DAY 11-12: Accessibility Features (12 jam)

**Font Size Adjustment (4 jam)**
```typescript
// apps/frontend/src/components/accessibility/font-size-control.tsx

export function FontSizeControl() {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  useEffect(() => {
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '20px',
    }[fontSize];
  }, [fontSize]);
  
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={() => setFontSize('small')}>A</Button>
      <Button size="md" onClick={() => setFontSize('medium')}>A</Button>
      <Button size="lg" onClick={() => setFontSize('large')}>A</Button>
    </div>
  );
}
```

**Keyboard Navigation (4 jam)**
- Add proper tab index
- Test all forms with keyboard only
- Add focus indicators
- Implement skip navigation links

**Screen Reader Support (4 jam)**
- Add ARIA labels to all interactive elements
- Test with NVDA/JAWS
- Add alt text to all images
- Proper heading hierarchy

---

### DAY 13-14: Comprehensive Manual Testing (16 jam)

**Create Test Scenarios Document**
```markdown
# TEST SCENARIOS - LMS ABK

## Teacher Workflows
1. Create classroom → add students → create subject → create assignment
2. Grade submissions → send feedback → verify email sent
3. Write teacher notes → read parent replies
4. View student progress → check XP/levels
5. Upload media → use in assignments

## Student Workflows
1. Login → view dashboard → see XP/level
2. View assignments → start quiz → submit → check grade
3. View task analysis → upload photos → submit → see feedback
4. Check progress per subject
5. View teacher notes

## Parent Workflows
1. Login → switch to parent view
2. View child progress → see completion %
3. Submit daily report → check history
4. Read teacher notes → reply
5. View child's grades and feedback

## Edge Cases
1. Empty states (no assignments, no submissions)
2. Long text handling
3. Large file uploads
4. Network errors
5. Expired JWT token
6. Concurrent edits
```

**Execute All Scenarios (12 jam)**
- Test each scenario step-by-step
- Document any bugs found
- Take screenshots of issues
- Verify fixes

**Browser Testing (4 jam)**
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

---

### DAY 15: Performance Optimization (8 jam)

**Frontend Optimization**
- Code splitting
- Image optimization
- Lazy loading components
- Bundle analysis

**Backend Optimization**
- GraphQL query optimization
- Database indexes
- Query result caching (Redis)
- N+1 query prevention

**Performance Targets:**
- Initial load: < 3s
- Page navigation: < 500ms
- API response: < 200ms
- Lighthouse score: > 90

---

## 🚀 WEEK 4: PRODUCTION READY (Final Push)
**Goal:** Deploy, monitor, get to 100%  
**Estimated Time:** 5 hari kerja (40 jam)

### DAY 16: Final Bug Fixes (8 jam)

**Triage All Issues**
- Critical bugs: MUST FIX
- High priority: SHOULD FIX
- Medium/Low: NICE TO FIX

**Fix Remaining Bugs**
- Focus on user-facing issues
- Prioritize data integrity
- Security vulnerabilities first

---

### DAY 17: Documentation (8 jam)

**User Manuals**
```markdown
# PANDUAN GURU
1. Cara membuat kelas
2. Cara menambahkan siswa
3. Cara membuat tugas
4. Cara menilai tugas
5. Cara menulis catatan

# PANDUAN SISWA
1. Cara login
2. Cara mengerjakan tugas
3. Cara melihat nilai
4. Cara melihat progress

# PANDUAN ORANG TUA
1. Cara switch ke parent view
2. Cara mengisi laporan harian
3. Cara membaca catatan guru
4. Cara memantau progress anak
```

**API Documentation**
- GraphQL schema documentation
- All queries and mutations
- Input/output examples
- Error codes

**Deployment Guide**
- Environment variables
- Database setup
- R2 configuration
- Email configuration
- Monitoring setup

---

### DAY 18: Staging Deployment (8 jam)

**Setup Staging Environment**
- Deploy backend to Railway/Render
- Deploy frontend to Vercel
- Configure environment variables
- Setup staging database
- Test all features in staging

---

### DAY 19: Production Deployment (8 jam)

**Deploy to Production**
- Final code review
- Run all tests
- Deploy backend
- Deploy frontend
- Configure DNS
- Setup SSL certificates
- Enable monitoring
- Create backups

**Post-Deployment Checks**
- Health checks
- Test critical flows
- Monitor error logs
- Performance monitoring

---

### DAY 20: Pilot Launch & Monitoring (8 jam)

**Pilot Launch Prep**
- Create pilot user accounts
- Seed pilot data
- Send login instructions
- Prepare support materials

**Day 1 Monitoring**
- Monitor error logs
- Track user activity
- Collect feedback
- Rapid bug fixes

**Success Metrics**
- All users can login ✅
- Can create/submit assignments ✅
- No critical errors ✅
- User satisfaction > 8/10 ✅

---

## 📈 PROGRESS TRACKING

### Week 1 Checklist
- [ ] Assignment creation fixed
- [ ] Student names fixed
- [ ] Test scripts updated
- [ ] Test data complete
- [ ] R2 storage working
- [ ] **Progress: 73% → 85%**

### Week 2 Checklist
- [ ] Edit assignment UI
- [ ] Role switching
- [ ] Teacher notes
- [ ] Daily reports
- [ ] Email notifications
- [ ] **Progress: 85% → 92%**

### Week 3 Checklist
- [ ] Accessibility features
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] **Progress: 92% → 97%**

### Week 4 Checklist
- [ ] Final bug fixes
- [ ] Documentation complete
- [ ] Staging deployment
- [ ] Production deployment
- [ ] Pilot launch
- [ ] **Progress: 97% → 100%**

---

## 🎯 SUCCESS CRITERIA FOR 100%

### Technical (Must Have)
- ✅ All FASE 1 features working
- ✅ Zero critical bugs
- ✅ Test coverage > 80%
- ✅ Performance score > 90
- ✅ Security audit passed
- ✅ Accessibility WCAG 2.1 AA
- ✅ All documentation complete

### User Experience (Must Have)
- ✅ All user flows tested
- ✅ Responsive on mobile/tablet
- ✅ Clear error messages
- ✅ Loading states everywhere
- ✅ Intuitive navigation
- ✅ No broken links

### Production Ready (Must Have)
- ✅ Deployed to production
- ✅ Monitoring setup
- ✅ Backup strategy
- ✅ Rollback plan
- ✅ Support documentation
- ✅ User manuals ready

### Pilot Ready (Must Have)
- ✅ 1 teacher account ready
- ✅ 4 student accounts ready
- ✅ Sample content loaded
- ✅ Parents can access
- ✅ Email notifications working
- ✅ Support channel ready

---

## 💡 TIPS FOR SUCCESS

### Development Best Practices
1. **Test as you build** - Don't wait until the end
2. **Git commits often** - Small, focused commits
3. **Code reviews** - Even self-review helps
4. **Refactor early** - Don't accumulate tech debt
5. **Document as you go** - Don't leave it for later

### Time Management
1. **Focus on one task** - No multitasking
2. **Use Pomodoro** - 25 min work, 5 min break
3. **Track progress daily** - Update checklists
4. **Celebrate small wins** - Motivation matters
5. **Ask for help** - Don't get stuck for hours

### Quality Assurance
1. **Manual test everything** - Automation doesn't catch UI issues
2. **Test edge cases** - Empty states, long text, etc.
3. **Test on different devices** - Desktop, mobile, tablet
4. **Test different browsers** - Chrome, Firefox, Safari
5. **Get user feedback early** - Pilot users are goldmine

---

## 🆘 CONTINGENCY PLANS

### If Behind Schedule

**Week 1 Issues?**
- Focus on critical bugs only (assignment creation, student names)
- Defer R2 setup (use mock/local storage)
- Update fewer test scripts (top 5 only)

**Week 2 Issues?**
- Skip edit assignment (use GraphQL Playground manually)
- Simplify daily reports (remove challenges field)
- Basic email only (no fancy templates)

**Week 3 Issues?**
- Basic accessibility only (font size + alt text)
- Reduce test scenarios (critical paths only)
- Skip performance optimization

**Week 4 Issues?**
- Deploy minimal viable product
- Limited pilot (1 teacher, 2 students)
- Remote support instead of documentation

### If Stuck on Bug

1. **Reproduce consistently** (3 times minimum)
2. **Check logs** (frontend console + backend logs)
3. **Isolate the issue** (remove code until it works)
4. **Google the error** (Stack Overflow is your friend)
5. **Ask AI** (GitHub Copilot, ChatGPT)
6. **Take a break** (20 minutes away helps)
7. **Rubber duck debugging** (explain to someone/something)

---

## 📞 SUPPORT & RESOURCES

### Documentation
- Next.js: https://nextjs.org/docs
- NestJS: https://docs.nestjs.com
- Prisma: https://www.prisma.io/docs
- GraphQL: https://graphql.org/learn
- TailwindCSS: https://tailwindcss.com/docs

### Communities
- Next.js Discord
- NestJS Discord
- Prisma Discord
- Stack Overflow
- Reddit: r/nextjs, r/nestjs

### Tools
- GraphQL Playground (test queries)
- Prisma Studio (view database)
- React DevTools (debug React)
- Chrome DevTools (network, console)
- Postman (API testing)

---

## 🏁 FINAL THOUGHTS

This action plan is **comprehensive but achievable** in 3-4 weeks with focused effort.

**Key Success Factors:**
1. ✅ Start with Week 1 critical fixes immediately
2. ✅ Don't skip testing phases
3. ✅ Document as you build
4. ✅ Stay focused on one task at a time
5. ✅ Celebrate progress along the way

**Remember:** 
- 73% → 100% is possible! 💪
- Quality over speed
- User experience matters
- Done is better than perfect

Good luck! You got this! 🚀

---

**Last Updated:** March 11, 2026  
**Created by:** GitHub Copilot (QA Agent)  
**For:** LMS ABK Project
