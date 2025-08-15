import { prisma } from 'wasp/server';
import { HttpError } from 'wasp/server';
import type { User, WineSubscription } from 'wasp/entities';

type AwardPointsInput = {
  subscriptionId: string;
  points: number;
  reason: string;
};

type RedeemPointsInput = {
  subscriptionId: string;
  points: number;
  rewardType: 'discount' | 'free_shipping' | 'bonus_wine';
};

type CreateReferralInput = {
  referrerEmail: string;
  refereeEmail: string;
};

// Point values for different actions
const POINT_VALUES = {
  MONTHLY_SUBSCRIPTION: 100,
  REFERRAL_BONUS: 500,
  FIRST_PURCHASE: 200,
  ANNUAL_SUBSCRIPTION: 1500,
  WINE_REVIEW: 50,
  SOCIAL_SHARE: 25,
};

// Reward redemption costs
const REWARD_COSTS = {
  DISCOUNT_10_PERCENT: 1000,
  FREE_SHIPPING: 500,
  BONUS_WINE: 2000,
  DISCOUNT_20_PERCENT: 2000,
  PREMIUM_UPGRADE: 3000,
};

// Award points to a subscription
export const awardPoints = async (args: AwardPointsInput, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to award points');
  }

  const subscription = await prisma.wineSubscription.findFirst({
    where: {
      id: args.subscriptionId,
    },
    include: {
      member: true,
      wineCave: true,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Subscription not found');
  }

  // Only wine cave owners can award points
  if (subscription.wineCave.ownerId !== context.user.id) {
    throw new HttpError(403, 'You do not have permission to award points');
  }

  // Create loyalty points record
  const loyaltyPoints = await prisma.loyaltyPoints.create({
    data: {
      memberId: subscription.memberId,
      subscriptionId: args.subscriptionId,
      wineCaveId: subscription.wineCaveId,
      points: args.points,
      reason: args.reason,
      type: 'earned',
    },
  });

  // Update member's total points
  await prisma.user.update({
    where: { id: subscription.memberId },
    data: {
      loyaltyPoints: {
        increment: args.points,
      },
    },
  });

  return loyaltyPoints;
};

// Redeem points for rewards
export const redeemPoints = async (args: RedeemPointsInput, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to redeem points');
  }

  const subscription = await prisma.wineSubscription.findFirst({
    where: {
      id: args.subscriptionId,
      memberId: context.user.id,
    },
    include: {
      member: true,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Subscription not found or not owned by you');
  }

  // Check if user has enough points
  const user = await prisma.user.findUnique({
    where: { id: context.user.id },
  });

  if (!user || (user.loyaltyPoints || 0) < args.points) {
    throw new HttpError(400, 'Insufficient loyalty points');
  }

  // Create redemption record
  const redemption = await prisma.loyaltyPoints.create({
    data: {
      memberId: context.user.id,
      subscriptionId: args.subscriptionId,
      wineCaveId: subscription.wineCaveId,
      points: -args.points, // Negative for redemption
      reason: `Redeemed for ${args.rewardType}`,
      type: 'redeemed',
    },
  });

  // Update member's total points
  await prisma.user.update({
    where: { id: context.user.id },
    data: {
      loyaltyPoints: {
        decrement: args.points,
      },
    },
  });

  // Apply the reward (in real implementation, would create discount codes, etc.)
  let rewardDetails = {};
  switch (args.rewardType) {
    case 'discount':
      rewardDetails = { discountPercent: args.points >= 2000 ? 20 : 10 };
      break;
    case 'free_shipping':
      rewardDetails = { freeShipping: true };
      break;
    case 'bonus_wine':
      rewardDetails = { bonusWine: true };
      break;
  }

  return {
    redemption,
    rewardDetails,
    remainingPoints: (user.loyaltyPoints || 0) - args.points,
  };
};

// Create a referral
export const createReferral = async (args: CreateReferralInput, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to create referrals');
  }

  // Find referrer
  const referrer = await prisma.user.findUnique({
    where: { email: args.referrerEmail },
  });

  if (!referrer) {
    throw new HttpError(404, 'Referrer not found');
  }

  // Check if referrer is the current user
  if (referrer.id !== context.user.id) {
    throw new HttpError(403, 'You can only create referrals for yourself');
  }

  // Check if referee already exists
  const existingReferee = await prisma.user.findUnique({
    where: { email: args.refereeEmail },
  });

  if (existingReferee) {
    throw new HttpError(400, 'Referee is already a member');
  }

  // Create referral record
  const referral = await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      refereeEmail: args.refereeEmail,
      status: 'pending',
      code: generateReferralCode(),
    },
  });

  return referral;
};

