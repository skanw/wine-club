import { HttpError } from 'wasp/server';
import { z } from 'zod';

// GDPR compliance types
interface DataSubjectRequest {
  userId: string;
  requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction';
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: Date;
  completedAt?: Date;
}

interface ConsentRecord {
  userId: string;
  consentType: 'analytics' | 'marketing' | 'necessary' | 'preferences';
  granted: boolean;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  consentVersion: string;
  source: 'banner' | 'settings' | 'registration';
}

// Validation schemas
const dataSubjectRequestSchema = z.object({
  userId: z.string(),
  requestType: z.enum(['access', 'rectification', 'erasure', 'portability', 'restriction']),
  description: z.string(),
});

const consentRecordSchema = z.object({
  userId: z.string(),
  consentType: z.enum(['analytics', 'marketing', 'necessary', 'preferences']),
  granted: z.boolean(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  consentVersion: z.string(),
  source: z.enum(['banner', 'settings', 'registration']),
});

/**
 * Submit a data subject request (GDPR Article 15-22)
 */
export const submitDataSubjectRequest = async (args: z.infer<typeof dataSubjectRequestSchema>, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Verify user can only submit requests for themselves
    if (args.userId !== context.user.id && !context.user.isAdmin) {
      throw new HttpError(403, 'Not authorized to submit requests for other users');
    }

    const request = await context.entities.DataSubjectRequest.create({
      data: {
        userId: args.userId,
        requestType: args.requestType,
        description: args.description,
        status: 'pending',
      },
    });

    // Log the request for compliance
    await context.entities.Logs.create({
      data: {
        message: `Data subject request submitted: ${args.requestType} by user ${args.userId}`,
        level: 'INFO',
      },
    });

    return request;
  } catch (error) {
    console.error('Error submitting data subject request:', error);
    throw new HttpError(500, 'Failed to submit data subject request');
  }
};

/**
 * Get user's personal data (GDPR Article 15 - Right of Access)
 */
export const getUserPersonalData = async (args: { userId: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Verify user can only access their own data
    if (args.userId !== context.user.id && !context.user.isAdmin) {
      throw new HttpError(403, 'Not authorized to access other users\' data');
    }

    // Collect all user data
    const userData = await context.entities.User.findUnique({
      where: { id: args.userId },
      include: {
        wineSubscriptions: {
          include: {
            wineCave: true,
            subscriptionTier: true,
          },
        },
        wineRatings: {
          include: {
            wine: true,
          },
        },
        consentRecords: true,
        loyaltyPointsHistory: true,
        referralsSent: true,
        referralsReceived: true,
        preferences: true,
        wineProfile: true,
      },
    });

    if (!userData) {
      throw new HttpError(404, 'User not found');
    }

    // Format data for export
    const exportData = {
      personalInformation: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        createdAt: userData.createdAt,
        isAdmin: userData.isAdmin,
      },
      subscriptions: userData.wineSubscriptions.map((sub: any) => ({
        id: sub.id,
        status: sub.status,
        startDate: sub.startDate,
        wineCave: sub.wineCave.name,
        tier: sub.subscriptionTier.name,
      })),
      wineRatings: userData.wineRatings.map((rating: any) => ({
        wineName: rating.wine.name,
        rating: rating.rating,
        review: rating.review,
        date: rating.createdAt,
      })),
      consentHistory: userData.consentRecords.map((consent: any) => ({
        type: consent.consentType,
        granted: consent.granted,
        timestamp: consent.timestamp,
        source: consent.source,
      })),
      loyaltyData: {
        currentPoints: userData.loyaltyPoints,
        history: userData.loyaltyPointsHistory.map((record: any) => ({
          points: record.points,
          date: record.createdAt,
        })),
      },
      preferences: userData.preferences,
      wineProfile: userData.wineProfile,
    };

    return exportData;
  } catch (error) {
    console.error('Error getting user personal data:', error);
    throw new HttpError(500, 'Failed to get user personal data');
  }
};

/**
 * Delete user data (GDPR Article 17 - Right to Erasure)
 */
