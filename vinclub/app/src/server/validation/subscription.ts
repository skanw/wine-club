import { z } from 'zod';

/**
 * Billing cycle enum
 */
export const billingCycleSchema = z.enum(['monthly', 'quarterly', 'yearly']);

/**
 * Subscription status enum
 */
export const subscriptionStatusSchema = z.enum(['active', 'paused', 'cancelled', 'past_due']);

/**
 * Wine box status enum
 */
export const wineBoxStatusSchema = z.enum(['pending', 'packed', 'shipped', 'ready_for_pickup']);

/**
 * Validation schema for creating a subscription plan
 */
export const createSubscriptionPlanSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du plan est requis')
    .max(200, 'Le nom du plan doit contenir 200 caractères ou moins'),
  description: z.string().max(500, 'La description doit contenir 500 caractères ou moins').optional(),
  amount: z
    .number()
    .positive('Le montant doit être positif')
    .max(9999.99, 'Le montant doit être inférieur à 10000'),
  currency: z.string().length(3, 'La devise doit contenir 3 caractères (ex. : EUR)').default('EUR'),
  billingCycle: billingCycleSchema.default('monthly'),
  wineCount: z
    .number()
    .int()
    .positive('Le nombre de bouteilles doit être positif')
    .max(100, 'Le nombre de bouteilles doit être 100 ou moins'),
});

/**
 * Validation schema for creating a subscription
 */
export const createSubscriptionSchema = z.object({
  memberId: z.string().uuid('ID de membre invalide'),
  planId: z.string().uuid('ID de plan invalide'),
  paymentMethodId: z.string().min(1, 'L\'ID de la méthode de paiement est requis'),
  startDate: z.string().datetime('Date de début invalide').optional(),
});

/**
 * Validation schema for updating a subscription
 */
export const updateSubscriptionSchema = z.object({
  status: subscriptionStatusSchema.optional(),
  pauseReason: z.string().max(500).optional(),
  planId: z.string().uuid('ID de plan invalide').optional(),
});

/**
 * Validation schema for cancelling a subscription
 */
export const cancelSubscriptionSchema = z.object({
  cancelReason: z.string().max(500).optional(),
  cancelImmediately: z.boolean().default(false),
});

/**
 * Validation schema for updating wine box status
 */
export const updateWineBoxStatusSchema = z.object({
  status: wineBoxStatusSchema,
  trackingNumber: z.string().max(100).optional(),
});

/**
 * Validation schema for subscription list query parameters
 */
export const getPaginatedSubscriptionsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: subscriptionStatusSchema.optional(),
  memberId: z.string().uuid('ID de membre invalide').optional(),
  planId: z.string().uuid('ID de plan invalide').optional(),
  sort: z.enum(['created_at', 'next_billing_date', 'amount']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Validation schema for wine boxes query parameters
 */
export const getWineBoxesSchema = z.object({
  billingCycle: z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'Le cycle de facturation doit être au format AAAA-MM')
    .optional(),
  status: wineBoxStatusSchema.optional(),
});

/**
 * Validation schema for subscription ID parameter
 */
export const subscriptionIdSchema = z.object({
  id: z.string().uuid('ID d\'abonnement invalide'),
});

/**
 * Validation schema for wine box ID parameter
 */
export const wineBoxIdSchema = z.object({
  id: z.string().uuid('ID de box invalide'),
});

export type CreateSubscriptionPlanInput = z.infer<typeof createSubscriptionPlanSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
export type UpdateWineBoxStatusInput = z.infer<typeof updateWineBoxStatusSchema>;
export type GetPaginatedSubscriptionsInput = z.infer<typeof getPaginatedSubscriptionsSchema>;
export type GetWineBoxesInput = z.infer<typeof getWineBoxesSchema>;
export type SubscriptionIdInput = z.infer<typeof subscriptionIdSchema>;
export type WineBoxIdInput = z.infer<typeof wineBoxIdSchema>;