// Process referral when referee signs up
export const processReferralSignup = async (refereeEmail: string, refereeId: string): Promise<void> => {
  // Find pending referral
  const referral = await prisma.referral.findFirst({
    where: {
      refereeEmail,
      status: 'pending',
    },
    include: {
      referrer: true,
    },
  });

  if (!referral) {
    return; // No referral found, continue normal signup
  }

  // Update referral status
  await prisma.referral.update({
    where: { id: referral.id },
    data: {
      refereeId,
      status: 'completed',
      completedAt: new Date(),
    },
  });

  // Award points to referrer
  await prisma.loyaltyPoints.create({
    data: {
      memberId: referral.referrerId,
      points: POINT_VALUES.REFERRAL_BONUS,
      reason: `Referral bonus for inviting ${refereeEmail}`,
      type: 'earned',
    },
  });

  // Update referrer's total points
  await prisma.user.update({
    where: { id: referral.referrerId },
    data: {
      loyaltyPoints: {
        increment: POINT_VALUES.REFERRAL_BONUS,
      },
    },
  });

  // Award welcome bonus to referee
  await prisma.loyaltyPoints.create({
    data: {
      memberId: refereeId,
      points: POINT_VALUES.FIRST_PURCHASE,
      reason: 'Welcome bonus for joining through referral',
      type: 'earned',
    },
  });

  // Update referee's total points
  await prisma.user.update({
    where: { id: refereeId },
    data: {
      loyaltyPoints: {
        increment: POINT_VALUES.FIRST_PURCHASE,
      },
    },
  });
};

// Get member's loyalty points history
export const getLoyaltyPointsHistory = async (context: any): Promise<any[]> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to view loyalty points');
  }

  const pointsHistory = await prisma.loyaltyPoints.findMany({
    where: {
      memberId: context.user.id,
    },
    include: {
      subscription: {
        include: {
          wineCave: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return pointsHistory;
};

// Get member's referrals
export const getReferrals = async (context: any): Promise<any[]> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to view referrals');
  }

  const referrals = await prisma.referral.findMany({
    where: {
      referrerId: context.user.id,
    },
    include: {
      referee: {
        select: {
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return referrals;
};

// Get available rewards
export const getAvailableRewards = async (context: any): Promise<any[]> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to view rewards');
  }

  const user = await prisma.user.findUnique({
    where: { id: context.user.id },
  });

  const userPoints = user?.loyaltyPoints || 0;

  const rewards = [
    {
      id: 'discount_10',
      name: '10% Discount',
      cost: REWARD_COSTS.DISCOUNT_10_PERCENT,
      available: userPoints >= REWARD_COSTS.DISCOUNT_10_PERCENT,
      description: 'Get 10% off your next wine shipment',
    },
    {
      id: 'free_shipping',
      name: 'Free Shipping',
      cost: REWARD_COSTS.FREE_SHIPPING,
      available: userPoints >= REWARD_COSTS.FREE_SHIPPING,
      description: 'Free shipping on your next order',
    },
    {
      id: 'bonus_wine',
      name: 'Bonus Wine',
      cost: REWARD_COSTS.BONUS_WINE,
      available: userPoints >= REWARD_COSTS.BONUS_WINE,
      description: 'Get an extra bottle in your next shipment',
    },
    {
      id: 'discount_20',
      name: '20% Discount',
      cost: REWARD_COSTS.DISCOUNT_20_PERCENT,
      available: userPoints >= REWARD_COSTS.DISCOUNT_20_PERCENT,
      description: 'Get 20% off your next wine shipment',
    },
    {
      id: 'premium_upgrade',
      name: 'Premium Upgrade',
      cost: REWARD_COSTS.PREMIUM_UPGRADE,
      available: userPoints >= REWARD_COSTS.PREMIUM_UPGRADE,
      description: 'Upgrade to premium tier for one month',
    },
  ];

  return rewards;
};

// Auto-award points for subscription milestones
export const autoAwardSubscriptionPoints = async (subscriptionId: string): Promise<void> => {
  const subscription = await prisma.wineSubscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!subscription) {
    return;
  }

  // Award monthly subscription points
  await prisma.loyaltyPoints.create({
    data: {
      memberId: subscription.memberId,
      subscriptionId: subscription.id,
      wineCaveId: subscription.wineCaveId,
      points: POINT_VALUES.MONTHLY_SUBSCRIPTION,
      reason: 'Monthly subscription points',
      type: 'earned',
    },
  });

  // Update member's total points
  await prisma.user.update({
    where: { id: subscription.memberId },
    data: {
      loyaltyPoints: {
        increment: POINT_VALUES.MONTHLY_SUBSCRIPTION,
      },
    },
  });
};

// Helper function to generate referral codes
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 