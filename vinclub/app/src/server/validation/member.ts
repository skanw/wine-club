import { z } from 'zod';

/**
 * E.164 phone number validation regex
 * Format: +[country code][number]
 */
export const e164PhoneRegex = /^\+[1-9]\d{1,14}$/;

/**
 * Validation schema for creating a new member (Quick-Add form)
 */
export const createMemberSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom doit contenir 100 caractères ou moins')
    .regex(/^[a-zA-ZÀ-ÿ\s'.-]+$/, 'Le nom ne peut contenir que des lettres, espaces, apostrophes, tirets et points'),
  email: z
    .string()
    .email('Format d\'email invalide')
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((val) => (val === '' ? null : val || null)),
  phone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .regex(e164PhoneRegex, 'Le téléphone doit être au format E.164 (ex. : +33612345678)'),
  preferredRegion: z
    .string()
    .max(100, 'La région doit contenir 100 caractères ou moins')
    .optional()
    .nullable()
    .transform((val) => val || null),
  tags: z
    .array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tags autorisés')
    .default([]),
  consentEmail: z.boolean({
    required_error: 'Le consentement email est requis',
  }),
  consentSms: z.boolean({
    required_error: 'Le consentement SMS est requis',
  }),
  sendWelcomeMessage: z.boolean().default(false),
});

/**
 * Validation schema for updating a member
 */
export const updateMemberSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom doit contenir 100 caractères ou moins')
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom ne peut contenir que des lettres, espaces et tirets')
    .optional(),
  email: z
    .string()
    .email('Format d\'email invalide')
    .optional()
    .nullable()
    .transform((val) => val || null),
  preferredRegion: z
    .string()
    .max(100, 'La région doit contenir 100 caractères ou moins')
    .optional()
    .nullable()
    .transform((val) => val || null),
  tags: z
    .array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tags autorisés')
    .optional(),
});

/**
 * Validation schema for member list query parameters
 */
export const getPaginatedMembersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  preferredRegion: z.string().optional(),
  sort: z.enum(['created_at', 'name', 'updated_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Validation schema for member ID parameter
 */
export const memberIdSchema = z.object({
  id: z.string().uuid('ID de membre invalide'),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type GetPaginatedMembersInput = z.infer<typeof getPaginatedMembersSchema>;
export type MemberIdInput = z.infer<typeof memberIdSchema>;

