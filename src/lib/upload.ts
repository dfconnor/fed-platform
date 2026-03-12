/**
 * Image Upload & Optimization Service
 *
 * Handles S3 presigned URL generation for direct browser uploads,
 * server-side image processing via sharp (resize, convert, thumbnails),
 * and file validation.
 */
// Sharp is imported dynamically to avoid bundling Node.js modules in client code.
// Only server-side functions (processImage, processAndGenerateMetadata) use it.
async function getSharp() {
  const s = await import('sharp');
  return s.default;
}

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

/** Optimization settings applied to every uploaded image */
export const IMAGE_SETTINGS = {
  maxWidth: 2048,
  jpegQuality: 80,
  webpQuality: 80,
  format: 'webp' as const,
} as const;

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

/** Shape returned by the presigned URL endpoint */
export interface PresignedUploadResult {
  /** Presigned PUT URL for direct S3 upload from the browser */
  uploadUrl: string;
  /** Final public URL where the file will be accessible */
  fileUrl: string;
  /** S3 object key */
  key: string;
  /** Seconds until the presigned URL expires */
  expiresIn: number;
}

/** Presigned URLs for every size variant of a single image */
export interface MultiSizePresignedResult {
  /** Presigned URL for the optimized original */
  original: PresignedUploadResult;
  /** Presigned URLs for each thumbnail size */
  thumbnails: Record<ThumbnailSize, PresignedUploadResult>;
}

export type UploadCategory = 'listing' | 'profile' | 'condition_report' | 'verification' | 'damage_claim';

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate a file before upload.
 * Returns an array of errors (empty = valid).
 */
