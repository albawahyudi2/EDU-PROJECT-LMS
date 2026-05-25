'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth-store';
import { graphqlRequest, USER_QUERIES, USER_MUTATIONS } from '@/lib/graphql-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Loader2, Search, GraduationCap, Star, TrendingUp, UserPlus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { LevelBadge } from '@/components/dashboard/progress-components';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface Student {
  id: string;
  userId: string;
  level: number;
  totalXP: number;
  currentXP: number;
  user: {
    id: string;
    email: string;
    studentName: string;
    parentName?: string;
    avatar?: string;
    isActive: boolean;
    lastLoginAt?: string;
  };
}

export default function StudentsPage() {
  const { user, accessToken } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);

  // Redirect if not teacher
  if (user?.role !== 'TEACHER') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Users className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-muted-foreground">Halaman ini hanya untuk guru</p>
      </div>
    );
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['myStudents'],
    queryFn: () => graphqlRequest(USER_QUERIES.MY_STUDENTS, undefined, { token: accessToken }),
    enabled: !!accessToken,
  });

  const students: Student[] = data?.myStudents || [];

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.user.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-600';
    if (level >= 7) return 'text-blue-600';
    if (level >= 4) return 'text-green-600';
    return 'text-gray-600';
  };

  const getLevelTitle = (level: number) => {
    if (level >= 10) return 'Master';
    if (level >= 7) return 'Mahir';
    if (level >= 4) return 'Menengah';
    return 'Pemula';
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Siswa' }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Siswa</h1>
          <p className="text-muted-foreground mt-1">
            {students.length} siswa terdaftar
          </p>
        </div>
        <Button onClick={() => setShowCreateStudentModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Buat Akun Siswa
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari nama atau email siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Error: {(error as Error).message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && students.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada siswa</h3>
          <p className="text-muted-foreground mb-4">
            Siswa yang terdaftar akan muncul di sini
          </p>
          <p className="text-sm text-muted-foreground">
            Tambahkan siswa melalui halaman <Link href="/dashboard/classrooms" className="text-primary hover:underline">Kelas</Link>
          </p>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && !error && students.length > 0 && filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada hasil</h3>
          <p className="text-muted-foreground">
            Tidak ditemukan siswa dengan nama &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {/* Student List */}
      {!isLoading && !error && filteredStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <Link
              key={student.id}
              href={`/dashboard/students/${student.id}`}
            >
              <Card className="hover:shadow-md transition-all hover:border-primary/50 cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Avatar or Initial */}
                      <div className="flex-shrink-0">
                        {student.user.avatar ? (
                          <img
                            src={student.user.avatar}
                            alt={student.user.studentName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary">
                              {student.user.studentName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {student.user.studentName}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground truncate">
                          {student.user.email}
                        </p>
                      </div>
                    </div>

                    <LevelBadge level={student.level} size="sm" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Level Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Level</span>
                    </div>
                    <span className={`font-semibold ${getLevelColor(student.level)}`}>
                      {student.level} - {getLevelTitle(student.level)}
                    </span>
                  </div>

                  {/* Total XP */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-muted-foreground">Total XP</span>
                    </div>
                    <span className="font-semibold text-yellow-600">
                      {student.totalXP.toLocaleString()}
                    </span>
                  </div>

                  {/* XP Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress ke Level {student.level + 1}</span>
                      <span>{student.currentXP} XP</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                        style={{
                          width: `${(student.currentXP / (student.level * 100)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Badge
                      variant={student.user.isActive ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {student.user.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                    {student.user.parentName && (
                      <span className="text-xs text-muted-foreground truncate flex-1">
                        Ortu: {student.user.parentName}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Statistics Summary */}
      {!isLoading && !error && students.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Siswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">
                  {students.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rata-rata Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">
                  {students.length > 0
                    ? (students.reduce((sum, s) => sum + s.level, 0) / students.length).toFixed(1)
                    : '0'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">
                  {students.reduce((sum, s) => sum + s.totalXP, 0).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showCreateStudentModal && (
        <CreateStudentModal
          onClose={() => setShowCreateStudentModal(false)}
          onSuccess={() => setShowCreateStudentModal(false)}
        />
      )}
    </div>
  );
}

// ============================================
// CREATE STUDENT MODAL
// ============================================

function CreateStudentModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classroomId, setClassroomId] = useState('');

  // Fetch daftar kelas milik guru
  const { data: classroomsData, isLoading: loadingClassrooms } = useQuery({
    queryKey: ['myClassrooms'],
    queryFn: () => graphqlRequest(USER_QUERIES.MY_CLASSROOMS, undefined, { token: accessToken }),
    enabled: !!accessToken,
  });
  const classrooms = classroomsData?.myClassrooms || [];

  // Automatically select the first classroom as the default
  useEffect(() => {
    if (classrooms.length > 0 && !classroomId) {
      setClassroomId(classrooms[0].id);
    }
  }, [classrooms, classroomId]);

  const createMutation = useMutation({
    mutationFn: (input: any) =>
      graphqlRequest(USER_MUTATIONS.CREATE_STUDENT, { input }, { token: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myStudents'] });
      queryClient.invalidateQueries({ queryKey: ['classroom', classroomId] });
      queryClient.invalidateQueries({ queryKey: ['availableStudents', classroomId] });
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      onSuccess();
    },
  });

  const isSubmitting = createMutation.isPending;
  const mutationError = createMutation.error;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !parentName.trim() || !email.trim() || !password.trim() || !classroomId) return;

    createMutation.mutate({
      classroomId,
      studentName: studentName.trim(),
      parentName: parentName.trim() || undefined,
      email: email.trim(),
      password,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Buat Akun Siswa Baru</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">



          <div className="space-y-2">
            <Label htmlFor="cs-studentName">Nama Siswa *</Label>
            <input
              id="cs-studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nama lengkap siswa"
              required
              autoFocus
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cs-parentName">Nama Orang Tua *</Label>
            <input
              id="cs-parentName"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="Nama orang tua atau wali"
              required
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cs-email">Email Akun *</Label>
            <input
              id="cs-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Digunakan orang tua atau siswa untuk masuk ke platform.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cs-password">Password Sementara *</Label>
            <input
              id="cs-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Berikan password ini kepada orang tua siswa.
            </p>
          </div>

          {mutationError && (
            <p className="text-sm text-destructive">{(mutationError as Error).message}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={
                isSubmitting ||
                loadingClassrooms ||
                !studentName.trim() ||
                !parentName.trim() ||
                !email.trim() ||
                !password.trim() ||
                !classroomId
              }
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Buat Akun
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
