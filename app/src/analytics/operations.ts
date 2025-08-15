import { HttpError } from 'wasp/server';
import { z } from 'zod';

// Enhanced analytics types
interface RevenueMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageOrderValue: number;
  revenueGrowth: number;
  topPerformingWineCaves: Array<{
    id: string;
    name: string;
    revenue: number;
    subscriberCount: number;
  }>;
}

interface SubscriptionMetrics {
  totalSubscribers: number;
  activeSubscriptions: number;
  churnRate: number;
  conversionRate: number;
  averageLifetimeValue: number;
  subscriptionGrowth: number;
  tierDistribution: Array<{
    tier: string;
    count: number;
    revenue: number;
  }>;
}

interface EngagementMetrics {
  averageRating: number;
  totalRatings: number;
  memberRetention: number;
  topEngagedMembers: Array<{
    id: string;
    username: string;
    ratingsCount: number;
    averageRating: number;
    subscriptionDuration: number;
  }>;
  winePreferences: Array<{
    varietal: string;
    averageRating: number;
    popularity: number;
  }>;
}

interface InventoryMetrics {
  totalWines: number;
  lowStockWines: Array<{
    id: string;
    name: string;
    currentStock: number;
    reorderPoint: number;
  }>;
  topSellingWines: Array<{
    id: string;
    name: string;
    salesCount: number;
    revenue: number;
    averageRating: number;
  }>;
  stockTurnoverRate: number;
}

interface ShippingMetrics {
  totalShipments: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  carrierPerformance: Array<{
    carrier: string;
    shipments: number;
    averageDeliveryTime: number;
    onTimeRate: number;
  }>;
  shippingCosts: {
    total: number;
    average: number;
    byCarrier: Array<{
      carrier: string;
      totalCost: number;
      averageCost: number;
    }>;
  };
}

// Validation schemas
const analyticsQuerySchema = z.object({
  wineCaveId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  period: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
});

const dateRangeSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

/**
 * Get comprehensive analytics data
 */
export const getComprehensiveAnalytics = async (args: z.infer<typeof analyticsQuerySchema>, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const { wineCaveId, startDate, endDate, period } = args;
    
    // Calculate date range
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : getStartDate(end, period);

    // Build where clause
    const whereClause: any = {
      createdAt: {
        gte: start,
        lte: end,
      },
    };

    if (wineCaveId) {
      whereClause.wineCaveId = wineCaveId;
    }

    // Get revenue metrics
    const revenueMetrics = await getRevenueMetrics(whereClause, context);
    
    // Get subscription metrics
    const subscriptionMetrics = await getSubscriptionMetrics(whereClause, context);
    
    // Get engagement metrics
    const engagementMetrics = await getEngagementMetrics(whereClause, context);
    
    // Get inventory metrics
    const inventoryMetrics = await getInventoryMetrics(wineCaveId, context);
    
    // Get shipping metrics
    const shippingMetrics = await getShippingMetrics(whereClause, context);

    return {
      revenue: revenueMetrics,
      subscriptions: subscriptionMetrics,
      engagement: engagementMetrics,
      inventory: inventoryMetrics,
      shipping: shippingMetrics,
      period: {
        start: start,
        end: end,
        type: period,
      },
    };
  } catch (error) {
    console.error('Error getting comprehensive analytics:', error);
    throw new HttpError(500, 'Failed to get analytics data');
  }
};

/**
 * Get revenue metrics
 */
