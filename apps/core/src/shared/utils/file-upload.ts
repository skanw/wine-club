import * as s3Utils from '../../file-upload/s3Utils';

// File types
export type FileType = 'image' | 'document' | 'video' | 'audio' | 'other';

// File metadata interface
export interface FileMetadata {
  name: string;
  type: FileType;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  url: string;
}

// File upload options
export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: FileType[];
  path?: string;
  metadata?: Record<string, any>;
}

// Re-export S3 utilities
export const storage = {
  s3: s3Utils
} as const;

// Get file type from mime type
export const getFileType = (mimeType: string): FileType => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('document') ||
    mimeType.includes('text/')
  ) {
    return 'document';
  }
  return 'other';
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Validate file
export const validateFile = (file: File, options: FileUploadOptions = {}): string | null => {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = ['image', 'document', 'video', 'audio', 'other']
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return `File size exceeds maximum limit of ${formatFileSize(maxSize)}`;
  }

  // Check file type
  const fileType = getFileType(file.type);
  if (!allowedTypes.includes(fileType)) {
    return `File type ${fileType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }

  return null;
};

// Generate safe filename
export const getSafeFilename = (filename: string): string => {
  // Remove special characters and spaces
  const safeName = filename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-');

  // Add timestamp to ensure uniqueness
  const timestamp = Date.now();
  const ext = safeName.split('.').pop();
  const name = safeName.split('.').slice(0, -1).join('.');

  return `${name}-${timestamp}.${ext}`;
}; 