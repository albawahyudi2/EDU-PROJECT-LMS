'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth-store';
import { graphqlRequest } from '@/lib/graphql-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import {
  ArrowLeft,
  Loader2,
  FileText,
  FileVideo,
  FileImage,
  File,
  Trash2,
  Download,
  BookOpen,
  Upload,
} from 'lucide-react';
import Link from 'next/link';

// ─── GraphQL ────────────────────────────────────────────────────────────────

const LESSON_DETAIL_QUERY = `
  query LessonDetail($lessonId: String!) {
    lessonDetail(lessonId: $lessonId) {
      id
      title
      media {
        id
        order
        media {
          id
          originalName
          mimeType
          size
          type
          url
          createdAt
        }
      }
    }
  }
`;

const ADD_MEDIA_MUTATION = `
  mutation AddMediaToLesson($lessonId: String!, $mediaId: String!) {
    addMediaToLesson(lessonId: $lessonId, mediaId: $mediaId) {
      id
      media {
        id
        order
        media {
          id
          originalName
          mimeType
          size
          type
          url
          createdAt
        }
      }
    }
  }
`;

const REMOVE_MEDIA_MUTATION = `
  mutation RemoveMediaFromLesson($lessonId: String!, $mediaId: String!) {
    removeMediaFromLesson(lessonId: $lessonId, mediaId: $mediaId) {
      id
    }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getMediaType(mimeType: string): 'IMAGE' | 'VIDEO' | 'PDF' | 'AUDIO' | 'DOCUMENT' {
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType === 'application/pdf') return 'PDF';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  return 'DOCUMENT';
}

const FILE_ICONS: Record<string, JSX.Element> = {
  IMAGE: <FileImage className="h-8 w-8 text-blue-500" />,
  VIDEO: <FileVideo className="h-8 w-8 text-purple-500" />,
  PDF: <FileText className="h-8 w-8 text-red-500" />,
  AUDIO: <File className="h-8 w-8 text-green-500" />,
  DOCUMENT: <FileText className="h-8 w-8 text-orange-500" />,
};

const FILE_BADGE: Record<string, string> = {
  IMAGE: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-purple-100 text-purple-700',
  PDF: 'bg-red-100 text-red-700',
  AUDIO: 'bg-green-100 text-green-700',
  DOCUMENT: 'bg-orange-100 text-orange-700',
};

const FILE_LABEL: Record<string, string> = {
  IMAGE: 'Gambar',
  VIDEO: 'Video',
  PDF: 'PDF',
  AUDIO: 'Audio',
  DOCUMENT: 'Dokumen',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LessonMaterialsPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken, user } = useAuthStore();
  const queryClient = useQueryClient();
  const lessonId = params.lessonId as string;
  const [pendingUpload, setPendingUpload] = useState<{ mediaId: string; url: string } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['lessonDetail', lessonId],
    queryFn: () =>
      graphqlRequest(LESSON_DETAIL_QUERY, { lessonId }, { token: accessToken }),
    enabled: !!accessToken && !!lessonId,
  });

  const addMutation = useMutation({
    mutationFn: ({ mediaId }: { mediaId: string }) =>
      graphqlRequest(ADD_MEDIA_MUTATION, { lessonId, mediaId }, { token: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonDetail', lessonId] });
      setPendingUpload(null);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (mediaId: string) =>
      graphqlRequest(REMOVE_MEDIA_MUTATION, { lessonId, mediaId }, { token: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonDetail', lessonId] });
      setRemovingId(null);
    },
  });

  const handleUploadComplete = (mediaId: string, url: string) => {
    setPendingUpload({ mediaId, url });
    // Auto-attach to lesson
    addMutation.mutate({ mediaId });
  };

  const lesson = data?.lessonDetail;
  const mediaList = lesson?.media ?? [];

  if (user?.role !== 'TEACHER') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Halaman ini hanya untuk guru.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Materi Pelajaran
          </h1>
          {lesson && (
            <p className="text-sm text-muted-foreground">{lesson.title}</p>
          )}
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Materi Baru
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Mendukung: PDF, Word (.doc/.docx), PowerPoint (.ppt/.pptx), Excel (.xls/.xlsx), Gambar, Video, Audio
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* PDF/Document upload */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Dokumen (PDF, Word, PPT, Excel)</p>
            <FileUpload
              mediaType="DOCUMENT"
              folder="lessons/materials"
              onUploadComplete={handleUploadComplete}
              label="Upload Dokumen"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">PDF</p>
            <FileUpload
              mediaType="PDF"
              folder="lessons/materials"
              onUploadComplete={handleUploadComplete}
              label="Upload PDF"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Gambar</p>
            <FileUpload
              mediaType="IMAGE"
              folder="lessons/materials"
              onUploadComplete={handleUploadComplete}
              label="Upload Gambar"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Video</p>
            <FileUpload
              mediaType="VIDEO"
              folder="lessons/materials"
              onUploadComplete={handleUploadComplete}
              label="Upload Video"
            />
          </div>
          {addMutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan ke pelajaran...
            </div>
          )}
          {addMutation.error && (
            <p className="text-sm text-red-500">{(addMutation.error as Error).message}</p>
          )}
        </CardContent>
      </Card>

      {/* Materials List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Daftar Materi ({mediaList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : mediaList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Belum ada materi. Upload file di atas untuk memulai.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {mediaList.map((item: any) => {
                const media = item.media;
                const type = getMediaType(media.mimeType);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="shrink-0">{FILE_ICONS[type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {media.originalName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${FILE_BADGE[type]}`}>
                          {FILE_LABEL[type]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatBytes(media.size)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={media.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4 text-gray-500" />
                      </a>
                      {removingId === media.id ? (
                        <div className="flex gap-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => removeMutation.mutate(media.id)}
                            disabled={removeMutation.isPending}
                          >
                            {removeMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : 'Hapus'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setRemovingId(null)}
                          >
                            Batal
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setRemovingId(media.id)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-red-50 transition-colors"
                          title="Hapus dari pelajaran"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
