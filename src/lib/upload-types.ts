/**
 * Client-safe upload types and constants.
 * This file contains NO server-only imports (no sharp, no Node.js modules).
 * Use this for client components that need upload types.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum allowed file size: 10 MB */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Accepted MIME types */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

/** Human-readable accept string for file inputs */
export const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.heic,.heif';

/** Predefined thumbnail sizes used across the platform */
export const THUMBNAIL_SIZES = {
  /** 400x300 - RVCard grid, search results */
  card: { width: 400, height: 300, label: 'card' },
  /** 800x600 - Listing gallery grid thumbnails */
  listing: { width: 800, height: 600, label: 'listing' },
  /** 1200x800 - Detail view / fullscreen modal */
  detail: { width: 1200, height: 800, label: 'detail' },
} as const;

export type ThumbnailSize = keyof typeof THUMBNAIL_SIZES;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Metadata returned after a successful upload + processing pipeline */
export interface UploadedImage {
  /** Unique identifier for the image */
  id: string;
  /** Original filename as provided by the user */
  originalFilename: string;
  /** S3 key for the optimized original */
  key: string;
  /** Public URL for the optimized original (max 2048px wide, WebP) */
  url: string;
  /** Thumbnail URLs keyed by size label */
  thumbnails: Record<ThumbnailSize, string>;
  /** Width of the optimized original in pixels */
  width: number;
  /** Height of the optimized original in pixels */
  height: number;
  /** File size in bytes after optimization */
  size: number;
  /** MIME type after conversion (always image/webp) */
  contentType: string;
}

export type UploadCategory = 'listing' | 'profile' | 'condition_report' | 'verification' | 'damage_claim';
