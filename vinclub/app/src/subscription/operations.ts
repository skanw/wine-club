import { type Prisma } from '@prisma/client';
import { HttpError } from 'wasp/server';
import type {
  GetPaginatedSubscriptions,
  GetSubscriptionById,
  GetWineBoxes,
  CreateSubscriptionPlan,
  CreateSubscription,
  UpdateSubscription,
  CancelSubscription,
  UpdateWineBoxStatus,
} from 'wasp/server/operations';
import { getUserCaveId, ensureCaveAccess, ensureRequiredRole, requireAuthenticatedCave } from '../server/utils/tenant';
import {
  createSubscriptionPlanSchema,
  createSubscriptionSchema,
  updateSubscriptionSchema,
  cancelSubscriptionSchema,
  updateWineBoxStatusSchema,
  getPaginatedSubscriptionsSchema,
  getWineBoxesSchema,
  subscriptionIdSchema,
  wineBoxIdSchema,
  type CreateSubscriptionPlanInput,
  type CreateSubscriptionInput,
  type UpdateSubscriptionInput,
  type CancelSubscriptionInput,
  type UpdateWineBoxStatusInput,
  type GetPaginatedSubscriptionsInput,
  type GetWineBoxesInput,
  type SubscriptionIdInput,
  type WineBoxIdInput,
} from '../server/validation/subscription';
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation';
import { SubscriptionStatus, BillingCycle, WineBoxStatus } from '@prisma/client';
import { getCache, setCache, deleteCache, deleteCachePattern, cacheKey, CACHE_TTL } from '../server/utils/cache';

/**
 * Get paginated list of subscriptions for the authenticated cave
 */
