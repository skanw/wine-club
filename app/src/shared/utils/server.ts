import * as serverUtils from '../../server/utils';
import { ensureArgsSchemaOrThrowHttpError } from '../../server/validation';
import { z } from 'zod';

// Re-export server utilities
export const server = {
  ...serverUtils,
  validation: {
    ensureArgsSchemaOrThrowHttpError
  }
} as const;

// Error types
export type ServerErrorType = 
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'notFound'
  | 'conflict'
  | 'internal';

// Server error class
export class ServerError extends Error {
  constructor(
    public _type: ServerErrorType,
    message: string,
    public _statusCode: number = 500,
    public _details?: any
  ) {
    super(message);
    this.name = 'ServerError';
  }
}

// Error factory functions
export const createError = {
  validation: (message: string, _details?: any) => 
    new ServerError('validation', message, 400, _details),
  
  authentication: (message: string = 'Authentication required') => 
    new ServerError('authentication', message, 401),
  
  authorization: (message: string = 'Insufficient permissions') => 
    new ServerError('authorization', message, 403),
  
  notFound: (message: string = 'Resource not found') => 
    new ServerError('notFound', message, 404),
  
  conflict: (message: string = 'Resource conflict') => 
    new ServerError('conflict', message, 409),
  
  internal: (message: string = 'Internal server error') => 
    new ServerError('internal', message, 500)
};

// Response helpers
export const createResponse = {
  success: <T>(data: T) => ({
    success: true,
    data
  }),

  error: (error: ServerError) => ({
    success: false,
    error: {
      type: error._type,
      message: error.message,
      details: error._details
    }
  })
};

// Request validation helpers
export const validateRequest = {
  body: <T>(data: unknown, schema: z.ZodType): T => {
    return ensureArgsSchemaOrThrowHttpError(schema, data);
  },

  query: <T>(data: unknown, schema: z.ZodType): T => {
    return ensureArgsSchemaOrThrowHttpError(schema, data);
  },

  params: <T>(data: unknown, schema: z.ZodType): T => {
    return ensureArgsSchemaOrThrowHttpError(schema, data);
  }
}; 