export const deleteUserData = async (args: { userId: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Verify user can only delete their own data
    if (args.userId !== context.user.id && !context.user.isAdmin) {
      throw new HttpError(403, 'Not authorized to delete other users\' data');
    }

    // Start transaction to delete all user data
    const result = await context.entities.$transaction(async (tx: any) => {
      // Delete user's wine ratings
      await tx.wineRating.deleteMany({
        where: { memberId: args.userId },
      });

      // Delete user's consent records
      await tx.consentRecord.deleteMany({
        where: { userId: args.userId },
      });

      // Delete user's loyalty points
      await tx.loyaltyPoints.deleteMany({
        where: { memberId: args.userId },
      });

      // Delete user's referrals
      await tx.referral.deleteMany({
        where: {
          OR: [
            { referrerId: args.userId },
            { refereeId: args.userId },
          ],
        },
      });

      // Delete user's wine profile
      await tx.wineProfile.deleteMany({
        where: { userId: args.userId },
      });

      // Delete user's preferences
      await tx.memberPreferences.deleteMany({
        where: { userId: args.userId },
      });

      // Cancel active subscriptions
      await tx.wineSubscription.updateMany({
        where: { memberId: args.userId, status: 'active' },
        data: { status: 'cancelled' },
      });

      // Anonymize user data instead of complete deletion
      const anonymizedUser = await tx.user.update({
        where: { id: args.userId },
        data: {
          email: `deleted-${Date.now()}@deleted.com`,
          username: `deleted-${Date.now()}`,
          isAdmin: false,
        },
      });

      return anonymizedUser;
    });

    // Log the deletion for compliance
    await context.entities.Logs.create({
      data: {
        message: `User data deletion completed for user ${args.userId}`,
        level: 'INFO',
      },
    });

    return { success: true, message: 'User data has been deleted' };
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw new HttpError(500, 'Failed to delete user data');
  }
};

/**
 * Record user consent (GDPR Article 7 - Consent)
 */
export const recordUserConsent = async (args: z.infer<typeof consentRecordSchema>, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const consent = await context.entities.ConsentRecord.create({
      data: {
        userId: args.userId,
        consentType: args.consentType,
        granted: args.granted,
        ipAddress: args.ipAddress,
        userAgent: args.userAgent,
        consentVersion: args.consentVersion,
        source: args.source,
      },
    });

    // Update user's consent status
    await context.entities.User.update({
      where: { id: args.userId },
      data: {
        // Update consent fields based on type
        ...(args.consentType === 'analytics' && { analyticsConsent: args.granted }),
        ...(args.consentType === 'marketing' && { marketingConsent: args.granted }),
      },
    });

    return consent;
  } catch (error) {
    console.error('Error recording user consent:', error);
    throw new HttpError(500, 'Failed to record user consent');
  }
};

/**
 * Get user's consent status
 */
export const getUserConsentStatus = async (args: { userId: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Verify user can only access their own consent data
    if (args.userId !== context.user.id && !context.user.isAdmin) {
      throw new HttpError(403, 'Not authorized to access other users\' consent data');
    }

    const consentRecords = await context.entities.ConsentRecord.findMany({
      where: { userId: args.userId },
      orderBy: { timestamp: 'desc' },
    });

    // Group by consent type and get the latest for each
    const consentStatus = consentRecords.reduce((acc: any, record: any) => {
      if (!acc[record.consentType] || record.timestamp > acc[record.consentType].timestamp) {
        acc[record.consentType] = {
          granted: record.granted,
          timestamp: record.timestamp,
          source: record.source,
          version: record.consentVersion,
        };
      }
      return acc;
    }, {});

    return consentStatus;
  } catch (error) {
    console.error('Error getting user consent status:', error);
    throw new HttpError(500, 'Failed to get user consent status');
  }
};

/**
 * Get data subject requests for admin review
 */
export const getDataSubjectRequests = async (args: { status?: string }, context: any): Promise<any[]> => {
  if (!context.user?.isAdmin) {
    throw new HttpError(403, 'Admin access required');
  }

  try {
    const whereClause: any = {};
    if (args.status) {
      whereClause.status = args.status;
    }

    return await context.entities.DataSubjectRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error getting data subject requests:', error);
    throw new HttpError(500, 'Failed to get data subject requests');
  }
};

/**
 * Update data subject request status
 */
export const updateDataSubjectRequest = async (args: {
  requestId: string;
  status: 'processing' | 'completed' | 'rejected';
  notes?: string;
}, context: any): Promise<any> => {
  if (!context.user?.isAdmin) {
    throw new HttpError(403, 'Admin access required');
  }

  try {
    const updateData: any = {
      status: args.status,
    };

    if (args.status === 'completed') {
      updateData.completedAt = new Date();
    }

    const request = await context.entities.DataSubjectRequest.update({
      where: { id: args.requestId },
      data: updateData,
    });

    // Log the status update
    await context.entities.Logs.create({
      data: {
        message: `Data subject request ${args.requestId} status updated to ${args.status}`,
        level: 'INFO',
      },
    });

    return request;
  } catch (error) {
    console.error('Error updating data subject request:', error);
    throw new HttpError(500, 'Failed to update data subject request');
  }
}; 