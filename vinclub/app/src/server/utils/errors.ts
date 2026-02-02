import { HttpError } from 'wasp/server';
import { randomUUID } from 'crypto';

/**
 * Error factory for consistent error format across the codebase
 * All errors include a code, message, and optional details
 */
export interface ErrorDetails {
  code?: string;
  requestId?: string;
  [key: string]: any;
}

/**
 * Create a standardized HttpError with consistent format
 * @param status - HTTP status code
 * @param message - Human-readable error message (in French)
 * @param code - Error code for programmatic handling (optional, defaults to HTTP_{status})
 * @param details - Additional error details (optional)
 * @returns HttpError instance
 */
export function createHttpError(
  status: number,
  message: string,
  code?: string,
  details?: Record<string, any>
): HttpError {
  const errorCode = code || `HTTP_${status}`;
  const requestId = details?.requestId || randomUUID();

  return new HttpError(status, message, {
    code: errorCode,
    requestId,
    ...details,
  });
}

/**
 * Common error codes used throughout the application
 */
export const ErrorCodes = {
  // Authentication errors
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_CREDENTIALS_INVALID: 'AUTH_CREDENTIALS_INVALID',

  // Authorization errors
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
  AUTH_TENANT_MISMATCH: 'AUTH_TENANT_MISMATCH',
  AUTH_NO_CAVE: 'AUTH_NO_CAVE',

  // Validation errors
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  VALIDATION_OUT_OF_RANGE: 'VALIDATION_OUT_OF_RANGE',
  VALIDATION_DUPLICATE: 'VALIDATION_DUPLICATE',

  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  RESOURCE_DELETED: 'RESOURCE_DELETED',

  // Business logic errors
  CAMPAIGN_INVALID_STATUS: 'CAMPAIGN_INVALID_STATUS',
  SUBSCRIPTION_INVALID_STATE: 'SUBSCRIPTION_INVALID_STATE',
  MEMBER_DUPLICATE: 'MEMBER_DUPLICATE',
} as const;

