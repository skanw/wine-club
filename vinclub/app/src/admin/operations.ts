import { HttpError } from 'wasp/server';
import type {
  GetAdminPlatformStats,
  GetCavisteHealthScores,
  GetInventoryTrends,
  GetOperationsStatus,
} from 'wasp/server/operations';

/**
 * Platform-wide statistics for admin dashboard
 */
export const getAdminPlatformStats: GetAdminPlatformStats<
  void,
  {
    gmvTotal: number;
    commissionRevenue: number;
    activationRate: number;
    totalCaves: number;
    activeCaves: number;
    totalMembers: number;
    totalSubscriptions: number;
    weeklyGMV: Array<{ date: string; amount: number }>;
  }
> = async (_args, context) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(403, 'Admin access required');
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  // Get all caves
  const totalCaves = await context.entities.Cave.count();

  // Get caves that sent a campaign in last 30 days
  const activeCavesResult = await context.entities.Campaign.groupBy({
    by: ['caveId'],
    where: {
      status: 'sent',
      sentAt: { gte: thirtyDaysAgo },
    },
  });
  const activeCaves = activeCavesResult.length;

  // Calculate activation rate: caves with campaign sent within 48h of cave creation
  const cavesWithEarlyCampaign = await context.entities.Cave.findMany({
    include: {
      campaigns: {
        where: { status: 'sent' },
        orderBy: { sentAt: 'asc' },
        take: 1,
      },
    },
  });

  const activatedCaves = cavesWithEarlyCampaign.filter((cave) => {
    const firstCampaign = cave.campaigns[0];
    if (!firstCampaign?.sentAt) return false;
    const timeDiff = firstCampaign.sentAt.getTime() - cave.createdAt.getTime();
    return timeDiff <= 48 * 60 * 60 * 1000; // 48 hours
  }).length;

  const activationRate = totalCaves > 0 ? Math.round((activatedCaves / totalCaves) * 100) : 0;

  // Calculate GMV from subscriptions
  const subscriptionGMV = await context.entities.Subscription.aggregate({
    where: { status: 'active' },
    _sum: { amount: true },
  });

  // Calculate GMV from campaigns (productPrice * clickedCount as proxy for sales)
  const campaignGMV = await context.entities.Campaign.aggregate({
    where: { status: 'sent' },
    _sum: { productPrice: true },
  });

  // For campaign GMV, multiply by clicked count (as a sales proxy)
  const campaignsWithClicks = await context.entities.Campaign.findMany({
    where: { status: 'sent', clickedCount: { gt: 0 } },
    select: { productPrice: true, clickedCount: true },
  });

  const campaignRevenue = campaignsWithClicks.reduce(
    (sum, c) => sum + c.productPrice * c.clickedCount,
    0
  );

  const gmvTotal = (subscriptionGMV._sum?.amount || 0) * 12 + campaignRevenue; // Annualized subscription revenue
  const commissionRevenue = Math.round(gmvTotal * 0.015 * 100) / 100; // 1.5% commission

  // Total members across all caves
  const totalMembers = await context.entities.Member.count({
    where: { deletedAt: null },
  });

  // Total active subscriptions
  const totalSubscriptions = await context.entities.Subscription.count({
    where: { status: 'active' },
  });

  // Weekly GMV data for chart (last 7 days)
  const weeklyGMV: Array<{ date: string; amount: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const dayCampaigns = await context.entities.Campaign.findMany({
      where: {
        status: 'sent',
        sentAt: { gte: dayStart, lte: dayEnd },
        clickedCount: { gt: 0 },
      },
      select: { productPrice: true, clickedCount: true },
    });

    const dayRevenue = dayCampaigns.reduce(
      (sum, c) => sum + c.productPrice * c.clickedCount,
      0
    );

    weeklyGMV.push({
      date: dayStart.toISOString().split('T')[0],
      amount: dayRevenue,
    });
  }

  return {
    gmvTotal,
    commissionRevenue,
    activationRate,
    totalCaves,
    activeCaves,
    totalMembers,
    totalSubscriptions,
    weeklyGMV,
  };
};

/**
 * Health scores for each caviste (cave)
 */
export const getCavisteHealthScores: GetCavisteHealthScores<
  { page?: number; pageSize?: number },
  {
    cavistes: Array<{
      id: string;
      name: string;
      healthScore: number;
      memberCount: number;
      subscriberCount: number;
      lastCampaignDate: Date | null;
      campaignsLast30Days: number;
      smsCreditsUsed: number;
    }>;
    totalPages: number;
    totalCount: number;
  }
> = async (args, context) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(403, 'Admin access required');
  }

  const page = args.page || 0;
  const pageSize = args.pageSize || 10;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const totalCount = await context.entities.Cave.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  const caves = await context.entities.Cave.findMany({
    skip: page * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
    include: {
      members: {
        where: { deletedAt: null },
        select: { id: true },
      },
      campaigns: {
        where: { status: 'sent' },
        orderBy: { sentAt: 'desc' },
        select: { sentAt: true },
      },
    },
  });

  const cavistes = await Promise.all(
    caves.map(async (cave) => {
      // Count subscribers
      const subscriberCount = await context.entities.Subscription.count({
        where: { caveId: cave.id, status: 'active' },
      });

      // Count campaigns in last 30 days
      const campaignsLast30Days = cave.campaigns.filter(
        (c) => c.sentAt && c.sentAt >= thirtyDaysAgo
      ).length;

      // Count SMS credits used (messages sent)
      const smsCreditsUsed = await context.entities.MessageQueueItem.count({
        where: {
          caveId: cave.id,
          channel: 'sms',
          status: 'sent',
        },
      });

      // Calculate health score (0-100)
      // Based on: campaign frequency (40%), subscriber growth (30%), member base (30%)
      const campaignScore = Math.min(campaignsLast30Days * 10, 40); // Max 40 points
      const subscriberScore = Math.min(subscriberCount * 3, 30); // Max 30 points
      const memberScore = Math.min(cave.members.length * 0.5, 30); // Max 30 points
      const healthScore = Math.round(campaignScore + subscriberScore + memberScore);

      return {
        id: cave.id,
        name: cave.name,
        healthScore: Math.min(healthScore, 100),
        memberCount: cave.members.length,
        subscriberCount,
        lastCampaignDate: cave.campaigns[0]?.sentAt || null,
        campaignsLast30Days,
        smsCreditsUsed,
      };
    })
  );

  // Sort by health score descending
  cavistes.sort((a, b) => b.healthScore - a.healthScore);

  return {
    cavistes,
    totalPages,
    totalCount,
  };
};

