// Set this to the max file size you want to allow (currently 5MB).
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'text/*',
  'video/quicktime',
  'video/mp4',
] as const;

type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];

export interface FileUploadError {
  message: string;
  code: 'NO_FILE' | 'INVALID_FILE_TYPE' | 'FILE_TOO_LARGE' | 'UPLOAD_FAILED';
}

export function validateFile(file: File): FileUploadError | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      message: `File size exceeds ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB limit.`,
      code: 'FILE_TOO_LARGE' as const,
    };
  }

  if (!isAllowedFileType(file.type)) {
    return {
      message: `File type '${file.type}' is not supported.`,
      code: 'INVALID_FILE_TYPE' as const,
    };
  }

  return null;
}

function isAllowedFileType(fileType: string): fileType is AllowedFileType {
  return (ALLOWED_FILE_TYPES as readonly string[]).includes(fileType);
}
