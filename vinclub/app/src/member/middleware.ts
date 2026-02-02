import express from 'express';
import type { MiddlewareConfigFn } from 'wasp/server';

/**
 * Middleware configuration for member import operations
 * Increases body size limit to handle large CSV/Excel files (up to 50MB)
 */
export const memberImportMiddlewareConfigFn: MiddlewareConfigFn = (middlewareConfig) => {
  // Increase JSON body size limit for import operations
  // Default is usually 100kb, we need more for large CSV files
  const jsonMiddleware = express.json({ 
    limit: '50mb', // Allow up to 50MB for base64-encoded files
    verify: (req, res, buf) => {
      // Optional: add custom verification if needed
    }
  });

  // Replace the default express.json middleware with our custom one
  middlewareConfig.set('express.json', jsonMiddleware);
  
  return middlewareConfig;
};
