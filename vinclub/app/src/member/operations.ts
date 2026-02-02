import { type Prisma } from '@prisma/client';
import { HttpError } from 'wasp/server';
import type {
  GetPaginatedMembers,
  GetMemberById,
  CreateMember,
  UpdateMember,
  DeleteMember,
} from 'wasp/server/operations';
import { getUserCaveId, ensureCaveAccess, ensureRequiredRole, requireAuthenticatedCave } from '../server/utils/tenant';
import {
  createMemberSchema,
  updateMemberSchema,
  getPaginatedMembersSchema,
  memberIdSchema,
  type CreateMemberInput,
  type UpdateMemberInput,
  type GetPaginatedMembersInput,
  type MemberIdInput,
} from '../server/validation/member';
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation';
import { getCache, setCache, deleteCache, cacheKey, CACHE_TTL } from '../server/utils/cache';
import { randomUUID } from 'crypto';
import { createHttpError } from '../server/utils/errors';

/**
 * Get paginated list of members for the authenticated cave
 */
export const getPaginatedMembers: GetPaginatedMembers<
  GetPaginatedMembersInput,
  {
    data: Array<{
      id: string;
      name: string;
      email: string | null;
      phone: string;
      preferredRegion: string | null;
      tags: string[];
      consentEmail: boolean;
      consentSms: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { page, limit, search, tags, preferredRegion, sort, order } =
    ensureArgsSchemaOrThrowHttpError(getPaginatedMembersSchema, rawArgs);

  const skip = (page - 1) * limit;

  // Build where clause with tenant isolation
  const where: Prisma.MemberWhereInput = {
    caveId,
    deletedAt: null, // Only show non-deleted members
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ],
    }),
    ...(tags && tags.length > 0 && {
      tags: {
        array_contains: tags,
      },
    }),
    ...(preferredRegion && {
      preferredRegion,
    }),
  };

  const [members, total] = await Promise.all([
    context.entities.Member.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sort]: order,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        preferredRegion: true,
        tags: true,
        consentEmail: true,
        consentSms: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    context.entities.Member.count({ where }),
  ]);

  return {
    data: members.map((member) => ({
      ...member,
      tags: (member.tags as string[]) || [],
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single member by ID with subscriptions and campaign history
 */
export const getMemberById: GetMemberById<
  { id: string },
  {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    preferredRegion: string | null;
    tags: string[];
    consentEmail: boolean;
    consentSms: boolean;
    subscriptionsCount: number;
    totalSpent: number;
    lastCampaignInteraction: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { id } = ensureArgsSchemaOrThrowHttpError(memberIdSchema, rawArgs);

  // Check cache first for member details
  const memberCacheKey = cacheKey('member', id, caveId);
  const cachedMember = await getCache<{
    id: string;
    name: string;
    email: string | null;
    phone: string;
    preferredRegion: string | null;
    tags: string[];
    consentEmail: boolean;
    consentSms: boolean;
    subscriptions: Array<{ amount: number }>;
    campaignMessages: Array<{ createdAt: Date }>;
    createdAt: Date;
    updatedAt: Date;
  }>(memberCacheKey);

  let member;
  if (cachedMember) {
    // Use cached member but still need to fetch subscriptions and campaign messages
    member = await context.entities.Member.findFirst({
      where: {
        id,
        caveId,
        deletedAt: null,
      },
      include: {
        subscriptions: {
          where: {
            status: 'active',
          },
          select: {
            amount: true,
          },
        },
        campaignMessages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            createdAt: true,
          },
        },
      },
    });
  } else {
    member = await context.entities.Member.findFirst({
      where: {
        id,
        caveId,
        deletedAt: null,
      },
      include: {
        subscriptions: {
          where: {
            status: 'active',
          },
          select: {
            amount: true,
          },
        },
        campaignMessages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            createdAt: true,
          },
        },
      },
    });

    // Cache member details (without subscriptions/messages which change frequently)
    if (member) {
      await setCache(memberCacheKey, {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        preferredRegion: member.preferredRegion,
        tags: member.tags as string[],
        consentEmail: member.consentEmail,
        consentSms: member.consentSms,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      }, { ttl: 300 }); // 5 minutes TTL for member details
    }
  }

  if (!member) {
    throw new HttpError(404, 'Membre introuvable');
  }

  ensureCaveAccess(context.user, member.caveId);

  const subscriptionsCount = member.subscriptions.length;
  const totalSpent = member.subscriptions.reduce((sum, sub) => {
    const amount = Number(sub.amount);
    if (!isFinite(amount) || amount < 0) {
      const requestId = randomUUID();
      console.error('Invalid subscription amount detected', {
        requestId,
        memberId: member.id,
        subscriptionAmount: sub.amount,
        timestamp: new Date().toISOString(),
      });
      throw createHttpError(
        500,
        'Données d\'abonnement invalides détectées',
        'SUBSCRIPTION_INVALID_DATA',
        { requestId, memberId: member.id, subscriptionAmount: sub.amount }
      );
    }
    return sum + amount;
  }, 0);
  const lastCampaignInteraction =
    member.campaignMessages.length > 0 ? member.campaignMessages[0].createdAt : null;

  return {
    id: member.id,
    name: member.name,
    email: member.email,
    phone: member.phone,
    preferredRegion: member.preferredRegion,
    tags: (member.tags as string[]) || [],
    consentEmail: member.consentEmail,
    consentSms: member.consentSms,
    subscriptionsCount,
    totalSpent,
    lastCampaignInteraction,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  };
};