async function getRevenueMetrics(whereClause: any, context: any): Promise<RevenueMetrics> {
  // Get all subscriptions in date range
  const subscriptions = await context.entities.WineSubscription.findMany({
    where: whereClause,
    include: {
      subscriptionTier: true,
      wineCave: true,
    },
  });

  const totalRevenue = subscriptions.reduce((sum: number, sub: any) => sum + sub.subscriptionTier.price, 0);
  const monthlyRecurringRevenue = totalRevenue; // Simplified for now
  const averageOrderValue = subscriptions.length > 0 ? totalRevenue / subscriptions.length : 0;

  // Calculate revenue growth (simplified)
  const previousPeriodStart = new Date(whereClause.createdAt.gte.getTime() - (whereClause.createdAt.lte.getTime() - whereClause.createdAt.gte.getTime()));
  const previousSubscriptions = await context.entities.WineSubscription.findMany({
    where: {
      ...whereClause,
      createdAt: {
        gte: previousPeriodStart,
        lt: whereClause.createdAt.gte,
      },
    },
    include: {
      subscriptionTier: true,
    },
  });

  const previousRevenue = previousSubscriptions.reduce((sum: number, sub: any) => sum + sub.subscriptionTier.price, 0);
  const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  // Get top performing wine caves
  const wineCaveRevenue = subscriptions.reduce((acc: any, sub: any) => {
    const caveId = sub.wineCaveId;
    if (!acc[caveId]) {
      acc[caveId] = {
        id: caveId,
        name: sub.wineCave.name,
        revenue: 0,
        subscriberCount: 0,
      };
    }
    acc[caveId].revenue += sub.subscriptionTier.price;
    acc[caveId].subscriberCount += 1;
    return acc;
  }, {});

  const topPerformingWineCaves = Object.values(wineCaveRevenue)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 5) as Array<{
      id: string;
      name: string;
      revenue: number;
      subscriberCount: number;
    }>;

  return {
    totalRevenue,
    monthlyRecurringRevenue,
    averageOrderValue,
    revenueGrowth,
    topPerformingWineCaves,
  };
}

/**
 * Get subscription metrics
 */
async function getSubscriptionMetrics(whereClause: any, context: any): Promise<SubscriptionMetrics> {
  const subscriptions = await context.entities.WineSubscription.findMany({
    where: whereClause,
    include: {
      subscriptionTier: true,
    },
  });

  const totalSubscribers = subscriptions.length;
  const activeSubscriptions = subscriptions.filter((sub: any) => sub.status === 'active').length;
  const churnRate = totalSubscribers > 0 ? ((totalSubscribers - activeSubscriptions) / totalSubscribers) * 100 : 0;

  // Calculate tier distribution
  const tierDistribution = subscriptions.reduce((acc: any, sub: any) => {
    const tierName = sub.subscriptionTier.name;
    if (!acc[tierName]) {
      acc[tierName] = {
        tier: tierName,
        count: 0,
        revenue: 0,
      };
    }
    acc[tierName].count += 1;
    acc[tierName].revenue += sub.subscriptionTier.price;
    return acc;
  }, {});

  const tierDistributionArray = Object.values(tierDistribution) as Array<{
    tier: string;
    count: number;
    revenue: number;
  }>;

  // Simplified calculations for now
  const averageLifetimeValue = totalSubscribers > 0 ? 
    subscriptions.reduce((sum: number, sub: any) => sum + sub.subscriptionTier.price, 0) / totalSubscribers : 0;
  
  const conversionRate = 100; // Simplified
  const subscriptionGrowth = 0; // Simplified

  return {
    totalSubscribers,
    activeSubscriptions,
    churnRate,
    conversionRate,
    averageLifetimeValue,
    subscriptionGrowth,
    tierDistribution: tierDistributionArray,
  };
}

/**
 * Get engagement metrics
 */
