import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type MockUserData = {
  email: string;
  username: string;
  createdAt: Date;
  isAdmin: boolean;
  credits: number;
  loyaltyPoints: number;
  subscriptionStatus: string | null;
  lemonSqueezyCustomerPortalUrl: string | null;
  paymentProcessorUserId: string | null;
  datePaid: Date | null;
  subscriptionPlan: string | null;
};

const mockUsers: MockUserData[] = [
  {
    email: 'admin@wineclubpro.com',
    username: 'admin',
    createdAt: new Date(),
    isAdmin: false,
    credits: 10,
    loyaltyPoints: 100,
    subscriptionStatus: null,
    lemonSqueezyCustomerPortalUrl: null,
    paymentProcessorUserId: null,
    datePaid: null,
    subscriptionPlan: null,
  },
  {
    email: 'user@wineclubpro.com',
    username: 'user',
    createdAt: new Date(),
    isAdmin: false,
    credits: 3,
    loyaltyPoints: 50,
    subscriptionStatus: null,
    lemonSqueezyCustomerPortalUrl: null,
    paymentProcessorUserId: null,
    datePaid: null,
    subscriptionPlan: null,
  },
];

export const seedMockUsers = async () => {
  // TODO: Integrate with logging/monitoring if needed
  for (const userData of mockUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: userData.email,
          username: userData.username,
          createdAt: userData.createdAt,
          isAdmin: userData.isAdmin,
          credits: userData.credits,
          loyaltyPoints: userData.loyaltyPoints,
          subscriptionStatus: userData.subscriptionStatus,
          lemonSqueezyCustomerPortalUrl: userData.lemonSqueezyCustomerPortalUrl,
          paymentProcessorUserId: userData.paymentProcessorUserId,
          datePaid: userData.datePaid,
          subscriptionPlan: userData.subscriptionPlan,
        }
      })
      // TODO: Log user creation if needed
    } else {
      // TODO: Log user already exists if needed
    }
  }
  // TODO: Log seeding completion if needed
}