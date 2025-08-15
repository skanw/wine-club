import { HttpError } from 'wasp/server';

export const createReferral = async (args: { 
  referrerId: string; 
  refereeEmail: string; 
  wineCaveId?: string; 
}, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Check if referee already exists
    const existingUser = await context.entities.User.findUnique({
      where: { email: args.refereeEmail },
    });

    if (existingUser) {
      throw new HttpError(400, 'User with this email already exists');
    }

    // Check if referral already exists
    const existingReferral = await context.entities.Referral.findFirst({
      where: {
        referrerId: args.referrerId,
        refereeEmail: args.refereeEmail,
      },
    });

    if (existingReferral) {
      throw new HttpError(400, 'Referral already exists');
    }

    // Create referral
    const referral = await context.entities.Referral.create({
      data: {
        referrerId: args.referrerId,
        refereeEmail: args.refereeEmail,
        wineCaveId: args.wineCaveId,
        status: 'pending',
        referralCode: generateReferralCode(),
      },
    });

    // Send referral email
    await sendReferralEmail(args.refereeEmail, referral.referralCode, context);

    return referral;
  } catch (error) {
    console.error('Error creating referral:', error);
    throw new HttpError(500, 'Failed to create referral');
  }
};

export const completeReferral = async (args: { 
  referralCode: string; 
  newUserId: string; 
}, context: any): Promise<any> => {
  try {
    // Find referral by code
    const referral = await context.entities.Referral.findFirst({
      where: { referralCode: args.referralCode },
    });

    if (!referral) {
      throw new HttpError(404, 'Invalid referral code');
    }

    if (referral.status !== 'pending') {
      throw new HttpError(400, 'Referral already completed or expired');
    }

    // Update referral status
    await context.entities.Referral.update({
      where: { id: referral.id },
      data: {
        status: 'completed',
        refereeId: args.newUserId,
        completedAt: new Date(),
      },
    });

    // Award points to referrer
    await awardLoyaltyPoints({ 
      userId: referral.referrerId, 
      points: 500, 
      reason: 'referral_bonus',
      description: 'Referral bonus'
    }, context);

    // Award points to referee
    await awardLoyaltyPoints({ 
      userId: args.newUserId, 
      points: 250, 
      reason: 'referral_signup',
      description: 'Referral signup bonus'
    }, context);

    return { success: true, referral };
  } catch (error) {
    console.error('Error completing referral:', error);
    throw new HttpError(500, 'Failed to complete referral');
  }
};

export const awardLoyaltyPoints = async (args: { 
  userId: string; 
  points: number; 
  reason: string; 
  description?: string; 
}, context: any): Promise<any> => {
  try {
    // Create loyalty points record
    const loyaltyPoints = await context.entities.LoyaltyPoints.create({
      data: {
        memberId: args.userId,
        points: args.points,
        reason: args.reason,
        description: args.description,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    // Update user's total loyalty points
    await context.entities.User.update({
      where: { id: args.userId },
      data: {
        loyaltyPoints: {
          increment: args.points,
        },
      },
    });

    return loyaltyPoints;
  } catch (error) {
    console.error('Error awarding loyalty points:', error);
    throw new HttpError(500, 'Failed to award loyalty points');
  }
};

export const getUserLoyaltyHistory = async (args: { userId: string }, context: any): Promise<any[]> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  return await context.entities.LoyaltyPoints.findMany({
    where: { memberId: args.userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getReferralHistory = async (args: { userId: string }, context: any): Promise<any[]> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  return await context.entities.Referral.findMany({
    where: { referrerId: args.userId },
    include: {
      referee: true,
      wineCave: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const redeemLoyaltyPoints = async (args: { 
  userId: string; 
  points: number; 
  rewardType: 'discount' | 'free_shipping' | 'upgrade' | 'gift_card'; 
}, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Check if user has enough points
    const user = await context.entities.User.findUnique({
      where: { id: args.userId },
    });

    if (!user || user.loyaltyPoints < args.points) {
      throw new HttpError(400, 'Insufficient loyalty points');
    }

    // Create redemption record
    const redemption = await context.entities.LoyaltyTransaction.create({
      data: {
        memberId: args.userId,
        points: -args.points, // Negative for redemption
        reason: 'redemption',
        description: `Redeemed ${args.points} points for ${args.rewardType}`,
        rewardType: args.rewardType,
      },
    });

    // Update user's loyalty points
    await context.entities.User.update({
      where: { id: args.userId },
      data: {
        loyaltyPoints: {
          decrement: args.points,
        },
      },
    });

    return redemption;
  } catch (error) {
    console.error('Error redeeming loyalty points:', error);
    throw new HttpError(500, 'Failed to redeem loyalty points');
  }
};

export const getLoyaltyRewards = async (args: { userId: string }, context: any): Promise<any[]> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  const user = await context.entities.User.findUnique({
    where: { id: args.userId },
  });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  // Define available rewards based on points
  const rewards = [
    {
      id: 'discount_10',
      name: '10% Discount',
      description: 'Get 10% off your next subscription',
      pointsRequired: 1000,
      type: 'discount',
      value: 10,
    },
    {
      id: 'free_shipping',
      name: 'Free Shipping',
      description: 'Free shipping on your next order',
      pointsRequired: 500,
      type: 'free_shipping',
      value: 15,
    },
    {
      id: 'upgrade',
      name: 'Subscription Upgrade',
      description: 'Upgrade to next tier for one month',
      pointsRequired: 2000,
      type: 'upgrade',
      value: 50,
    },
    {
      id: 'gift_card_25',
      name: '€25 Gift Card',
      description: '€25 gift card to use on any purchase',
      pointsRequired: 2500,
      type: 'gift_card',
      value: 25,
    },
  ];

  return rewards.map(reward => ({
    ...reward,
    canRedeem: user.loyaltyPoints >= reward.pointsRequired,
  }));
};

// Helper functions
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function sendReferralEmail(email: string, referralCode: string, context: any): Promise<void> {
  // TODO: Implement email sending logic
  console.log(`Sending referral email to ${email} with code ${referralCode}`);
} 