/**
 * Create a new member (Quick-Add form)
 * Validates phone (E.164), checks duplicates within cave, optionally sends welcome SMS
 */
export const createMember: CreateMember<CreateMemberInput, { id: string }> = async (
  rawArgs,
  context
) => {
  const caveId = requireAuthenticatedCave(context);

  let data;
  try {
    data = ensureArgsSchemaOrThrowHttpError(createMemberSchema, rawArgs);
  } catch (validationError: any) {
    // Log validation errors for debugging
    console.error('Member creation validation error:', {
      error: validationError.message,
      errors: validationError.errors,
      input: { ...rawArgs, phone: rawArgs.phone ? '***' : undefined },
    });
    throw new HttpError(400, validationError.message || 'Données invalides');
  }

  // Create member - unique constraints in database will prevent duplicates
  // Catch Prisma unique constraint violation (P2002) for user-friendly error messages
  try {
    const member = await context.entities.Member.create({
      data: {
        caveId,
        name: data.name.trim(),
        email: data.email || null,
        phone: data.phone.trim(),
        preferredRegion: data.preferredRegion?.trim() || null,
        tags: data.tags || [],
        consentEmail: data.consentEmail ?? false,
        consentSms: data.consentSms ?? false,
        consentGdprLoggedAt: data.consentEmail || data.consentSms ? new Date() : null,
      },
    });

    // TODO: Send welcome SMS if sendWelcomeMessage is true
    // This will be implemented when Twilio integration is added

    return { id: member.id };
  } catch (error: any) {
    // Log error for debugging
    console.error('Member creation error:', {
      code: error.code,
      meta: error.meta,
      message: error.message,
      caveId,
    });

    // Handle Prisma unique constraint violation
    if (error.code === 'P2002') {
      const target = error.meta?.target as string[] | undefined;
      if (target?.includes('phone')) {
        throw new HttpError(409, 'Un membre avec ce numéro de téléphone existe déjà');
      }
      if (target?.includes('email') && data.email) {
        throw new HttpError(409, 'Un membre avec cet email existe déjà');
      }
      throw new HttpError(409, 'Un membre avec ces informations existe déjà');
    }
    
    // Handle validation errors from Prisma
    if (error.code === 'P2003') {
      throw new HttpError(400, 'Données invalides pour la création du membre');
    }

    // Re-throw as HttpError with proper message
    if (error instanceof HttpError) {
      throw error;
    }
    
    throw new HttpError(500, error.message || 'Erreur lors de la création du membre');
  }
};

/**
 * Update member information
 */
export const updateMember: UpdateMember<
  { id: string } & UpdateMemberInput,
  { id: string }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { id, ...updateData } = rawArgs;
  const { id: validatedId } = ensureArgsSchemaOrThrowHttpError(memberIdSchema, { id });
  const validatedData = ensureArgsSchemaOrThrowHttpError(
    updateMemberSchema,
    updateData
  );

  // Check member exists and belongs to user's cave
  const member = await context.entities.Member.findFirst({
    where: {
      id: validatedId,
      caveId,
      deletedAt: null,
    },
  });

  if (!member) {
    throw new HttpError(404, 'Membre introuvable');
  }

  ensureCaveAccess(context.user, member.caveId);

  // Update member - unique constraints will prevent duplicates
  try {
    const updatedMember = await context.entities.Member.update({
      where: { id: validatedId },
      data: validatedData,
    });

    return { id: updatedMember.id };
  } catch (error: any) {
    // Handle Prisma unique constraint violation
    if (error.code === 'P2002') {
      const target = error.meta?.target as string[] | undefined;
      if (target?.includes('email')) {
        throw new HttpError(409, 'Un membre avec cet email existe déjà');
      }
      if (target?.includes('phone')) {
        throw new HttpError(409, 'Un membre avec ce numéro de téléphone existe déjà');
      }
      throw new HttpError(409, 'Un membre avec ces informations existe déjà');
    }
    throw error;
  }
};

/**
 * Delete member (soft delete with GDPR logging)
 */
export const deleteMember: DeleteMember<{ id: string }, void> = async (rawArgs, context) => {
  // Only OWNER and MANAGER can delete members
  ensureRequiredRole(context.user, ['OWNER', 'MANAGER']);

  const caveId = requireAuthenticatedCave(context);

  const { id } = ensureArgsSchemaOrThrowHttpError(memberIdSchema, rawArgs);

  // Check member exists and belongs to user's cave
  const member = await context.entities.Member.findFirst({
    where: {
      id,
      caveId,
      deletedAt: null,
    },
  });

  if (!member) {
    throw new HttpError(404, 'Membre introuvable');
  }

  ensureCaveAccess(context.user, member.caveId);

  // Soft delete
  await context.entities.Member.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  // Invalidate member cache
  const memberCacheKey = cacheKey('member', id, caveId);
  await deleteCache(memberCacheKey);
};