export const getPaginatedSubscriptions: GetPaginatedSubscriptions<
  GetPaginatedSubscriptionsInput,
  {
    data: Array<{
      id: string;
      memberId: string;
      memberName: string;
      planId: string;
      planName: string;
      amount: number;
      currency: string;
      status: string;
      billingCycle: string;
      nextBillingDate: Date | null;
      stripeSubscriptionId: string | null;
      createdAt: Date;
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

  const { page, limit, status, memberId, planId, sort, order } =
    ensureArgsSchemaOrThrowHttpError(getPaginatedSubscriptionsSchema, rawArgs);

  const skip = (page - 1) * limit;

  const where: Prisma.SubscriptionWhereInput = {
    caveId,
    ...(status && { status }),
    ...(memberId && { memberId }),
    ...(planId && { planId }),
  };

  const [subscriptions, total] = await Promise.all([
    context.entities.Subscription.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sort]: order,
      },
      include: {
        member: {
          select: {
            name: true,
          },
        },
        plan: {
          select: {
            name: true,
          },
        },
      },
    }),
    context.entities.Subscription.count({ where }),
  ]);

  return {
    data: subscriptions.map((sub) => ({
      id: sub.id,
      memberId: sub.memberId,
      memberName: sub.member.name,
      planId: sub.planId,
      planName: sub.plan.name,
      amount: sub.amount,
      currency: sub.currency,
      status: sub.status,
      billingCycle: sub.billingCycle,
      nextBillingDate: sub.nextBillingDate,
      stripeSubscriptionId: sub.stripeSubscriptionId,
      createdAt: sub.createdAt,
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
 * Get subscription details by ID
 */
export const getSubscriptionById: GetSubscriptionById<
  { id: string },
  {
    id: string;
    memberId: string;
    memberName: string;
    planId: string;
    planName: string;
    amount: number;
    currency: string;
    status: string;
    billingCycle: string;
    nextBillingDate: Date | null;
    stripeSubscriptionId: string | null;
    createdAt: Date;
    updatedAt: Date;
    cancelledAt: Date | null;
  }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { id } = ensureArgsSchemaOrThrowHttpError(subscriptionIdSchema, rawArgs);

  const subscription = await context.entities.Subscription.findFirst({
    where: {
      id,
      caveId,
    },
    include: {
      member: {
        select: {
          name: true,
        },
      },
      plan: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Abonnement introuvable');
  }

  ensureCaveAccess(context.user, subscription.caveId);

  return {
    id: subscription.id,
    memberId: subscription.memberId,
    memberName: subscription.member.name,
    planId: subscription.planId,
    planName: subscription.plan.name,
    amount: subscription.amount,
    currency: subscription.currency,
    status: subscription.status,
    billingCycle: subscription.billingCycle,
    nextBillingDate: subscription.nextBillingDate,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
    createdAt: subscription.createdAt,
    updatedAt: subscription.updatedAt,
    cancelledAt: subscription.cancelledAt,
  };
};

/**
 * Get wine boxes (packing list) for a billing cycle
 */
export const getWineBoxes: GetWineBoxes<
  GetWineBoxesInput,
  {
    billingCycle: string;
    totalBoxes: number;
    statusBreakdown: {
      pending: number;
      packed: number;
      shipped: number;
      ready_for_pickup: number;
    };
    boxes: Array<{
      id: string;
      subscriptionId: string;
      memberName: string;
      memberPhone: string;
      planName: string;
      status: string;
      address: {
        street: string | null;
        city: string | null;
        postalCode: string | null;
        country: string | null;
      };
      createdAt: Date;
    }>;
  }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { billingCycle, status } = ensureArgsSchemaOrThrowHttpError(getWineBoxesSchema, rawArgs);

  // Default to current month if not provided
  const targetBillingCycle =
    billingCycle ||
    new Date().toISOString().slice(0, 7); // YYYY-MM format

  const where: Prisma.WineBoxWhereInput = {
    billingCycle: targetBillingCycle,
    subscription: {
      caveId,
    },
    ...(status && { status }),
  };

  const boxes = await context.entities.WineBox.findMany({
    where,
    include: {
      subscription: {
        include: {
          member: {
            select: {
              name: true,
              phone: true,
            },
          },
          plan: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Calculate status breakdown using reduce (more efficient than multiple filters)
  const statusBreakdown = boxes.reduce(
    (acc, box) => {
      acc[box.status] = (acc[box.status] || 0) + 1;
      return acc;
    },
    {
      pending: 0,
      packed: 0,
      shipped: 0,
      ready_for_pickup: 0,
    } as Record<WineBoxStatus, number>
  );

  return {
    billingCycle: targetBillingCycle,
    totalBoxes: boxes.length,
    statusBreakdown,
    boxes: boxes.map((box) => ({
      id: box.id,
      subscriptionId: box.subscriptionId,
      memberName: box.subscription.member.name,
      memberPhone: box.subscription.member.phone,
      planName: box.subscription.plan.name,
      status: box.status,
      address: {
        street: null, // TODO: Add address fields to Member model if needed
        city: null,
        postalCode: null,
        country: null,
      },
      createdAt: box.createdAt,
    })),
  };
};

/**
 * Create a new subscription plan
 */
export const createSubscriptionPlan: CreateSubscriptionPlan<
  CreateSubscriptionPlanInput,
  { id: string }
> = async (rawArgs, context) => {
  // Only OWNER and MANAGER can create plans
  ensureRequiredRole(context.user, ['OWNER', 'MANAGER']);

  const caveId = requireAuthenticatedCave(context);

  const data = ensureArgsSchemaOrThrowHttpError(createSubscriptionPlanSchema, rawArgs);

  const plan = await context.entities.SubscriptionPlan.create({
    data: {
      caveId,
      name: data.name,
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      billingCycle: data.billingCycle,
      wineCount: data.wineCount,
      isActive: true,
    },
  });

  // Invalidate cache for subscription plans for this cave
  await deleteCachePattern(`cave:${caveId}:subscription-plans*`);
  await deleteCachePattern(`subscription-plan:*:${caveId}`);

  return { id: plan.id };
};

/**
 * Create a new subscription
 * Creates Stripe subscription and links to member
 */
export const createSubscription: CreateSubscription<
  CreateSubscriptionInput,
  { id: string; stripeSubscriptionId: string | null }
> = async (rawArgs, context) => {
  // Only OWNER and MANAGER can create subscriptions
  ensureRequiredRole(context.user, ['OWNER', 'MANAGER']);

  const caveId = requireAuthenticatedCave(context);

  const data = ensureArgsSchemaOrThrowHttpError(createSubscriptionSchema, rawArgs);

  // Verify member belongs to the cave
  const member = await context.entities.Member.findFirst({
    where: {
      id: data.memberId,
      caveId,
      deletedAt: null,
    },
  });

  if (!member) {
    throw new HttpError(404, 'Membre introuvable');
  }

  // Check cache first for subscription plan
  const planCacheKey = cacheKey('subscription-plan', data.planId, caveId);
  let plan = await getCache<{ id: string; amount: number; billingCycle: BillingCycle; currency: string }>(planCacheKey);

  if (!plan) {
    // Verify plan belongs to the cave
    plan = await context.entities.SubscriptionPlan.findFirst({
      where: {
        id: data.planId,
        caveId,
        isActive: true,
      },
    });

    if (!plan) {
      throw new HttpError(404, 'Plan d\'abonnement introuvable ou inactif');
    }

    // Cache the plan
    await setCache(planCacheKey, plan, { ttl: CACHE_TTL.SUBSCRIPTION_PLAN_BY_ID });
  }

  // TODO: Create Stripe subscription
  // This requires Stripe integration setup
  // For now, create subscription without Stripe ID
  const stripeSubscriptionId = null; // Will be set when Stripe integration is complete

  // Calculate next billing date based on billing cycle
  const nextBillingDate = calculateNextBillingDate(plan.billingCycle);

  const subscription = await context.entities.Subscription.create({
    data: {
      caveId,
      memberId: data.memberId,
      planId: data.planId,
      stripeSubscriptionId,
      amount: plan.amount,
      currency: plan.currency,
      status: SubscriptionStatus.active,
      billingCycle: plan.billingCycle,
      nextBillingDate,
    },
  });

  return {
    id: subscription.id,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
  };
};

/**
 * Update subscription (pause, resume, change plan)
 */
export const updateSubscription: UpdateSubscription<
  { id: string } & UpdateSubscriptionInput,
  { id: string }
> = async (rawArgs, context) => {
  // Only OWNER and MANAGER can update subscriptions
  ensureRequiredRole(context.user, ['OWNER', 'MANAGER']);

  const caveId = requireAuthenticatedCave(context);

  const { id, ...updateData } = rawArgs;
  const { id: validatedId } = ensureArgsSchemaOrThrowHttpError(subscriptionIdSchema, { id });
  const validatedData = ensureArgsSchemaOrThrowHttpError(updateSubscriptionSchema, updateData);

  const subscription = await context.entities.Subscription.findFirst({
    where: {
      id: validatedId,
      caveId,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Abonnement introuvable');
  }

  ensureCaveAccess(context.user, subscription.caveId);

  // Prepare update data
  const updateDataObj: any = {
    updatedAt: new Date(),
  };

  // Handle plan change
  if (validatedData.planId && validatedData.planId !== subscription.planId) {
    // Check cache first for subscription plan
    const planCacheKey = cacheKey('subscription-plan', validatedData.planId, caveId);
    let newPlan = await getCache<any>(planCacheKey);

    if (!newPlan) {
      newPlan = await context.entities.SubscriptionPlan.findFirst({
        where: {
          id: validatedData.planId,
          caveId,
          isActive: true,
        },
      });

      if (!newPlan) {
        throw new HttpError(404, 'Plan d\'abonnement introuvable ou inactif');
      }

      // Cache the plan
      await setCache(planCacheKey, newPlan, { ttl: CACHE_TTL.SUBSCRIPTION_PLAN_BY_ID });
    }

    // Update subscription with new plan details
    updateDataObj.planId = newPlan.id;
    updateDataObj.amount = newPlan.amount;
    updateDataObj.billingCycle = newPlan.billingCycle;
    updateDataObj.nextBillingDate = calculateNextBillingDate(newPlan.billingCycle);
  }

  // Handle status update
  if (validatedData.status) {
    updateDataObj.status = validatedData.status;
  }

  // TODO: Update Stripe subscription if status changes
  // This requires Stripe integration

  const updatedSubscription = await context.entities.Subscription.update({
    where: { id: validatedId },
    data: updateDataObj,
  });

  return { id: updatedSubscription.id };
};

/**
 * Cancel subscription
 */
export const cancelSubscription: CancelSubscription<
  { id: string } & CancelSubscriptionInput,
  { id: string; status: string; cancelledAt: Date; endsAt: Date | null }
> = async (rawArgs, context) => {
  // Only OWNER and MANAGER can cancel subscriptions
  ensureRequiredRole(context.user, ['OWNER', 'MANAGER']);

  const caveId = requireAuthenticatedCave(context);

  const { id, ...cancelData } = rawArgs;
  const { id: validatedId } = ensureArgsSchemaOrThrowHttpError(subscriptionIdSchema, { id });
  const { cancelReason, cancelImmediately } = ensureArgsSchemaOrThrowHttpError(
    cancelSubscriptionSchema,
    cancelData
  );

  const subscription = await context.entities.Subscription.findFirst({
    where: {
      id: validatedId,
      caveId,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Abonnement introuvable');
  }

  ensureCaveAccess(context.user, subscription.caveId);

  // TODO: Cancel Stripe subscription
  // This requires Stripe integration

  const cancelledAt = new Date();
  const endsAt = cancelImmediately ? cancelledAt : subscription.nextBillingDate;

  const updatedSubscription = await context.entities.Subscription.update({
    where: { id: validatedId },
    data: {
      status: SubscriptionStatus.cancelled,
      cancelledAt,
      nextBillingDate: endsAt,
    },
  });

  return {
    id: updatedSubscription.id,
    status: updatedSubscription.status,
    cancelledAt: updatedSubscription.cancelledAt!,
    endsAt: updatedSubscription.nextBillingDate,
  };
};

/**
 * Update wine box status
 */
export const updateWineBoxStatus: UpdateWineBoxStatus<
  { id: string } & UpdateWineBoxStatusInput,
  { id: string }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { id, ...updateData } = rawArgs;
  const { id: validatedId } = ensureArgsSchemaOrThrowHttpError(wineBoxIdSchema, { id });
  const validatedData = ensureArgsSchemaOrThrowHttpError(updateWineBoxStatusSchema, updateData);

  const wineBox = await context.entities.WineBox.findFirst({
    where: {
      id: validatedId,
      subscription: {
        caveId,
      },
    },
    include: {
      subscription: true,
    },
  });

  if (!wineBox) {
    throw new HttpError(404, 'Box de vin introuvable');
  }

  ensureCaveAccess(context.user, wineBox.subscription.caveId);

  const updateFields: Prisma.WineBoxUpdateInput = {
    status: validatedData.status,
  };

  if (validatedData.status === WineBoxStatus.packed && !wineBox.packedAt) {
    updateFields.packedAt = new Date();
  }

  if (validatedData.status === WineBoxStatus.shipped && !wineBox.shippedAt) {
    updateFields.shippedAt = new Date();
    if (validatedData.trackingNumber) {
      updateFields.trackingNumber = validatedData.trackingNumber;
    }
  }

  const updatedWineBox = await context.entities.WineBox.update({
    where: { id: validatedId },
    data: updateFields,
  });

  return { id: updatedWineBox.id };
};

/**
 * Helper function to calculate next billing date based on billing cycle
 */
function calculateNextBillingDate(billingCycle: BillingCycle): Date {
  const now = new Date();
  const nextDate = new Date(now);

  switch (billingCycle) {
    case BillingCycle.monthly:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case BillingCycle.quarterly:
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case BillingCycle.yearly:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate;
}

