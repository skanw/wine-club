import type { GetDashboardStats } from 'wasp/server/operations';
import { requireAuthenticatedCave } from '../server/utils/tenant';

/**
 * Get dashboard statistics for the authenticated cave
 */
export const getDashboardStats: GetDashboardStats<
  {},
  {
    members: {
      total: number;
      newThisMonth: number;
      withEmailConsent: number;
      withSmsConsent: number;
    };
    subscriptions: {
      total: number;
      active: number;
      paused: number;
      cancelled: number;
      monthlyRecurringRevenue: number;
    };
    campaigns: {
      total: number;
      sent: number;
      draft: number;
      totalRevenue: number;
      avgOpenRate: number;
      deliveryRate: number;
      clickRate: number;
    };
    recentActivity: Array<{
      type: 'member' | 'subscription' | 'campaign';
      id: string;
      title: string;
      timestamp: Date;
    }>;
  }
> = async (_args, context) => {
  const caveId = requireAuthenticatedCave(context);

  // Get current month boundaries
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Fetch all stats in parallel
  const [
    memberStats,
    subscriptionStats,
    campaignStats,
    recentMembers,
    recentSubscriptions,
    recentCampaigns,
  ] = await Promise.all([
    // Member statistics
    Promise.all([
      context.entities.Member.count({
        where: { caveId, deletedAt: null },
      }),
      context.entities.Member.count({
        where: {
          caveId,
          deletedAt: null,
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
      context.entities.Member.count({
        where: { caveId, deletedAt: null, consentEmail: true },
      }),
      context.entities.Member.count({
        where: { caveId, deletedAt: null, consentSms: true },
      }),
    ]),

    // Subscription statistics
    Promise.all([
      context.entities.Subscription.count({
        where: { caveId },
      }),
      context.entities.Subscription.count({
        where: { caveId, status: 'active' },
      }),
      context.entities.Subscription.count({
        where: { caveId, status: 'paused' },
      }),
      context.entities.Subscription.count({
        where: { caveId, status: 'cancelled' },
      }),
      context.entities.Subscription.aggregate({
        where: { caveId, status: 'active' },
        _sum: { amount: true },
      }),
    ]),

    // Campaign statistics
    Promise.all([
      context.entities.Campaign.count({
        where: { caveId },
      }),
      context.entities.Campaign.count({
        where: { caveId, status: 'sent' },
      }),
      context.entities.Campaign.count({
        where: { caveId, status: 'draft' },
      }),
      // Revenue: only sent campaigns with clicks (actual conversions)
      context.entities.Campaign.findMany({
        where: { caveId, status: 'sent', clickedCount: { gt: 0 } },
        select: { productPrice: true, clickedCount: true },
      }),
      context.entities.Campaign.aggregate({
        where: { caveId, status: 'sent' },
        _sum: {
          openedCount: true,
          sentCount: true,
        },
      }),
      // Delivery and click rates for sent campaigns
      context.entities.Campaign.aggregate({
        where: { caveId, status: 'sent' },
        _sum: {
          sentCount: true,
          deliveredCount: true,
          clickedCount: true,
        },
      }),
    ]),

    // Recent members (last 5)
    context.entities.Member.findMany({
      where: { caveId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    }),

    // Recent subscriptions (last 5)
    context.entities.Subscription.findMany({
      where: { caveId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        member: {
          select: { name: true },
        },
        plan: {
          select: { name: true },
        },
      },
    }),

    // Recent campaigns (last 5)
    context.entities.Campaign.findMany({
      where: { caveId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    }),
  ]);

  // Calculate monthly recurring revenue
  const monthlyRecurringRevenue = subscriptionStats[4]?._sum?.amount || 0;

  // Calculate actual campaign revenue (clickedCount * productPrice for sent campaigns)
  const sentCampaignsWithClicks = campaignStats[3] || [];
  const actualRevenue = sentCampaignsWithClicks.reduce(
    (sum, c) => sum + (c.productPrice * c.clickedCount),
    0
  );

  // Calculate average open rate: sum of openedCount / sum of sentCount
  const sumSentCount = campaignStats[4]._sum?.sentCount || 0;
  const sumOpenedCount = campaignStats[4]._sum?.openedCount || 0;
  const avgOpenRate = sumSentCount > 0 ? (sumOpenedCount / sumSentCount) * 100 : 0;

  // Calculate delivery and click rates
  const deliveryAggregates = campaignStats[5]?._sum || {};
  const totalSentMessages = deliveryAggregates.sentCount || 0;
  const totalDeliveredMessages = deliveryAggregates.deliveredCount || 0;
  const totalClickedMessages = deliveryAggregates.clickedCount || 0;

  const deliveryRate = totalSentMessages > 0 ? (totalDeliveredMessages / totalSentMessages) * 100 : 0;
  const clickRate = totalSentMessages > 0 ? (totalClickedMessages / totalSentMessages) * 100 : 0;

  // Build recent activity array
  const recentActivity: Array<{
    type: 'member' | 'subscription' | 'campaign';
    id: string;
    title: string;
    timestamp: Date;
  }> = [
    ...recentMembers.map((m) => ({
      type: 'member' as const,
      id: m.id,
      title: `${m.name} a rejoint le club`,
      timestamp: m.createdAt,
    })),
    ...recentSubscriptions.map((s) => ({
      type: 'subscription' as const,
      id: s.id,
      title: `${s.member.name} - ${s.plan.name}`,
      timestamp: s.createdAt,
    })),
    ...recentCampaigns.map((c) => ({
      type: 'campaign' as const,
      id: c.id,
      title: `Campagne "${c.name}" créée`,
      timestamp: c.createdAt,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  return {
    members: {
      total: memberStats[0],
      newThisMonth: memberStats[1],
      withEmailConsent: memberStats[2],
      withSmsConsent: memberStats[3],
    },
    subscriptions: {
      total: subscriptionStats[0],
      active: subscriptionStats[1],
      paused: subscriptionStats[2],
      cancelled: subscriptionStats[3],
      monthlyRecurringRevenue: Number(monthlyRecurringRevenue),
    },
    campaigns: {
      total: campaignStats[0],
      sent: campaignStats[1],
      draft: campaignStats[2],
      totalRevenue: Number(actualRevenue),
      avgOpenRate: Math.round(avgOpenRate * 100) / 100,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      clickRate: Math.round(clickRate * 100) / 100,
    },
    recentActivity,
  };
};