/**
 * Inventory trends - top selling products across platform
 */
export const getInventoryTrends: GetInventoryTrends<
  void,
  {
    topPepites: Array<{
      productName: string;
      salesCount: number;
      totalRevenue: number;
      averagePrice: number;
    }>;
    averageRotationDays: number;
    totalCampaignsSent: number;
  }
> = async (_args, context) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(403, 'Admin access required');
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Get campaigns from last 30 days with clicks (as sales proxy)
  const campaigns = await context.entities.Campaign.findMany({
    where: {
      status: 'sent',
      sentAt: { gte: thirtyDaysAgo },
    },
    select: {
      productName: true,
      productPrice: true,
      clickedCount: true,
      sentAt: true,
    },
    orderBy: { clickedCount: 'desc' },
  });

  // Aggregate by product name
  const productMap = new Map<
    string,
    { salesCount: number; totalRevenue: number; prices: number[] }
  >();

  campaigns.forEach((campaign) => {
    const existing = productMap.get(campaign.productName) || {
      salesCount: 0,
      totalRevenue: 0,
      prices: [],
    };
    existing.salesCount += campaign.clickedCount;
    existing.totalRevenue += campaign.productPrice * campaign.clickedCount;
    existing.prices.push(campaign.productPrice);
    productMap.set(campaign.productName, existing);
  });

  // Convert to array and sort by sales
  const topPepites = Array.from(productMap.entries())
    .map(([productName, data]) => ({
      productName,
      salesCount: data.salesCount,
      totalRevenue: Math.round(data.totalRevenue * 100) / 100,
      averagePrice:
        Math.round(
          (data.prices.reduce((a, b) => a + b, 0) / data.prices.length) * 100
        ) / 100,
    }))
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 10);

  // Calculate average rotation (time from campaign creation to first click)
  // For now, use a simpler metric: average days between campaigns
  const totalCampaignsSent = campaigns.length;
  const averageRotationDays = totalCampaignsSent > 0 ? Math.round(30 / totalCampaignsSent * 10) / 10 : 0;

  return {
    topPepites,
    averageRotationDays,
    totalCampaignsSent,
  };
};

/**
 * Operations status - webhooks, message queue, sync events
 */
export const getOperationsStatus: GetOperationsStatus<
  void,
  {
    webhooks: {
      recent: Array<{
        id: string;
        provider: string;
        eventType: string;
        status: string;
        createdAt: Date;
        errorMsg: string | null;
      }>;
      successRate: number;
      totalToday: number;
    };
    messageQueue: {
      queued: number;
      sending: number;
      sent: number;
      failed: number;
    };
    syncStatus: {
      pending: number;
      synced: number;
      failed: number;
      lastSyncAt: Date | null;
    };
  }
> = async (_args, context) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(403, 'Admin access required');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Recent webhook logs
  const recentWebhooks = await context.entities.WebhookLog.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      provider: true,
      eventType: true,
      status: true,
      createdAt: true,
      errorMsg: true,
    },
  });

  // Webhook stats for today
  const webhooksToday = await context.entities.WebhookLog.count({
    where: { createdAt: { gte: today } },
  });

  const successfulWebhooksToday = await context.entities.WebhookLog.count({
    where: { createdAt: { gte: today }, status: 'success' },
  });

  const webhookSuccessRate =
    webhooksToday > 0 ? Math.round((successfulWebhooksToday / webhooksToday) * 100) : 100;

  // Message queue status
  const [queued, sending, sent, failed] = await Promise.all([
    context.entities.MessageQueueItem.count({ where: { status: 'queued' } }),
    context.entities.MessageQueueItem.count({ where: { status: 'sending' } }),
    context.entities.MessageQueueItem.count({ where: { status: 'sent' } }),
    context.entities.MessageQueueItem.count({ where: { status: 'failed' } }),
  ]);

  // Sync status
  const [pendingSync, syncedSync, failedSync] = await Promise.all([
    context.entities.SyncEvent.count({ where: { status: 'pending' } }),
    context.entities.SyncEvent.count({ where: { status: 'synced' } }),
    context.entities.SyncEvent.count({ where: { status: 'failed' } }),
  ]);

  // Last successful sync
  const lastSync = await context.entities.SyncEvent.findFirst({
    where: { status: 'synced' },
    orderBy: { syncedAt: 'desc' },
    select: { syncedAt: true },
  });

  return {
    webhooks: {
      recent: recentWebhooks,
      successRate: webhookSuccessRate,
      totalToday: webhooksToday,
    },
    messageQueue: {
      queued,
      sending,
      sent,
      failed,
    },
    syncStatus: {
      pending: pendingSync,
      synced: syncedSync,
      failed: failedSync,
      lastSyncAt: lastSync?.syncedAt || null,
    },
  };
};
