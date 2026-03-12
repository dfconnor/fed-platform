'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  ACCEPTED_EXTENSIONS,
  type AllowedMimeType,
  type UploadedImage,
} from '@/lib/upload-types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FileUploadState {
  /** Client-generated ID for tracking */
  id: string;
  file: File;
  /** 0-100 */
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
  /** Preview data URL (generated client-side) */
  previewUrl?: string;
  /** Resulting image metadata after upload */
  result?: UploadedImage;
}

export interface ImageUploaderProps {
  /** Called whenever the list of successfully uploaded images changes */
  onUpload: (images: UploadedImage[]) => void;
  /** Maximum number of images (default: 20) */
  maxFiles?: number;
  /** Upload category passed to the API */
  category?: 'listing' | 'profile' | 'condition_report' | 'verification' | 'damage_claim';
  /** Pre-existing images (for editing an existing listing) */
  initialImages?: UploadedImage[];
  className?: string;
}

const MAX_IMAGES_DEFAULT = 20;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ImageUploader({
  onUpload,
  maxFiles = MAX_IMAGES_DEFAULT,
  category = 'listing',
  initialImages = [],
  className,
}: ImageUploaderProps) {
  const [files, setFiles] = useState<FileUploadState[]>(() =>
    initialImages.map((img) => ({
      id: img.id,
      file: new File([], img.originalFilename),
      progress: 100,
      status: 'complete' as const,
      previewUrl: img.thumbnails.card || img.url,
      result: img,
    })),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [coverImageId, setCoverImageId] = useState<string | null>(
    initialImages[0]?.id ?? null,
  );
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItemRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Keep parent in sync whenever uploaded images or order changes
  const completedImages = files
    .filter((f) => f.status === 'complete' && f.result)
    .map((f) => f.result!);

  useEffect(() => {
    onUpload(completedImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // Set cover to first image if not set
  useEffect(() => {
    if (!coverImageId && completedImages.length > 0) {
      setCoverImageId(completedImages[0].id);
    }
  }, [coverImageId, completedImages]);

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------

  function validateFiles(incoming: File[]): { valid: File[]; errors: string[] } {
    const errors: string[] = [];
    const valid: File[] = [];
    const remaining = maxFiles - files.length;

    if (remaining <= 0) {
      errors.push(`Maximum of ${maxFiles} images allowed.`);
      return { valid, errors };
    }

    const toProcess = incoming.slice(0, remaining);
    if (incoming.length > remaining) {
      errors.push(
        `Only ${remaining} more image${remaining === 1 ? '' : 's'} can be added. ${incoming.length - remaining} file${incoming.length - remaining === 1 ? ' was' : 's were'} skipped.`,
      );
    }

    for (const file of toProcess) {
      if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
        errors.push(`"${file.name}" is not a supported image type.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        const mb = (file.size / (1024 * 1024)).toFixed(1);
        errors.push(`"${file.name}" is ${mb} MB (max 10 MB).`);
        continue;
      }
      if (file.size === 0) {
        errors.push(`"${file.name}" is empty.`);
        continue;
      }
      valid.push(file);
    }

    return { valid, errors };
  }

  // -------------------------------------------------------------------------
  // Upload logic
  // -------------------------------------------------------------------------

  const uploadFile = useCallback(
    async (fileState: FileUploadState) => {
      try {
        // 1. Request presigned URL from our API
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: fileState.file.name,
            contentType: fileState.file.type,
            fileSize: fileState.file.size,
            category,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(err.error || 'Failed to get upload URL');
        }

        const data = await res.json();

        // 2. Upload directly to S3 via presigned URL (simulated progress)
        // In production this would be an XHR/fetch PUT to data.uploadUrl
        // with progress tracking via XMLHttpRequest.
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id ? { ...f, status: 'uploading' as const, progress: 30 } : f,
          ),
        );

        // Simulate upload progress
        await simulateProgress(fileState.id, 30, 90);

        // 3. Build result metadata
        const result: UploadedImage = {
          id: fileState.id,
          originalFilename: fileState.file.name,
          key: data.key,
          url: data.sizes?.original?.fileUrl ?? data.fileUrl,
          thumbnails: {
            card: data.sizes?.card?.fileUrl ?? data.fileUrl,
            listing: data.sizes?.listing?.fileUrl ?? data.fileUrl,
            detail: data.sizes?.detail?.fileUrl ?? data.fileUrl,
          },
          width: 0,
          height: 0,
          size: fileState.file.size,
          contentType: 'image/webp',
        };

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id
              ? { ...f, status: 'complete' as const, progress: 100, result }
              : f,
          ),
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id
              ? { ...f, status: 'error' as const, error: message }
              : f,
          ),
        );
      }
    },
    [category],
  );

  /** Simulated progress (replace with real XHR progress in production) */
  function simulateProgress(fileId: string, from: number, to: number): Promise<void> {
    return new Promise((resolve) => {
      let current = from;
      const interval = setInterval(() => {
        current += Math.random() * 15;
        if (current >= to) {
          current = to;
          clearInterval(interval);
          resolve();
        }
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: Math.round(current) } : f,
          ),
        );
      }, 120);
    });
  }

  // -------------------------------------------------------------------------
  // File handling
  // -------------------------------------------------------------------------

  const handleFiles = useCallback(
    (incoming: File[]) => {
      const { valid, errors } = validateFiles(incoming);

      if (errors.length > 0) {
        // Show errors as transient file entries
        const errorEntries: FileUploadState[] = errors.map((msg, i) => ({
          id: `err_${Date.now()}_${i}`,
          file: new File([], 'error'),
          progress: 0,
          status: 'error' as const,
          error: msg,
        }));
        setFiles((prev) => [...prev, ...errorEntries]);

        // Auto-remove error entries after 5 seconds
        setTimeout(() => {
          setFiles((prev) =>
            prev.filter((f) => !errorEntries.some((e) => e.id === f.id)),
          );
        }, 5000);
      }

      if (valid.length === 0) return;

      const newEntries: FileUploadState[] = valid.map((file) => {
        const id = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        return {
          id,
          file,
          progress: 0,
          status: 'pending' as const,
          previewUrl: URL.createObjectURL(file),
        };
      });

      setFiles((prev) => [...prev, ...newEntries]);

      // Start uploads
      for (const entry of newEntries) {
        uploadFile(entry);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files.length, maxFiles, uploadFile],
  );

  // -------------------------------------------------------------------------
  // Drag & drop handlers
  // -------------------------------------------------------------------------

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only leave if we exit the drop zone itself
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/'),
      );
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [handleFiles],
  );

  // -------------------------------------------------------------------------
  // Reorder via drag
  // -------------------------------------------------------------------------

  function handleReorderDragStart(index: number) {
    dragItemRef.current = index;
  }

  function handleReorderDragEnter(index: number) {
    setDragOverIndex(index);
  }

  function handleReorderDragEnd() {
    if (dragItemRef.current === null || dragOverIndex === null) {
      setDragOverIndex(null);
      return;
    }

    const from = dragItemRef.current;
    const to = dragOverIndex;

    if (from !== to) {
      setFiles((prev) => {
        const updated = [...prev];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        return updated;
      });
    }

    dragItemRef.current = null;
    setDragOverIndex(null);
  }

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  function handleDelete(id: string) {
    setFiles((prev) => {
      const entry = prev.find((f) => f.id === id);
      if (entry?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(entry.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });

    if (coverImageId === id) {
      setCoverImageId(null);
    }
  }

  function handleSetCover(id: string) {
    setCoverImageId(id);
    // Move to front
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx <= 0) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(idx, 1);
      updated.unshift(moved);
      return updated;
    });
  }

  function handleRetry(id: string) {
    const entry = files.find((f) => f.id === id);
    if (!entry) return;
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: 'pending' as const, progress: 0, error: undefined } : f,
      ),
    );
    uploadFile(entry);
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const uploadCount = files.filter((f) => f.status !== 'error' || f.file.name !== 'error').length;
  const hasRoom = uploadCount < maxFiles;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop zone */}
      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => hasRoom && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hasRoom && fileInputRef.current?.click();
          }
        }}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors cursor-pointer',
          isDragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100',
          !hasRoom && 'opacity-50 cursor-not-allowed',
        )}
      >
        {/* Icon changes on drag */}
        {isDragging ? (
          <svg
            className="h-12 w-12 text-brand-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        ) : (
          <>
            {/* Camera icon for mobile, upload icon for desktop */}
            <svg
              className="h-12 w-12 text-gray-400 hidden sm:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            <svg
              className="h-12 w-12 text-gray-400 sm:hidden"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              />
            </svg>
          </>
        )}

        <div>
          <p className="text-sm font-medium text-gray-700">
            {isDragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            JPEG, PNG, WebP, or HEIC &middot; Max 10 MB each &middot; Up to {maxFiles} images
          </p>
        </div>

        {/* Mobile-friendly camera button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="sm:hidden btn-secondary text-sm px-4 py-2 mt-1"
        >
          <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add Photos
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          multiple
          className="hidden"
          onChange={(e) => {
            const selected = Array.from(e.target.files || []);
            if (selected.length > 0) handleFiles(selected);
            // Reset so selecting the same file again works
            e.target.value = '';
          }}
        />
      </div>

      {/* Image count */}
      {files.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {uploadCount} of {maxFiles} images
          </span>
          {coverImageId && (
            <span className="text-xs text-gray-400">
              Drag to reorder &middot; First image is the cover photo
            </span>
          )}
        </div>
      )}

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {files.map((fileState, index) => {
            // Skip pure error entries (validation messages)
            if (fileState.status === 'error' && fileState.file.name === 'error') {
              return (
                <div
                  key={fileState.id}
                  className="relative aspect-[4/3] rounded-xl border-2 border-red-200 bg-red-50 flex items-center justify-center p-3"
                >
                  <p className="text-xs text-red-600 text-center leading-tight">
                    {fileState.error}
                  </p>
                </div>
              );
            }

            const isCover = fileState.id === coverImageId;

            return (
              <div
                key={fileState.id}
                draggable={fileState.status === 'complete'}
                onDragStart={() => handleReorderDragStart(index)}
                onDragEnter={() => handleReorderDragEnter(index)}
                onDragEnd={handleReorderDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={cn(
                  'group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all',
                  isCover ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200',
                  dragOverIndex === index && 'border-brand-400 scale-[1.02]',
                  fileState.status === 'complete' && 'cursor-grab active:cursor-grabbing',
                )}
              >
                {/* Preview image */}
                {fileState.previewUrl && (
                  <img
                    src={fileState.previewUrl}
                    alt={fileState.file.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}

                {/* Loading overlay */}
                {(fileState.status === 'pending' || fileState.status === 'uploading') && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                    <div className="w-3/4 h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${fileState.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-white font-medium">
                      {fileState.progress}%
                    </span>
                  </div>
                )}

                {/* Error overlay */}
                {fileState.status === 'error' && fileState.file.name !== 'error' && (
                  <div className="absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center gap-2 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-xs text-white text-center leading-tight">
                      {fileState.error}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRetry(fileState.id)}
                      className="text-xs text-white underline hover:no-underline"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Cover badge */}
                {isCover && fileState.status === 'complete' && (
                  <div className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
                    Cover
                  </div>
                )}

                {/* Action buttons (visible on hover) */}
                {fileState.status === 'complete' && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(fileState.id);
                      }}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      aria-label={`Delete ${fileState.file.name}`}
                    >
                      <svg className="h-4 w-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Set as cover button */}
                    {!isCover && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetCover(fileState.id);
                        }}
                        className="absolute bottom-2 left-2 right-2 bg-white/90 hover:bg-white text-xs text-gray-700 font-medium py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow text-center"
                      >
                        Set as cover photo
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add more button if room */}
          {hasRoom && files.some((f) => f.status === 'complete') && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-xs text-gray-500 font-medium">Add more</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