async function getEngagementMetrics(whereClause: any, context: any): Promise<EngagementMetrics> {
  const ratings = await context.entities.WineRating.findMany({
    where: whereClause,
    include: {
      wine: true,
      member: true,
    },
  });

  const averageRating = ratings.length > 0 ? 
    ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0) / ratings.length : 0;

  // Get top engaged members
  const memberEngagement = ratings.reduce((acc: any, rating: any) => {
    const memberId = rating.memberId;
    if (!acc[memberId]) {
      acc[memberId] = {
        id: memberId,
        username: rating.member.username,
        ratingsCount: 0,
        totalRating: 0,
        subscriptionDuration: 0, // Simplified
      };
    }
    acc[memberId].ratingsCount += 1;
    acc[memberId].totalRating += rating.rating;
    return acc;
  }, {});

  const topEngagedMembers = Object.values(memberEngagement)
    .map((member: any) => ({
      ...member,
      averageRating: member.ratingsCount > 0 ? member.totalRating / member.ratingsCount : 0,
    }))
    .sort((a: any, b: any) => b.ratingsCount - a.ratingsCount)
    .slice(0, 10);

  // Get wine preferences
  const winePreferences = ratings.reduce((acc: any, rating: any) => {
    const varietal = rating.wine.varietal;
    if (!acc[varietal]) {
      acc[varietal] = {
        varietal,
        totalRating: 0,
        count: 0,
      };
    }
    acc[varietal].totalRating += rating.rating;
    acc[varietal].count += 1;
    return acc;
  }, {});

  const winePreferencesArray = Object.values(winePreferences)
    .map((pref: any) => ({
      varietal: pref.varietal,
      averageRating: pref.count > 0 ? pref.totalRating / pref.count : 0,
      popularity: pref.count,
    }))
    .sort((a: any, b: any) => b.popularity - a.popularity);

  return {
    averageRating,
    totalRatings: ratings.length,
    memberRetention: 90, // Simplified
    topEngagedMembers,
    winePreferences: winePreferencesArray,
  };
}

/**
 * Get inventory metrics
 */
async function getInventoryMetrics(wineCaveId: string | undefined, context: any): Promise<InventoryMetrics> {
  const whereClause: any = {};
  if (wineCaveId) {
    whereClause.wineCaveId = wineCaveId;
  }

  const wines = await context.entities.Wine.findMany({
    where: whereClause,
    include: {
      ratings: true,
      shipmentItems: true,
    },
  });

  const totalWines = wines.length;
  
  // Get low stock wines (less than 10 bottles)
  const lowStockWines = wines
    .filter((wine: any) => wine.stockQuantity < 10)
    .map((wine: any) => ({
      id: wine.id,
      name: wine.name,
      currentStock: wine.stockQuantity,
      reorderPoint: 10,
    }));

  // Get top selling wines
  const topSellingWines = wines
    .map((wine: any) => ({
      id: wine.id,
      name: wine.name,
      salesCount: wine.shipmentItems.length,
      revenue: wine.shipmentItems.reduce((sum: number, item: any) => sum + wine.price, 0),
      averageRating: wine.ratings.length > 0 ? 
        wine.ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0) / wine.ratings.length : 0,
    }))
    .sort((a: any, b: any) => b.salesCount - a.salesCount)
    .slice(0, 10);

  const stockTurnoverRate = totalWines > 0 ? 
    wines.reduce((sum: number, wine: any) => sum + wine.shipmentItems.length, 0) / totalWines : 0;

  return {
    totalWines,
    lowStockWines,
    topSellingWines,
    stockTurnoverRate,
  };
}

/**
 * Get shipping metrics
 */
