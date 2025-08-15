import { prisma } from 'wasp/server';
import { GetWineCaves, CreateWineCave, UpdateWineCave, DeleteWineCave, CreateSubscriptionTier, CreateWine } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';
import type { WineCave, SubscriptionTier, Wine, User } from 'wasp/entities';

type GetWineCavesInput = void;
type CreateWineCaveInput = {
  name: string;
  description?: string;
  location?: string;
  website?: string;
  contactEmail: string;
  logoUrl?: string;
};

type UpdateWineCaveInput = {
  id: string;
  name?: string;
  description?: string;
  location?: string;
  website?: string;
  contactEmail?: string;
  logoUrl?: string;
};

type DeleteWineCaveInput = {
  id: string;
};

type CreateSubscriptionTierInput = {
  wineCaveId: string;
  name: string;
  description?: string;
  price: number;
  bottlesPerMonth: number;
};

type CreateWineInput = {
  wineCaveId: string;
  name: string;
  varietal: string;
  vintage: number;
  description?: string;
  tastingNotes?: string;
  alcoholContent?: number;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
};

// Get all wine caves for the authenticated user
export const getWineCaves: GetWineCaves<GetWineCavesInput, WineCave[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to view wine caves');
  }

  return prisma.wineCave.findMany({
    where: {
      ownerId: context.user.id,
    },
    include: {
      subscriptionTiers: true,
      wines: true,
      _count: {
        select: {
          subscriptions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// Create a new wine cave
export const createWineCave: CreateWineCave<CreateWineCaveInput, WineCave> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to create a wine cave');
  }

  return prisma.wineCave.create({
    data: {
      ...args,
      ownerId: context.user.id,
    },
    include: {
      subscriptionTiers: true,
      wines: true,
    },
  });
};

// Update an existing wine cave
export const updateWineCave: UpdateWineCave<UpdateWineCaveInput, WineCave> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to update a wine cave');
  }

  const { id, ...updateData } = args;

  // Verify ownership
  const wineCave = await prisma.wineCave.findFirst({
    where: {
      id: id,
      ownerId: context.user.id,
    },
  });

  if (!wineCave) {
    throw new HttpError(404, 'Wine cave not found or you do not have permission to update it');
  }

  return prisma.wineCave.update({
    where: { id },
    data: updateData,
    include: {
      subscriptionTiers: true,
      wines: true,
    },
  });
};

// Delete a wine cave
export const deleteWineCave: DeleteWineCave<DeleteWineCaveInput, WineCave> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to delete a wine cave');
  }

  // Verify ownership
  const wineCave = await prisma.wineCave.findFirst({
    where: {
      id: args.id,
      ownerId: context.user.id,
    },
  });

  if (!wineCave) {
    throw new HttpError(404, 'Wine cave not found or you do not have permission to delete it');
  }

  // Check if there are active subscriptions
  const activeSubscriptions = await prisma.wineSubscription.count({
    where: {
      wineCaveId: args.id,
      status: 'active',
    },
  });

  if (activeSubscriptions > 0) {
    throw new HttpError(400, 'Cannot delete wine cave with active subscriptions');
  }

  return prisma.wineCave.delete({
    where: { id: args.id },
  });
};

// Create a subscription tier for a wine cave
export const createSubscriptionTier: CreateSubscriptionTier<CreateSubscriptionTierInput, SubscriptionTier> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to create a subscription tier');
  }

  // Verify ownership of the wine cave
  const wineCave = await prisma.wineCave.findFirst({
    where: {
      id: args.wineCaveId,
      ownerId: context.user.id,
    },
  });

  if (!wineCave) {
    throw new HttpError(404, 'Wine cave not found or you do not have permission to add subscription tiers');
  }

  return prisma.subscriptionTier.create({
    data: args,
  });
};

// Add a wine to a wine cave's inventory
export const createWine: CreateWine<CreateWineInput, Wine> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to add wines');
  }

  // Verify ownership of the wine cave
  const wineCave = await prisma.wineCave.findFirst({
    where: {
      id: args.wineCaveId,
      ownerId: context.user.id,
    },
  });

  if (!wineCave) {
    throw new HttpError(404, 'Wine cave not found or you do not have permission to add wines');
  }

  return prisma.wine.create({
    data: args,
  });
}; 