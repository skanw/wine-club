import { HttpError } from 'wasp/server';
import * as z from 'zod';
import { createHttpError, ErrorCodes } from './utils/errors';
import { randomUUID } from 'crypto';

export function ensureArgsSchemaOrThrowHttpError<Schema extends z.ZodType>(
  schema: Schema,
  rawArgs: unknown,
  requestId?: string
): z.infer<Schema> {
  const parseResult = schema.safeParse(rawArgs);
  if (!parseResult.success) {
    // Sanitize error output to prevent leaking sensitive user data
    const sanitizedErrors = parseResult.error.errors.map((error) => ({
      path: error.path,
      code: error.code,
      message: error.message,
      // Don't include actual input values in logs
    }));

    const reqId = requestId || randomUUID();

    // Log sanitized error for debugging (without sensitive data)
    console.error('Validation failed:', {
      requestId: reqId,
      schema: schema.constructor.name,
      errors: sanitizedErrors,
      // Don't log rawArgs to prevent data leakage
    });

    throw createHttpError(
      400,
      'Échec de la validation des arguments de l\'opération',
      ErrorCodes.VALIDATION_INVALID_FORMAT,
      {
        requestId: reqId,
        errors: sanitizedErrors,
      }
    );
  } else {
    return parseResult.data;
  }
}
