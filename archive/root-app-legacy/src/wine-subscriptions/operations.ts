import { prisma } from 'wasp/server';
import { CreateWineSubscription, UpdateWineSubscription, GetMyWineSubscriptions, GetPublicWineCaves } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';
import type { WineSubscription, WineCave, SubscriptionTier, User } from 'wasp/entities';

type CreateWineSubscriptionInput = {
  wineCaveId: string;
  subscriptionTierId: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  phoneNumber?: string;
};

type UpdateWineSubscriptionInput = {
  id: string;
  status?: string;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  phoneNumber?: string;
};

type GetMyWineSubscriptionsInput = void;
type GetPublicWineCavesInput = void;

// Create a new wine subscription
export const createWineSubscription: CreateWineSubscription<CreateWineSubscriptionInput, WineSubscription> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to create a subscription');
  }

  // Verify the wine cave and subscription tier exist
  const subscriptionTier = await prisma.subscriptionTier.findFirst({
    where: {
      id: args.subscriptionTierId,
      wineCaveId: args.wineCaveId,
      isActive: true,
    },
    include: {
      wineCave: true,
    },
  });

  if (!subscriptionTier) {
    throw new HttpError(404, 'Subscription tier not found or not active');
  }

  // Check if user already has an active subscription to this wine cave
  const existingSubscription = await prisma.wineSubscription.findFirst({
    where: {
      memberId: context.user.id,
      wineCaveId: args.wineCaveId,
      status: 'active',
    },
  });

  if (existingSubscription) {
    throw new HttpError(400, 'You already have an active subscription to this wine cave');
  }

  // Calculate next shipment date (first of next month)
  const nextShipmentDate = new Date();
  nextShipmentDate.setMonth(nextShipmentDate.getMonth() + 1);
  nextShipmentDate.setDate(1);

  return prisma.wineSubscription.create({
    data: {
      ...args,
      memberId: context.user.id,
      nextShipmentDate,
    },
    include: {
      wineCave: true,
      subscriptionTier: true,
      member: {
        select: {
          id: true,
          email: true,
          username: true,
        },
      },
    },
  });
};

// Update a wine subscription
export const updateWineSubscription: UpdateWineSubscription<UpdateWineSubscriptionInput, WineSubscription> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to update a subscription');
  }

  const { id, ...updateData } = args;

  // Verify ownership
  const subscription = await prisma.wineSubscription.findFirst({
    where: {
      id: id,
      memberId: context.user.id,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Subscription not found or you do not have permission to update it');
  }

  return prisma.wineSubscription.update({
    where: { id },
    data: updateData,
    include: {
      wineCave: true,
      subscriptionTier: true,
      member: {
        select: {
          id: true,
          email: true,
          username: true,
        },
      },
    },
  });
};

// Get current user's wine subscriptions
export const getMyWineSubscriptions: GetMyWineSubscriptions<GetMyWineSubscriptionsInput, WineSubscription[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to view your subscriptions');
  }

  return prisma.wineSubscription.findMany({
    where: {
      memberId: context.user.id,
    },
    include: {
      wineCave: {
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
          logoUrl: true,
        },
      },
      subscriptionTier: true,
      shipments: {
        orderBy: {
          shipmentDate: 'desc',
        },
        take: 5, // Last 5 shipments
        include: {
          items: {
            include: {
              wine: {
                select: {
                  id: true,
                  name: true,
                  varietal: true,
                  vintage: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// Get public wine caves for subscription browsing
export const getPublicWineCaves: GetPublicWineCaves<GetPublicWineCavesInput, WineCave[]> = async (args, context) => {
  return prisma.wineCave.findMany({
    include: {
      subscriptionTiers: {
        where: {
          isActive: true,
        },
        orderBy: {
          price: 'asc',
        },
      },
      wines: {
        take: 3, // Show sample wines
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          varietal: true,
          vintage: true,
          imageUrl: true,
          price: true,
        },
      },
      _count: {
        select: {
          subscriptions: {
            where: {
              status: 'active',
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}; 