async function getShippingMetrics(whereClause: any, context: any): Promise<ShippingMetrics> {
  const shipments = await context.entities.Shipment.findMany({
    where: whereClause,
    include: {
      subscription: true,
    },
  });

  const totalShipments = shipments.length;
  
  // Calculate carrier performance
  const carrierPerformance = shipments.reduce((acc: any, shipment: any) => {
    const carrier = shipment.carrier || 'Unknown';
    if (!acc[carrier]) {
      acc[carrier] = {
        carrier,
        shipments: 0,
        totalDeliveryTime: 0,
        onTimeDeliveries: 0,
      };
    }
    acc[carrier].shipments += 1;
    
    // Simplified delivery time calculation
    if (shipment.estimatedDelivery && shipment.createdAt) {
      const deliveryTime = shipment.estimatedDelivery.getTime() - shipment.createdAt.getTime();
      acc[carrier].totalDeliveryTime += deliveryTime;
      acc[carrier].onTimeDeliveries += 1; // Simplified
    }
    
    return acc;
  }, {});

  const carrierPerformanceArray = Object.values(carrierPerformance).map((carrier: any) => ({
    carrier: carrier.carrier,
    shipments: carrier.shipments,
    averageDeliveryTime: carrier.shipments > 0 ? carrier.totalDeliveryTime / carrier.shipments : 0,
    onTimeRate: carrier.shipments > 0 ? (carrier.onTimeDeliveries / carrier.shipments) * 100 : 0,
  }));

  const averageDeliveryTime = totalShipments > 0 ? 
    shipments.reduce((sum: number, shipment: any) => {
      if (shipment.estimatedDelivery && shipment.createdAt) {
        return sum + (shipment.estimatedDelivery.getTime() - shipment.createdAt.getTime());
      }
      return sum;
    }, 0) / totalShipments : 0;

  const onTimeDeliveryRate = 95; // Simplified

  return {
    totalShipments,
    averageDeliveryTime,
    onTimeDeliveryRate,
    carrierPerformance: carrierPerformanceArray,
    shippingCosts: {
      total: totalShipments * 15, // Simplified average cost
      average: 15,
      byCarrier: carrierPerformanceArray.map((carrier: any) => ({
        carrier: carrier.carrier,
        totalCost: carrier.shipments * 15,
        averageCost: 15,
      })),
    },
  };
}

/**
 * Helper function to get start date based on period
 */
function getStartDate(endDate: Date, period: string): Date {
  const start = new Date(endDate);
  
  switch (period) {
    case 'day':
      start.setDate(start.getDate() - 1);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(start.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
  }
  
  return start;
}

/**
 * Get real-time dashboard metrics
 */
export const getDashboardMetrics = async (args: { wineCaveId?: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const { wineCaveId } = args;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const whereClause: any = {
      createdAt: {
        gte: thirtyDaysAgo,
        lte: now,
      },
    };

    if (wineCaveId) {
      whereClause.wineCaveId = wineCaveId;
    }

    // Get quick metrics
    const [
      totalSubscribers,
      activeSubscriptions,
      totalRevenue,
      totalShipments,
      lowStockCount,
      averageRating,
    ] = await Promise.all([
      context.entities.WineSubscription.count({ where: whereClause }),
      context.entities.WineSubscription.count({ 
        where: { ...whereClause, status: 'active' } 
      }),
      context.entities.WineSubscription.findMany({
        where: whereClause,
        include: { subscriptionTier: true },
      }).then((subs: any[]) => subs.reduce((sum: number, sub: any) => sum + sub.subscriptionTier.price, 0)),
      context.entities.Shipment.count({ where: whereClause }),
      context.entities.Wine.count({ 
        where: { ...(wineCaveId ? { wineCaveId } : {}), stockQuantity: { lt: 10 } } 
      }),
      context.entities.WineRating.findMany({
        where: whereClause,
      }).then((ratings: any[]) => 
        ratings.length > 0 ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length : 0
      ),
    ]);

    const churnRate = totalSubscribers > 0 ? ((totalSubscribers - activeSubscriptions) / totalSubscribers) * 100 : 0;

    return {
      totalSubscribers,
      activeSubscriptions,
      totalRevenue,
      totalShipments,
      lowStockCount,
      averageRating: Math.round(averageRating * 10) / 10,
      churnRate: Math.round(churnRate * 10) / 10,
      period: 'Last 30 days',
    };
  } catch (error) {
    console.error('Error getting dashboard metrics:', error);
    throw new HttpError(500, 'Failed to get dashboard metrics');
  }
};
