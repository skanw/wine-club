import { HttpError } from 'wasp/server';
import { 
  createStripeCustomer, 
  createSubscription as createStripeSubscription, 
  cancelSubscription as cancelStripeSubscription, 
  reactivateSubscription as reactivateStripeSubscription,
  createCustomerPortalSession,
  formatAmountForStripe,
  formatAmountFromStripe
} from '../payment/stripe/stripeClient';

export const getUserSubscriptions = async (args: {}, context: any): Promise<any[]> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  return await context.entities.WineSubscription.findMany({
    where: { memberId: context.user.id },
    include: {
      wineCave: {
        include: {
          owner: true,
        },
      },
      subscriptionTier: true,
      shipments: {
        include: {
          items: {
            include: {
              wine: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getSubscriptionDetails = async (args: { subscriptionId: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  const subscription = await context.entities.WineSubscription.findFirst({
    where: {
      id: args.subscriptionId,
      memberId: context.user.id,
    },
    include: {
      wineCave: {
        include: {
          owner: true,
          wines: true,
        },
      },
      subscriptionTier: true,
      shipments: {
        include: {
          items: {
            include: {
              wine: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      loyaltyPointsHistory: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Subscription not found');
  }

  return subscription;
};

export const createSubscription = async (args: { 
  subscriptionTierId: string; 
  wineCaveId: string; 
  deliveryAddress?: string; 
  deliveryInstructions?: string; 
  phoneNumber?: string;
  paymentMethodId?: string;
}, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  // Check if user already has an active subscription for this wine cave
  const existingSubscription = await context.entities.WineSubscription.findFirst({
    where: {
      memberId: context.user.id,
      wineCaveId: args.wineCaveId,
      status: 'active',
    },
  });

  if (existingSubscription) {
    throw new HttpError(400, 'User already has an active subscription for this wine cave');
  }

  // Get subscription tier details
  const subscriptionTier = await context.entities.SubscriptionTier.findUnique({
    where: { id: args.subscriptionTierId },
    include: { wineCave: true },
  });

  if (!subscriptionTier) {
    throw new HttpError(404, 'Subscription tier not found');
  }

  try {
    // Create or get Stripe customer
    let stripeCustomerId = context.user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await createStripeCustomer(context.user.email!, context.user.username || undefined);
      stripeCustomerId = customer.id;
      
      // Update user with Stripe customer ID
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { stripeCustomerId: customer.id },
      });
    }

    // Create Stripe subscription
    const stripeSubscription = await createStripeSubscription(
      stripeCustomerId,
      subscriptionTier.stripePriceId!, // Assuming this exists
      {
        subscriptionTierId: args.subscriptionTierId,
        wineCaveId: args.wineCaveId,
        userId: context.user.id,
      }
    );

    // Create subscription in database
    const subscription = await context.entities.WineSubscription.create({
      data: {
        memberId: context.user.id,
        wineCaveId: args.wineCaveId,
        subscriptionTierId: args.subscriptionTierId,
        status: 'active',
        startDate: new Date(),
        deliveryAddress: args.deliveryAddress,
        deliveryInstructions: args.deliveryInstructions,
        phoneNumber: args.phoneNumber,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: stripeCustomerId,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Update user's subscription status
    await context.entities.User.update({
      where: { id: context.user.id },
      data: {
        subscriptionStatus: 'active',
        datePaid: new Date(),
      },
    });

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new HttpError(500, 'Failed to create subscription');
  }
};

export const updateSubscription = async (
  args: {
    subscriptionId: string;
    deliveryAddress?: string;
    deliveryInstructions?: string;
    phoneNumber?: string;
    pauseUntil?: Date;
  },
  context: any
): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  const subscription = await context.entities.WineSubscription.findFirst({
    where: {
      id: args.subscriptionId,
      memberId: context.user.id,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Subscription not found');
  }

  const updateData: any = {};
  if (args.deliveryAddress !== undefined) updateData.deliveryAddress = args.deliveryAddress;
  if (args.deliveryInstructions !== undefined) updateData.deliveryInstructions = args.deliveryInstructions;
  if (args.phoneNumber !== undefined) updateData.phoneNumber = args.phoneNumber;
  if (args.pauseUntil !== undefined) {
    updateData.status = 'paused';
    updateData.pauseUntil = args.pauseUntil;
  }

  return await context.entities.WineSubscription.update({
    where: { id: args.subscriptionId },
    data: updateData,
  });
};

export const cancelSubscription = async (args: { subscriptionId: string; cancelAtPeriodEnd?: boolean }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  const subscription = await context.entities.WineSubscription.findFirst({
    where: {
      id: args.subscriptionId,
      memberId: context.user.id,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Subscription not found');
  }

  if (!subscription.stripeSubscriptionId) {
    throw new HttpError(400, 'Subscription not linked to Stripe');
  }

  try {
    // Cancel in Stripe
    await cancelStripeSubscription(subscription.stripeSubscriptionId, args.cancelAtPeriodEnd ?? true);

    // Update in database
    const updateData: any = {
      status: args.cancelAtPeriodEnd ? 'cancelling' : 'cancelled',
    };

    if (!args.cancelAtPeriodEnd) {
      updateData.endDate = new Date();
    }

    return await context.entities.WineSubscription.update({
      where: { id: args.subscriptionId },
      data: updateData,
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw new HttpError(500, 'Failed to cancel subscription');
  }
};

export const reactivateSubscription = async (args: { subscriptionId: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  const subscription = await context.entities.WineSubscription.findFirst({
    where: {
      id: args.subscriptionId,
      memberId: context.user.id,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Subscription not found');
  }

  if (!subscription.stripeSubscriptionId) {
    throw new HttpError(400, 'Subscription not linked to Stripe');
  }

  try {
    // Reactivate in Stripe
    await reactivateStripeSubscription(subscription.stripeSubscriptionId);

    // Update in database
    return await context.entities.WineSubscription.update({
      where: { id: args.subscriptionId },
      data: {
        status: 'active',
        pauseUntil: null,
      },
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw new HttpError(500, 'Failed to reactivate subscription');
  }
};

export const getBillingPortalUrl = async (args: { returnUrl: string }, context: any): Promise<{ url: string }> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  if (!context.user.stripeCustomerId) {
    throw new HttpError(400, 'No billing account found');
  }

  try {
    const session = await createCustomerPortalSession(context.user.stripeCustomerId, args.returnUrl);
    return { url: session.url };
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    throw new HttpError(500, 'Failed to create billing portal session');
  }
};

export const updateMemberPreferences = async (args: {
  subscriptionId: string;
  preferences: {
    wineTypes?: string[];
    priceRange?: { min: number; max: number };
    deliveryFrequency?: 'monthly' | 'bimonthly' | 'quarterly';
    excludeVarietals?: string[];
    includeVarietals?: string[];
    specialRequests?: string;
  };
}, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  const subscription = await context.entities.WineSubscription.findFirst({
    where: {
      id: args.subscriptionId,
      memberId: context.user.id,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Subscription not found');
  }

  // Update or create member preferences
  const preferences = await context.entities.MemberPreferences.upsert({
    where: { memberId: context.user.id },
    update: {
      wineTypes: args.preferences.wineTypes,
      priceRangeMin: args.preferences.priceRange?.min,
      priceRangeMax: args.preferences.priceRange?.max,
      deliveryFrequency: args.preferences.deliveryFrequency,
      excludeVarietals: args.preferences.excludeVarietals,
      includeVarietals: args.preferences.includeVarietals,
      specialRequests: args.preferences.specialRequests,
    },
    create: {
      memberId: context.user.id,
      wineTypes: args.preferences.wineTypes,
      priceRangeMin: args.preferences.priceRange?.min,
      priceRangeMax: args.preferences.priceRange?.max,
      deliveryFrequency: args.preferences.deliveryFrequency,
      excludeVarietals: args.preferences.excludeVarietals,
      includeVarietals: args.preferences.includeVarietals,
      specialRequests: args.preferences.specialRequests,
    },
  });

  return preferences;
};

export const getSubscriptionAnalytics = async (args: { subscriptionId: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  const subscription = await context.entities.WineSubscription.findFirst({
    where: {
      id: args.subscriptionId,
      memberId: context.user.id,
    },
    include: {
      shipments: {
        include: {
          items: {
            include: {
              wine: true,
            },
          },
        },
      },
      loyaltyPointsHistory: true,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Subscription not found');
  }

  // Calculate analytics
  const totalShipments = subscription.shipments.length;
  const totalWinesReceived = subscription.shipments.reduce((acc, shipment) => 
    acc + shipment.items.length, 0
  );
  const totalLoyaltyPoints = subscription.loyaltyPointsHistory.reduce((acc, points) => 
    acc + points.points, 0
  );
  const averageRating = subscription.shipments.reduce((acc, shipment) => {
    const shipmentRatings = shipment.items.map(item => item.wine.ratings || []).flat();
    return acc + shipmentRatings.reduce((sum, rating) => sum + rating.rating, 0);
  }, 0) / Math.max(totalWinesReceived, 1);

  return {
    totalShipments,
    totalWinesReceived,
    totalLoyaltyPoints,
    averageRating: Math.round(averageRating * 10) / 10,
    subscriptionDuration: Math.floor((Date.now() - subscription.startDate.getTime()) / (1000 * 60 * 60 * 24)),
  };
}; 