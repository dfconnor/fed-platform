/**
 * Image Upload API Route
 *
 * POST /api/upload - Generate presigned S3 URLs for client-side image upload
 *
 * Accepts file metadata (name, type, size), validates the file, and returns
 * presigned URLs for the original image AND all thumbnail size variants.
 * The client uploads directly to S3 via the presigned URL; a server-side
 * process (Lambda, webhook, or on-demand) generates the thumbnails.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import {
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  THUMBNAIL_SIZES,
  type ThumbnailSize,
} from '@/lib/upload';

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const uploadRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().refine(
    (type) => (ALLOWED_MIME_TYPES as readonly string[]).includes(type),
    { message: `Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}` },
  ),
  fileSize: z.number().int().min(1).max(MAX_FILE_SIZE, {
    message: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
  }),
  category: z
    .enum(['listing', 'profile', 'condition_report'])
    .optional()
    .default('listing'),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getS3BaseUrl(): string {
  const bucket = process.env.S3_BUCKET_NAME || 'rivalrv-uploads';
  const region = process.env.AWS_REGION || 'us-east-1';
  return `https://${bucket}.s3.${region}.amazonaws.com`;
}

function generateKey(
  userId: string,
  category: string,
  filename: string,
  suffix?: string,
): string {
  const timestamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const sanitized = filename
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-]/g, '_')
    .toLowerCase()
    .slice(0, 64);
  const ext = suffix ? `-${suffix}.webp` : '.webp';
  return `${category}/${userId}/${timestamp}-${rand}-${sanitized}${ext}`;
}

interface SizeUrls {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

/**
 * Generate presigned S3 URL for a single key.
 *
 * In production, replace the mock URL with a real presigned URL
 * from the AWS SDK (see commented code below).
 */
async function generatePresignedUrl(
  key: string,
  contentType: string,
  fileSize: number,
  userId: string,
  category: string,
): Promise<SizeUrls> {
  const baseUrl = getS3BaseUrl();

  // ---------------------------------------------------------------------------
  // Production implementation:
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

  const uploadUrl = `${baseUrl}/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=300&X-Amz-SignedHeaders=host`;
  const fileUrl = `${baseUrl}/${key}`;

  return { uploadUrl, fileUrl, key };
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse + validate
    const body = await request.json();
    const data = uploadRequestSchema.parse(body);

    const userId = session.user.id;
    const { filename, contentType, fileSize, category } = data;

    // Generate key for the original upload
    const originalKey = generateKey(userId, category, filename);

    // Generate presigned URL for the original image
    const original = await generatePresignedUrl(
      originalKey,
      contentType,
      fileSize,
      userId,
      category,
    );

    // Generate presigned URLs for each thumbnail size.
    // In production, thumbnails are generated server-side after the original
    // is uploaded (via S3 event -> Lambda, or a processing webhook).
    // These URLs tell the client where each variant will eventually live.
    const sizes: Record<string, SizeUrls> = {
      original,
    };

    for (const [sizeName, config] of Object.entries(THUMBNAIL_SIZES)) {
      const thumbKey = generateKey(userId, category, filename, config.label);
      sizes[sizeName] = await generatePresignedUrl(
        thumbKey,
        'image/webp', // thumbnails always WebP
        0, // size unknown until processed
        userId,
        category,
      );
    }

    return NextResponse.json({
      // Primary upload URL for the original file
      uploadUrl: original.uploadUrl,
      fileUrl: original.fileUrl,
      key: original.key,
      expiresIn: 300,
      // All size variants (original + card + listing + detail)
      sizes,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid upload request', details: error.errors },
        { status: 400 },
      );
    }
    console.error('POST /api/upload error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 },
    );
  }
}
