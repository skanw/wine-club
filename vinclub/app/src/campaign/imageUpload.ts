import * as path from 'path';
import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { HttpError } from 'wasp/server';
import { requireNodeEnvVar } from '../server/utils';
import { retry } from '../server/utils/retry';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Initialize S3 client with validated environment variables
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    try {
      s3Client = new S3Client({
        region: requireNodeEnvVar('AWS_S3_REGION'),
        credentials: {
          accessKeyId: requireNodeEnvVar('AWS_S3_IAM_ACCESS_KEY'),
          secretAccessKey: requireNodeEnvVar('AWS_S3_IAM_SECRET_KEY'),
        },
      });
    } catch (error) {
      throw new HttpError(
        500,
        'Configuration S3 manquante. Veuillez configurer les variables d\'environnement AWS_S3_REGION, AWS_S3_IAM_ACCESS_KEY et AWS_S3_IAM_SECRET_KEY.'
      );
    }
  }
  return s3Client;
}

export interface ImageUploadResult {
  url: string;
  width?: number;
  height?: number;
  size: number;
}

/**
 * Upload campaign image to S3
 * @param imageFile - Base64 encoded image or File buffer
 * @param caveId - Cave ID for organizing uploads
 * @returns Image URL and metadata
 */
export async function uploadCampaignImage(
  imageFile: string | Buffer,
  caveId: string
): Promise<ImageUploadResult> {
  // Handle base64 encoded images
  let imageBuffer: Buffer;
  let contentType: string;

  if (typeof imageFile === 'string') {
    // Base64 encoded image
    const base64Data = imageFile.replace(/^data:image\/\w+;base64,/, '');
    imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Extract content type from data URL
    const match = imageFile.match(/^data:image\/(\w+);base64,/);
    contentType = match ? `image/${match[1]}` : 'image/jpeg';
  } else {
    imageBuffer = imageFile;
    contentType = 'image/jpeg'; // Default, should be passed in production
  }

  // Validate file size
  if (imageBuffer.length > MAX_IMAGE_SIZE_BYTES) {
    throw new HttpError(400, 'La taille de l\'image dépasse la limite de 5MB');
  }

  // Validate content type
  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    throw new HttpError(
      400,
      `Type d'image invalide. Types autorisés : ${ALLOWED_IMAGE_TYPES.join(', ')}`
    );
  }

  // Generate unique key for the image - prefer WebP for better compression
  // Convert to WebP if possible (for now, keep original format but prefer WebP)
  const ext = contentType.includes('webp') ? 'webp' : contentType.split('/')[1] || 'jpg';
  const key = `campaigns/${caveId}/${randomUUID()}.${ext}`;

  // Get S3 client
  const client = getS3Client();
  const bucketName = requireNodeEnvVar('AWS_S3_FILES_BUCKET');

  // Upload to S3 with retry logic
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: imageBuffer,
    ContentType: contentType,
    CacheControl: 'max-age=31536000', // 1 year cache
  });

  try {
    await retry(
      () => client.send(command),
      {
        maxAttempts: 3,
        delay: 1000,
        onRetry: (attempt, error) => {
          console.warn(`Tentative ${attempt} d'upload S3 échouée, nouvelle tentative...`, {
            requestId: randomUUID(),
            attempt,
            error: error.message,
            key: key.substring(0, 50),
            timestamp: new Date().toISOString(),
          });
        },
      }
    );
  } catch (error) {
    const requestId = randomUUID();
    console.error('Échec de l\'upload S3 après toutes les tentatives', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      key: key.substring(0, 50),
      timestamp: new Date().toISOString(),
    });
    throw new HttpError(
      500,
      'Échec de l\'upload de l\'image. Veuillez réessayer plus tard.'
    );
  }

  // Construct CDN URL (adjust based on your CDN setup)
  const cdnBaseUrl = process.env.CDN_BASE_URL || bucketName;
  const url = `${cdnBaseUrl}/${key}`;

  // TODO: Get image dimensions if needed (requires image processing library)
  // For now, return without dimensions

  return {
    url,
    size: imageBuffer.length,
  };
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File | string): { valid: boolean; error?: string } {
  if (typeof file === 'string') {
    // Base64 string validation
    if (!file.startsWith('data:image/')) {
      return { valid: false, error: 'Invalid image format' };
    }
    return { valid: true };
  }

  // File object validation
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { valid: false, error: 'Image size exceeds 5MB limit' };
  }

  return { valid: true };
}