export function validateFile(
  file: { name: string; type: string; size: number },
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
    errors.push({
      field: 'type',
      message: `File type "${file.type}" is not supported. Accepted: JPEG, PNG, WebP, HEIC.`,
    });
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    errors.push({
      field: 'size',
      message: `File is ${sizeMB} MB. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
    });
  }

  if (file.size === 0) {
    errors.push({
      field: 'size',
      message: 'File is empty.',
    });
  }

  return errors;
}

// ---------------------------------------------------------------------------
// S3 Presigned URL Generation
// ---------------------------------------------------------------------------

/**
 * Build the S3 base URL from environment variables.
 */
function getS3BaseUrl(): string {
  const bucket = process.env.S3_BUCKET_NAME || 'rivalrv-uploads';
  const region = process.env.AWS_REGION || 'us-east-1';
  return `https://${bucket}.s3.${region}.amazonaws.com`;
}

/**
 * Generate a unique, URL-safe S3 key for an upload.
 */
function generateKey(
  userId: string,
  category: UploadCategory,
  filename: string,
  suffix?: string,
): string {
  const timestamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const sanitized = filename
    .replace(/\.[^.]+$/, '') // strip extension
    .replace(/[^a-zA-Z0-9-]/g, '_')
    .toLowerCase()
    .slice(0, 64);
  const ext = suffix ? `-${suffix}.webp` : '.webp';
  return `${category}/${userId}/${timestamp}-${rand}-${sanitized}${ext}`;
}

/**
 * Generate a presigned S3 PUT URL for direct browser upload.
 *
 * In production, this calls the AWS SDK to create a real presigned URL.
 * The placeholder implementation returns a mock URL structure that
 * mirrors the real format.
 */
export async function generatePresignedUrl(
  userId: string,
  filename: string,
  contentType: string,
  fileSize: number,
  category: UploadCategory = 'listing',
): Promise<PresignedUploadResult> {
  const key = generateKey(userId, category, filename);
  const baseUrl = getS3BaseUrl();

  // ---------------------------------------------------------------------------
  // Production implementation (uncomment when AWS credentials are configured):
  //
  // import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
  // import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
  //
  // const s3 = new S3Client({ region: process.env.AWS_REGION });
  // const command = new PutObjectCommand({
  //   Bucket: process.env.S3_BUCKET_NAME!,
  //   Key: key,
  //   ContentType: contentType,
  //   ContentLength: fileSize,
  //   Metadata: { userId, category },
  // });
  // const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  // ---------------------------------------------------------------------------

  // Placeholder: mock presigned URL
  const uploadUrl = `${baseUrl}/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=300&X-Amz-SignedHeaders=host`;
  const fileUrl = `${baseUrl}/${key}`;

  return {
    uploadUrl,
    fileUrl,
    key,
    expiresIn: 300,
  };
}

/**
 * Generate presigned URLs for the original image AND all thumbnail sizes.
 * The client uploads the original; a server-side Lambda or webhook
 * generates the thumbnails. The returned URLs tell the client where
 * each variant will live.
 */
export async function generateMultiSizePresignedUrls(
  userId: string,
  filename: string,
  contentType: string,
  fileSize: number,
  category: UploadCategory = 'listing',
): Promise<MultiSizePresignedResult> {
  const baseUrl = getS3BaseUrl();

  const originalKey = generateKey(userId, category, filename);
  const originalUploadUrl = `${baseUrl}/${originalKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=300&X-Amz-SignedHeaders=host`;

  const thumbnails = {} as Record<ThumbnailSize, PresignedUploadResult>;

  for (const [size, config] of Object.entries(THUMBNAIL_SIZES)) {
    const thumbKey = generateKey(userId, category, filename, config.label);
    thumbnails[size as ThumbnailSize] = {
      uploadUrl: `${baseUrl}/${thumbKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=300&X-Amz-SignedHeaders=host`,
      fileUrl: `${baseUrl}/${thumbKey}`,
      key: thumbKey,
      expiresIn: 300,
    };
  }

  return {
    original: {
      uploadUrl: originalUploadUrl,
      fileUrl: `${baseUrl}/${originalKey}`,
      key: originalKey,
      expiresIn: 300,
    },
    thumbnails,
  };
}

// ---------------------------------------------------------------------------
// Server-Side Image Processing (Sharp)
// ---------------------------------------------------------------------------

/**
 * Process an uploaded image buffer:
 *  1. Resize to max 2048px wide (preserving aspect ratio)
 *  2. Convert to WebP at quality 80
 *  3. Generate all thumbnail variants
 *
 * Returns the processed original buffer + thumbnail buffers with metadata.
 */
export async function processImage(
  buffer: Buffer,
): Promise<{
  original: { buffer: Buffer; width: number; height: number; size: number };
  thumbnails: Record<ThumbnailSize, { buffer: Buffer; width: number; height: number; size: number }>;
}> {
  const sharp = await getSharp();

  // Read metadata from input
  const metadata = await sharp(buffer).metadata();

  // Process original: resize + convert to WebP
  const originalPipeline = sharp(buffer)
    .rotate() // auto-rotate based on EXIF
    .resize({
      width: IMAGE_SETTINGS.maxWidth,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({ quality: IMAGE_SETTINGS.webpQuality });

  const originalBuffer = await originalPipeline.toBuffer();
  const originalMeta = await sharp(originalBuffer).metadata();

  // Generate thumbnails
  const thumbnails = {} as Record<
    ThumbnailSize,
    { buffer: Buffer; width: number; height: number; size: number }
  >;

  for (const [size, config] of Object.entries(THUMBNAIL_SIZES)) {
    const thumbBuffer = await sharp(buffer)
      .rotate()
      .resize({
        width: config.width,
        height: config.height,
        fit: 'cover',
        position: 'centre',
      })
      .webp({ quality: IMAGE_SETTINGS.webpQuality })
      .toBuffer();

    const thumbMeta = await sharp(thumbBuffer).metadata();

    thumbnails[size as ThumbnailSize] = {
      buffer: thumbBuffer,
      width: thumbMeta.width ?? config.width,
      height: thumbMeta.height ?? config.height,
      size: thumbBuffer.length,
    };
  }

  return {
    original: {
      buffer: originalBuffer,
      width: originalMeta.width ?? metadata.width ?? IMAGE_SETTINGS.maxWidth,
      height: originalMeta.height ?? metadata.height ?? 0,
      size: originalBuffer.length,
    },
    thumbnails,
  };
}

/**
 * Process a single image and return metadata suitable for database storage.
 * This combines processing + URL generation (without actual S3 upload,
 * which happens client-side via presigned URL or server-side via SDK).
 */
export async function processAndGenerateMetadata(
  buffer: Buffer,
  userId: string,
  filename: string,
  category: UploadCategory = 'listing',
): Promise<UploadedImage> {
  const processed = await processImage(buffer);
  const baseUrl = getS3BaseUrl();
  const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const originalKey = generateKey(userId, category, filename);

  const thumbnailUrls = {} as Record<ThumbnailSize, string>;
  for (const [size, config] of Object.entries(THUMBNAIL_SIZES)) {
    const thumbKey = generateKey(userId, category, filename, config.label);
    thumbnailUrls[size as ThumbnailSize] = `${baseUrl}/${thumbKey}`;
  }

  return {
    id,
    originalFilename: filename,
    key: originalKey,
    url: `${baseUrl}/${originalKey}`,
    thumbnails: thumbnailUrls,
    width: processed.original.width,
    height: processed.original.height,
    size: processed.original.size,
    contentType: 'image/webp',
  };
}
