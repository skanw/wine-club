import { HttpError } from 'wasp/server';
import { z } from 'zod';

// Validation schemas
const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

const contactSchema = z.object({
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  website: z.string().url().optional().or(z.literal('')),
});

const businessSchema = z.object({
  licenseNumber: z.string().min(1, 'License number is required'),
  businessType: z.enum(['cave', 'cooperative', 'grower']),
  yearsInBusiness: z.number().min(1).max(100),
});

const subscriptionSchema = z.object({
  plan: z.enum(['basic', 'premium', 'enterprise']),
  estimatedSubscribers: z.number().min(1).max(10000),
  averageOrderValue: z.number().min(10).max(1000),
});

const createWineCaveSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  address: addressSchema,
  contact: contactSchema,
  business: businessSchema,
  subscription: subscriptionSchema,
});

/**
 * Create a new wine cave
 */
export const createWineCave = async (args: z.infer<typeof createWineCaveSchema>, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Validate input
    const validatedData = createWineCaveSchema.parse(args);

    // Check if user already has a wine cave
    const existingCave = await context.entities.WineCave.findFirst({
      where: { ownerId: context.user.id },
    });

    if (existingCave) {
      throw new HttpError(400, 'You already have a wine cave registered');
    }

    // Create wine cave
    const wineCave = await context.entities.WineCave.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        address: validatedData.address,
        contact: validatedData.contact,
        business: validatedData.business,
        subscription: validatedData.subscription,
        ownerId: context.user.id,
        status: 'pending', // Will be activated after Stripe setup
        slug: generateSlug(validatedData.name),
        settings: {
          theme: {
            primaryColor: '#8B2635', // Bordeaux
            secondaryColor: '#F4E4BC', // Champagne
          },
          features: {
            aiRecommendations: validatedData.subscription.plan !== 'basic',
            advancedAnalytics: validatedData.subscription.plan === 'enterprise',
            whiteLabel: validatedData.subscription.plan === 'enterprise',
          },
        },
      },
    });

    // Create default subscription tier
    await context.entities.SubscriptionTier.create({
      data: {
        wineCaveId: wineCave.id,
        name: 'Standard Membership',
        description: 'Monthly wine subscription',
        price: validatedData.subscription.averageOrderValue,
        currency: 'EUR',
        interval: 'month',
        maxSubscribers: validatedData.subscription.plan === 'basic' ? 100 : 
                       validatedData.subscription.plan === 'premium' ? 500 : 10000,
        features: {
          winesPerMonth: 2,
          freeShipping: true,
          memberDiscount: 10,
          exclusiveAccess: false,
        },
        isActive: true,
      },
    });

    // Send welcome notification
    await context.entities.Notification.create({
      data: {
        userId: context.user.id,
        type: 'system',
        title: 'Wine Cave Created Successfully',
        message: `Your wine cave "${validatedData.name}" has been created. Complete your Stripe setup to start accepting subscriptions.`,
        isRead: false,
      },
    });

    return wineCave;

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new HttpError(400, `Validation error: ${error.errors[0].message}`);
    }
    
    console.error('Error creating wine cave:', error);
    throw new HttpError(500, 'Failed to create wine cave');
  }
};

/**
 * Get wine cave by ID
 */
export const getWineCave = async (args: { id: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const wineCave = await context.entities.WineCave.findFirst({
      where: {
        id: args.id,
        ownerId: context.user.id,
      },
      include: {
        subscriptionTiers: true,
        wines: {
          include: {
            ratings: true,
          },
        },
        members: {
          include: {
            subscriptions: true,
          },
        },
      },
    });

    if (!wineCave) {
      throw new HttpError(404, 'Wine cave not found');
    }

    return wineCave;

  } catch (error) {
    console.error('Error fetching wine cave:', error);
    throw new HttpError(500, 'Failed to fetch wine cave');
  }
};

/**
 * Update wine cave
 */
export const updateWineCave = async (args: {
  id: string;
  data: Partial<z.infer<typeof createWineCaveSchema>>;
}, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Validate input
    const validatedData = createWineCaveSchema.partial().parse(args.data);

    const wineCave = await context.entities.WineCave.findFirst({
      where: {
        id: args.id,
        ownerId: context.user.id,
      },
    });

    if (!wineCave) {
      throw new HttpError(404, 'Wine cave not found');
    }

    const updatedCave = await context.entities.WineCave.update({
      where: { id: args.id },
      data: validatedData,
    });

    return updatedCave;

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new HttpError(400, `Validation error: ${error.errors[0].message}`);
    }
    
    console.error('Error updating wine cave:', error);
    throw new HttpError(500, 'Failed to update wine cave');
  }
};

/**
 * Get wine cave analytics
 */
export const getWineCaveAnalytics = async (args: { wineCaveId: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Verify ownership
    const wineCave = await context.entities.WineCave.findFirst({
      where: {
        id: args.wineCaveId,
        ownerId: context.user.id,
      },
    });

    if (!wineCave) {
      throw new HttpError(404, 'Wine cave not found');
    }

    // Get analytics data
    const [
      totalMembers,
      activeSubscriptions,
      totalRevenue,
      averageOrderValue,
      churnRate,
      topWines,
    ] = await Promise.all([
      // Total members
      context.entities.User.count({
        where: { wineSubscriptions: { some: { wineCaveId: args.wineCaveId } } },
      }),
      
      // Active subscriptions
      context.entities.WineSubscription.count({
        where: {
          wineCaveId: args.wineCaveId,
          status: 'active',
        },
      }),
      
      // Total revenue (last 30 days) - simplified without Payment entity
      Promise.resolve({ _sum: { amount: 0 } }),
      
      // Average order value - simplified without Payment entity
      Promise.resolve({ _avg: { amount: 0 } }),
      
      // Churn rate (simplified calculation)
      context.entities.WineSubscription.count({
        where: {
          wineCaveId: args.wineCaveId,
          status: 'cancelled',
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      
      // Top wines by rating
      context.entities.Wine.findMany({
        where: { wineCaveId: args.wineCaveId },
        include: {
          ratings: true,
        },
        orderBy: {
          ratings: {
            _count: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    return {
      totalMembers,
      activeSubscriptions,
      totalRevenue: totalRevenue._sum.amount || 0,
      averageOrderValue: averageOrderValue._avg.amount || 0,
      churnRate: totalMembers > 0 ? (churnRate / totalMembers) * 100 : 0,
      topWines: topWines.map(wine => ({
        id: wine.id,
        name: wine.name,
        averageRating: wine.ratings.length > 0 
          ? wine.ratings.reduce((sum, r) => sum + r.rating, 0) / wine.ratings.length 
          : 0,
        totalRatings: wine.ratings.length,
      })),
    };

  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw new HttpError(500, 'Failed to fetch analytics');
  }
};

/**
 * Generate URL slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
} 