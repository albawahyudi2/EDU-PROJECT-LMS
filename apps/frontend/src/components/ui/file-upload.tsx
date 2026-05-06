'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth-store';

export type MediaType = 'IMAGE' | 'VIDEO' | 'PDF' | 'AUDIO';

interface FileUploadProps {
  onUploadComplete: (mediaId: string, url: string) => void;
  mediaType: MediaType;
  folder?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

const DEFAULT_MAX_SIZES = {
  IMAGE: 5,
  VIDEO: 20,
  PDF: 10,
  AUDIO: 10,
};

const DEFAULT_ACCEPT = {
  IMAGE: 'image/jpeg,image/jpg,image/png,image/gif,image/webp',
  VIDEO: 'video/mp4,video/webm,video/quicktime',
  PDF: 'application/pdf',
  AUDIO: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg',
};

export function FileUpload({
  onUploadComplete,
  mediaType,
  folder = 'uploads',
  accept,
  maxSize,
  className,
  disabled = false,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get token from auth store
  const accessToken = useAuthStore((state) => state.accessToken);

  const maxFileSize = (maxSize || DEFAULT_MAX_SIZES[mediaType]) * 1024 * 1024;
  const acceptedTypes = accept || DEFAULT_ACCEPT[mediaType];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > maxFileSize) {
      const maxSizeMB = maxFileSize / (1024 * 1024);
      setError(`File terlalu besar. Maksimum ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setIsSuccess(false);

    // Generate preview for images and videos
    if (
      (mediaType === 'IMAGE' && selectedFile.type.startsWith('image/')) ||
      (mediaType === 'VIDEO' && selectedFile.type.startsWith('video/'))
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      if (!accessToken) {
        throw new Error('Silakan login terlebih dahulu');
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const GRAPHQL_URL = API_URL.endsWith('/graphql') ? API_URL : `${API_URL}/graphql`;

      // Step 1: Get pre-signed URL from backend (no actual R2 connection on server)
      const presignRes = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          query: `
            mutation GetUploadPresignedUrl($filename: String!, $contentType: String!, $type: MediaType!, $folder: String) {
              getUploadPresignedUrl(filename: $filename, contentType: $contentType, type: $type, folder: $folder) {
                uploadUrl
                publicUrl
                key
              }
            }
          `,
          variables: {
            filename: file.name,
            contentType: file.type,
            type: mediaType,
            folder,
          },
        }),
      });

      const presignData = await presignRes.json();
      if (presignData.errors) throw new Error(presignData.errors[0].message);

      const { uploadUrl, publicUrl, key } = presignData.data.getUploadPresignedUrl;

      // Step 2: Upload directly from browser to R2 (no Railway involved)
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload ke R2 gagal: ${uploadRes.status}`);
      }

      // Step 3: Confirm upload to backend (save to database)
      const confirmRes = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          query: `
            mutation ConfirmMediaUpload($key: String!, $originalName: String!, $mimeType: String!, $size: Int!, $type: MediaType!, $publicUrl: String!) {
              confirmMediaUpload(key: $key, originalName: $originalName, mimeType: $mimeType, size: $size, type: $type, publicUrl: $publicUrl) {
                id
                url
                originalName
                size
              }
            }
          `,
          variables: {
            key,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            type: mediaType,
            publicUrl,
          },
        }),
      });

      const confirmData = await confirmRes.json();
      if (confirmData.errors) throw new Error(confirmData.errors[0].message);

      const uploadedMedia = confirmData.data.confirmMediaUpload;
      setIsSuccess(true);
      onUploadComplete(uploadedMedia.id, uploadedMedia.url);

      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setIsSuccess(false);
        if (inputRef.current) inputRef.current.value = '';
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload gagal');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setIsSuccess(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* File input */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-colors',
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptedTypes}
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />

        {!file ? (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-1">
              Klik untuk pilih {mediaType.toLowerCase()}
            </p>
            <p className="text-xs text-gray-400">
              Maksimum {maxFileSize / (1024 * 1024)}MB
            </p>
          </label>
        ) : (
          <div className="space-y-3">
            {/* Preview */}
            {preview && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                {mediaType === 'VIDEO' ? (
                  <video
                    src={preview}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            )}

            {/* File info */}
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {!isUploading && !isSuccess && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Upload button */}
            {!isSuccess && (
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengupload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Success message */}
      {isSuccess && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Upload berhasil!
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
