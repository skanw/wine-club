import express from 'express';
import type { MiddlewareConfigFn } from 'wasp/server';

/**
 * Global middleware configuration
 * Increases body size limit to handle large file uploads (CSV/Excel imports)
 */
export const serverMiddlewareFn: MiddlewareConfigFn = (middlewareConfig) => {
  // Increase JSON body size limit for operations (default is ~100kb)
  // This allows large CSV/Excel files to be uploaded as base64
  // 100MB limit accounts for base64 encoding overhead (~33% increase)
  // This supports files up to ~75MB original size
  const jsonMiddleware = express.json({ 
    limit: '100mb'
  });

  // Also increase urlencoded limit for form data
  const urlencodedMiddleware = express.urlencoded({ 
    limit: '100mb',
    extended: true 
  });

  // Replace the default middleware with our custom ones
  middlewareConfig.set('express.json', jsonMiddleware);
  middlewareConfig.set('express.urlencoded', urlencodedMiddleware);
  
  return middlewareConfig;
};
