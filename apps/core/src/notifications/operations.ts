import { HttpError } from 'wasp/server';
import { z } from 'zod';

// Notification types
interface NotificationData {
  id: string;
  userId: string;
  type: 'subscription' | 'shipping' | 'wine' | 'loyalty' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// Validation schemas
const createNotificationSchema = z.object({
  userId: z.string(),
  type: z.enum(['subscription', 'shipping', 'wine', 'loyalty', 'system']),
  title: z.string(),
  message: z.string(),
  data: z.any().optional(),
  expiresAt: z.date().optional(),
});

const markAsReadSchema = z.object({
  notificationId: z.string(),
});

const getNotificationsSchema = z.object({
  userId: z.string(),
  type: z.enum(['subscription', 'shipping', 'wine', 'loyalty', 'system']).optional(),
  isRead: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
});

/**
 * Create a new notification
 */
export const createNotification = async (args: z.infer<typeof createNotificationSchema>, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const notification = await context.entities.Notification.create({
      data: {
        userId: args.userId,
        type: args.type,
        title: args.title,
        message: args.message,
        data: args.data || {},
        isRead: false,
        expiresAt: args.expiresAt,
      },
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new HttpError(500, 'Failed to create notification');
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (args: z.infer<typeof markAsReadSchema>, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const notification = await context.entities.Notification.findFirst({
      where: {
        id: args.notificationId,
        userId: context.user.id,
      },
    });

    if (!notification) {
      throw new HttpError(404, 'Notification not found');
    }

    return await context.entities.Notification.update({
      where: { id: args.notificationId },
      data: { isRead: true },
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new HttpError(500, 'Failed to mark notification as read');
  }
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (args: z.infer<typeof getNotificationsSchema>, context: any): Promise<any[]> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const whereClause: any = {
      userId: args.userId,
    };

    if (args.type) {
      whereClause.type = args.type;
    }

    if (args.isRead !== undefined) {
      whereClause.isRead = args.isRead;
    }

    return await context.entities.Notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: args.limit,
    });
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw new HttpError(500, 'Failed to get notifications');
  }
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = async (args: { userId: string }, context: any): Promise<number> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    return await context.entities.Notification.count({
      where: {
        userId: args.userId,
        isRead: false,
      },
    });
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    throw new HttpError(500, 'Failed to get unread notification count');
  }
};

/**
 * Delete expired notifications
 */
export const deleteExpiredNotifications = async (args: {}, context: any): Promise<number> => {
  if (!context.user?.isAdmin) {
    throw new HttpError(403, 'Admin access required');
  }

  try {
    const result = await context.entities.Notification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  } catch (error) {
    console.error('Error deleting expired notifications:', error);
    throw new HttpError(500, 'Failed to delete expired notifications');
  }
};

// Notification templates
export const NotificationTemplates = {
  subscription: {
    welcome: {
      title: 'Welcome to Wine Club!',
      message: 'Thank you for joining our exclusive wine subscription. Your first shipment will be prepared soon.',
    },
    renewal: {
      title: 'Subscription Renewal',
      message: 'Your subscription will renew automatically on {date}. No action required.',
    },
    cancelled: {
      title: 'Subscription Cancelled',
      message: 'Your subscription has been cancelled. You will continue to receive shipments until the end of your billing period.',
    },
    paymentFailed: {
      title: 'Payment Failed',
      message: 'We were unable to process your payment. Please update your payment method to continue your subscription.',
    },
  },
  shipping: {
    labelGenerated: {
      title: 'Shipping Label Generated',
      message: 'Your wine shipment is being prepared and will ship soon. Tracking number: {trackingNumber}',
    },
    shipped: {
      title: 'Wine Shipped!',
      message: 'Your wine has been shipped and is on its way. Track your delivery with: {trackingNumber}',
    },
    delivered: {
      title: 'Wine Delivered!',
      message: 'Your wine has been delivered. Enjoy your selection and don\'t forget to rate your wines!',
    },
    delayed: {
      title: 'Shipment Delayed',
      message: 'Your wine shipment has been delayed. New estimated delivery: {newDate}',
    },
  },
  wine: {
    newArrival: {
      title: 'New Wine Available',
      message: 'A new {varietal} from {region} is now available in your wine cave.',
    },
    lowStock: {
      title: 'Low Stock Alert',
      message: '{wineName} is running low on stock. Order soon to secure your bottles.',
    },
    ratingReminder: {
      title: 'Rate Your Wines',
      message: 'Don\'t forget to rate your recent wines to help us personalize your future selections.',
    },
  },
  loyalty: {
    pointsEarned: {
      title: 'Points Earned!',
      message: 'You earned {points} loyalty points for your recent purchase.',
    },
    rewardAvailable: {
      title: 'Reward Available',
      message: 'You have enough points to redeem {reward}. Visit your loyalty dashboard to claim it.',
    },
    tierUpgrade: {
      title: 'Tier Upgrade!',
      message: 'Congratulations! You\'ve been upgraded to {tier} status with exclusive benefits.',
    },
  },
  system: {
    maintenance: {
      title: 'Scheduled Maintenance',
      message: 'We\'ll be performing scheduled maintenance on {date} from {time}. Service may be temporarily unavailable.',
    },
    update: {
      title: 'New Features Available',
      message: 'We\'ve added new features to improve your wine experience. Check them out!',
    },
  },
};

/**
 * Send notification with template
 */
export const sendTemplateNotification = async (args: {
  userId: string;
  template: string;
  category: keyof typeof NotificationTemplates;
  data?: any;
}, context: any): Promise<any> => {
  const categoryTemplates = NotificationTemplates[args.category] as Record<string, { title: string; message: string }>;
  const template = categoryTemplates[args.template];
  
  if (!template) {
    throw new HttpError(400, 'Invalid notification template');
  }

  let title = template.title;
  let message = template.message;

  // Replace placeholders with actual data
  if (args.data) {
    Object.entries(args.data).forEach(([key, value]) => {
      title = title.replace(`{${key}}`, String(value));
      message = message.replace(`{${key}}`, String(value));
    });
  }

  return await createNotification({
    userId: args.userId,
    type: args.category as any,
    title,
    message,
    data: args.data,
  }, context);
};

/**
 * Send bulk notifications
 */
export const sendBulkNotifications = async (args: {
  userIds: string[];
  template: string;
  category: keyof typeof NotificationTemplates;
  data?: any;
}, context: any): Promise<any[]> => {
  const notifications: any[] = [];

  for (const userId of args.userIds) {
    try {
      const notification = await sendTemplateNotification({
        userId,
        template: args.template,
        category: args.category,
        data: args.data,
      }, context);
      notifications.push(notification);
    } catch (error) {
      console.error(`Error sending notification to user ${userId}:`, error);
    }
  }

  return notifications;
}; 