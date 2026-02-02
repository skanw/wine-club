import { HttpError } from 'wasp/server';
import type {
  GetCave,
  UpdateCave,
  UploadCaveLogo,
} from 'wasp/server/operations';
import { requireAuthenticatedCave } from '../server/utils/tenant';
import { getUploadFileSignedURLFromS3ForCave, getDownloadFileSignedURLFromS3 } from '../file-upload/s3Utils';
import * as z from 'zod';

const updateCaveSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  email: z.string().email().optional().nullable(),
});

/**
 * Get cave information
 */
export const getCave: GetCave<
  void,
  {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
  }
> = async (_args, context) => {
  const caveId = requireAuthenticatedCave(context);
  
  const cave = await context.entities.Cave.findUnique({
    where: { id: caveId },
  });

  if (!cave) {
    throw new HttpError(404, 'Cave introuvable');
  }
  
  return {
    id: cave.id,
    name: cave.name,
    address: cave.address,
    phone: cave.phone,
    email: cave.email,
    logoUrl: cave.logoUrl || null,
  };
};

/**
 * Update cave information
 */
export const updateCave: UpdateCave<
  z.infer<typeof updateCaveSchema>,
  { id: string }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const data = updateCaveSchema.parse(rawArgs);

  const updated = await context.entities.Cave.update({
    where: { id: caveId },
    data,
  });

  return { id: updated.id };
};

/**
 * Upload cave logo
 */
export const uploadCaveLogo: UploadCaveLogo<
  { fileName: string; fileType: string },
  {
    s3UploadUrl: string;
    s3UploadFields: Record<string, string>;
    key: string;
  }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { fileName, fileType } = rawArgs;

  // Validate file type (images only)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(fileType.toLowerCase())) {
    throw new HttpError(400, 'Type de fichier non supporté. Utilisez JPEG, PNG, WebP ou SVG.');
  }

  // Get presigned URL for upload
  const { s3UploadUrl, s3UploadFields, key } = await getUploadFileSignedURLFromS3ForCave({
    fileName,
    fileType,
    caveId,
  });

  // Update cave with logo URL (will be updated after actual upload)
  const logoUrl = `${process.env.AWS_S3_BUCKET_PUBLIC_URL || ''}/${key}`;
  
  await context.entities.Cave.update({
    where: { id: caveId },
    data: { logoUrl },
  });

  return {
    s3UploadUrl,
    s3UploadFields,
    key,
  };
};
