import { z } from 'zod';

/**
 * Campaign audience type enum
 */
export const audienceTypeSchema = z.enum(['all', 'tag', 'region', 'custom']);

/**
 * Campaign channel enum
 */
export const channelSchema = z.enum(['sms', 'email']);

/**
 * Campaign type enum
 */
export const campaignTypeSchema = z.enum(['daily_drop', 'newsletter', 'event']);

/**
 * Campaign status enum
 */
export const campaignStatusSchema = z.enum(['draft', 'scheduled', 'sending', 'sent', 'failed']);

/**
 * Validation schema for campaign audience
 */
export const audienceSchema = z.object({
  type: audienceTypeSchema,
  value: z.array(z.string()).default([]),
});

/**
 * Product schema for multiple products support
 */
const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du produit est requis')
    .max(200, 'Le nom du produit doit contenir 200 caractères ou moins'),
  price: z
    .number()
    .positive('Le prix doit être positif')
    .max(9999.99, 'Le prix doit être inférieur à 10000'),
});

/**
 * Validation schema for creating a campaign (Daily Drop)
 */
export const createCampaignSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom de la campagne est requis')
    .max(200, 'Le nom de la campagne doit contenir 200 caractères ou moins'),
  type: campaignTypeSchema.default('daily_drop'),
  // Backward compatibility: productName and productPrice are required if products array is not provided
  productName: z
    .string()
    .min(1, 'Le nom du produit est requis')
    .max(200, 'Le nom du produit doit contenir 200 caractères ou moins')
    .optional(),
  productPrice: z
    .number()
    .positive('Le prix doit être positif')
    .max(9999.99, 'Le prix doit être inférieur à 10000')
    .optional(),
  // New: products array for multiple products
  products: z
    .array(productSchema)
    .min(1, 'Au moins un produit est requis')
    .optional(),
  message: z
    .string()
    .min(1, 'Le message est requis')
    .max(500, 'Le message doit contenir 500 caractères ou moins'),
  imageUrl: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        // Allow base64 data URLs, http/https URLs, or empty string
        return (
          val.startsWith('data:image/') ||
          val.startsWith('http://') ||
          val.startsWith('https://') ||
          val === ''
        );
      },
      'URL d\'image invalide (doit être une URL http/https ou une image base64)'
    )
    .optional()
    .nullable(),
  audience: audienceSchema,
  channels: z
    .array(channelSchema)
    .min(1, 'Au moins un canal doit être sélectionné'),
  maxQuantity: z
    .number()
    .int()
    .positive('Max quantity must be positive')
    .optional()
    .nullable(),
  sendImmediately: z.boolean().default(false),
  // Loi Evin: when set, server loads template body and substitutes placeholders with product/cave
  templateId: z.string().uuid().optional(),
}).refine(
  (data) => {
    // Either products array OR productName/productPrice must be provided
    if (data.products && data.products.length > 0) {
      return true;
    }
    return !!(data.productName && data.productPrice !== undefined);
  },
  {
    message: 'Vous devez fournir soit un tableau de produits, soit un nom et un prix de produit',
  }
);

/**
 * Validation schema for updating a campaign
 */
export const updateCampaignSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom de la campagne est requis')
    .max(200, 'Le nom de la campagne doit contenir 200 caractères ou moins')
    .optional(),
  productName: z
    .string()
    .min(1, 'Le nom du produit est requis')
    .max(200, 'Le nom du produit doit contenir 200 caractères ou moins')
    .optional(),
  productPrice: z
    .number()
    .positive('Le prix doit être positif')
    .max(9999.99, 'Le prix doit être inférieur à 10000')
    .optional(),
  message: z
    .string()
    .min(1, 'Le message est requis')
    .max(500, 'Le message doit contenir 500 caractères ou moins')
    .optional(),
  imageUrl: z.string().url('URL d\'image invalide').optional().nullable(),
  audience: audienceSchema.optional(),
  channels: z
    .array(channelSchema)
    .min(1, 'Au moins un canal doit être sélectionné')
    .optional(),
  maxQuantity: z
    .number()
    .int()
    .positive('Max quantity must be positive')
    .optional()
    .nullable(),
});

/**
 * Validation schema for campaign list query parameters
 */
export const getPaginatedCampaignsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: campaignStatusSchema.optional(),
  sort: z.enum(['created_at', 'sent_at', 'name']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Validation schema for campaign ID parameter
 */
export const campaignIdSchema = z.object({
  id: z.string().uuid('ID de campagne invalide'),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type GetPaginatedCampaignsInput = z.infer<typeof getPaginatedCampaignsSchema>;
export type CampaignIdInput = z.infer<typeof campaignIdSchema>;
export type Audience = z.infer<typeof audienceSchema>;

