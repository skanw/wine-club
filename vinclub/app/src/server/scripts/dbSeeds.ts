import { type User } from 'wasp/entities';
import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@prisma/client';
import { getSubscriptionPaymentPlanIds, SubscriptionStatus } from '../../payment/plans';
import { UserRole } from '@prisma/client';
import { sanitizeAndSerializeProviderData } from 'wasp/server/auth';
import { EvinTemplateType } from '@prisma/client';

type MockUserData = Omit<User, 'id'>;

/**
 * This function, which we've imported in `app.db.seeds` in the `main.wasp` file,
 * seeds the database with mock users via the `wasp db seed` command.
 * For more info see: https://wasp.sh/docs/data-model/backends#seeding-the-database
 */
export async function seedMockUsers(prismaClient: PrismaClient) {
  // Create a test Cave for VinClub - check if already exists
  // We need this first so we can associate the admin user with it
  let testCave = await prismaClient.cave.findFirst({
    where: { email: 'contact@cave-example.fr' },
  });

  if (!testCave) {
    testCave = await prismaClient.cave.create({
      data: {
        name: 'Cave Example',
        address: '123 Rue de la Paix, Paris',
        phone: '+33123456789',
        email: 'contact@cave-example.fr',
      },
    });
    console.log('✅ Created test Cave');
  } else {
    console.log('ℹ️  Test Cave already exists');
  }

  // Create admin user for demos - check if already exists
  const existingAdmin = await prismaClient.user.findUnique({
    where: { email: 'admin@test.com' },
    include: { auth: true },
  });

  if (!existingAdmin) {
    const adminUser = await prismaClient.user.create({
      data: {
        email: 'admin@test.com',
        username: 'admin',
        isAdmin: true,
        role: UserRole.OWNER,
        credits: 0,
        caveId: testCave.id, // Associate admin with test cave
        auth: {
          create: {
            identities: {
              create: {
                providerName: 'email',
                providerUserId: 'admin@test.com',
                providerData: await sanitizeAndSerializeProviderData<'email'>({
                  hashedPassword: 'admin123', // Password: admin123
                  isEmailVerified: true, // Skip email verification for demo
                  emailVerificationSentAt: null,
                  passwordResetSentAt: null,
                }),
              },
            },
          },
        },
      },
    });

    console.log('✅ Created admin user for demos');
    console.log(`   Email: admin@test.com`);
    console.log(`   Password: admin123`);
    console.log(`   User ID: ${adminUser.id}`);
    console.log(`   Cave ID: ${testCave.id}`);
  } else {
    console.log('ℹ️  Admin user already exists (admin@test.com)');
    // If admin exists but doesn't have a cave, associate them with one
    if (!existingAdmin.caveId) {
      await prismaClient.user.update({
        where: { email: 'admin@test.com' },
        data: { caveId: testCave.id },
      });
      console.log(`   Associated admin user with Cave ID: ${testCave.id}`);
    }
  }

  // Create users with different roles for the test Cave - check if already exist
  let ownerUser = await prismaClient.user.findUnique({
    where: { email: 'pierre@cave-example.fr' },
  });

  if (!ownerUser) {
    ownerUser = await prismaClient.user.create({
      data: {
        email: 'pierre@cave-example.fr',
        username: 'pierre',
        role: UserRole.OWNER,
        caveId: testCave.id,
        isAdmin: false,
        credits: 0,
      },
    });
  }

  let managerUser = await prismaClient.user.findUnique({
    where: { email: 'manager@cave-example.fr' },
  });

  if (!managerUser) {
    managerUser = await prismaClient.user.create({
      data: {
        email: 'manager@cave-example.fr',
        username: 'manager',
        role: UserRole.MANAGER,
        caveId: testCave.id,
        isAdmin: false,
        credits: 0,
      },
    });
  }

  let helperUser = await prismaClient.user.findUnique({
    where: { email: 'batiste@cave-example.fr' },
  });

  if (!helperUser) {
    helperUser = await prismaClient.user.create({
      data: {
        email: 'batiste@cave-example.fr',
        username: 'batiste',
        role: UserRole.HELPER,
        caveId: testCave.id,
        isAdmin: false,
        credits: 0,
      },
    });
  }

  // Create some test members for the Cave - check if already exist
  const memberEmails = ['jean@example.com', 'marie@example.com', 'paul@example.com'];
  const existingMembers = await prismaClient.member.findMany({
    where: {
      caveId: testCave.id,
      email: { in: memberEmails },
    },
  });

  const existingMemberEmails = new Set(existingMembers.map((m) => m.email));

  const membersToCreate = [
    {
      caveId: testCave.id,
      name: 'Jean Dupont',
      email: 'jean@example.com',
      phone: '+33612345678',
      preferredRegion: 'Bordeaux',
      tags: ['red-wine', 'premium'],
      consentEmail: true,
      consentSms: true,
      consentGdprLoggedAt: new Date(),
    },
    {
      caveId: testCave.id,
      name: 'Marie Martin',
      email: 'marie@example.com',
      phone: '+33687654321',
      preferredRegion: 'Burgundy',
      tags: ['white-wine'],
      consentEmail: true,
      consentSms: true,
      consentGdprLoggedAt: new Date(),
    },
    {
      caveId: testCave.id,
      name: 'Paul Durand',
      email: 'paul@example.com',
      phone: '+33611111111',
      preferredRegion: 'Champagne',
      tags: ['sparkling', 'premium'],
      consentEmail: true,
      consentSms: false,
      consentGdprLoggedAt: new Date(),
    },
  ].filter((m) => !existingMemberEmails.has(m.email));

  const newMembers = await Promise.all(
    membersToCreate.map((data) => prismaClient.member.create({ data }))
  );
  const testMembers = [...existingMembers, ...newMembers];

  // Create a test subscription plan - check if already exists
  let discoveryPlan = await prismaClient.subscriptionPlan.findFirst({
    where: {
      caveId: testCave.id,
      name: 'Discovery Box',
    },
  });

  if (!discoveryPlan) {
    discoveryPlan = await prismaClient.subscriptionPlan.create({
      data: {
        caveId: testCave.id,
        name: 'Discovery Box',
        description: 'Monthly selection of 3 wines',
        amount: 29.0,
        currency: 'EUR',
        billingCycle: 'monthly',
        wineCount: 3,
        isActive: true,
      },
    });
  }

  console.log('✅ Seeded test Cave with users and members');
  console.log(`   Cave ID: ${testCave.id}`);
  console.log(`   Owner: ${ownerUser.email}`);
  console.log(`   Manager: ${managerUser.email}`);
  console.log(`   Helper: ${helperUser.email}`);
  console.log(`   Members: ${testMembers.length}`);
  console.log(`   Plan: ${discoveryPlan.name}`);

  // Also create some mock users without Cave for backward compatibility
  // Skip if we already have many users to avoid duplicates
  const existingUserCount = await prismaClient.user.count();
  if (existingUserCount < 20) {
    const mockUsersData = generateMockUsersData(10);
    // Filter out emails that already exist
    const existingMockUserEmails = await prismaClient.user.findMany({
      where: {
        email: { in: mockUsersData.map((u) => u.email!) },
      },
      select: { email: true },
    });
    const existingEmailsSet = new Set(existingMockUserEmails.map((u) => u.email));
    const newMockUsersData = mockUsersData.filter((u) => !existingEmailsSet.has(u.email));
    
    if (newMockUsersData.length > 0) {
      await Promise.all(
        newMockUsersData.map((data) => prismaClient.user.create({ data }))
      );
      console.log(`✅ Created ${newMockUsersData.length} mock users`);
    }
  }
}

function generateMockUsersData(numOfUsers: number): MockUserData[] {
  return faker.helpers.multiple(generateMockUserData, { count: numOfUsers });
}

function generateMockUserData(): MockUserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const subscriptionStatus = faker.helpers.arrayElement<SubscriptionStatus | null>([
    ...Object.values(SubscriptionStatus),
    null,
  ]);
  const now = new Date();
  const createdAt = faker.date.past({ refDate: now });
  const timePaid = faker.date.between({ from: createdAt, to: now });
  const credits = subscriptionStatus ? 0 : faker.number.int({ min: 0, max: 10 });
  const hasUserPaidOnStripe = !!subscriptionStatus || credits > 3;
  return {
    email: faker.internet.email({ firstName, lastName }),
    username: faker.internet.userName({ firstName, lastName }),
    createdAt,
    isAdmin: false,
    credits,
    subscriptionStatus,
    lemonSqueezyCustomerPortalUrl: null,
    paymentProcessorUserId: hasUserPaidOnStripe ? `cus_test_${faker.string.uuid()}` : null,
    datePaid: hasUserPaidOnStripe ? faker.date.between({ from: createdAt, to: timePaid }) : null,
    subscriptionPlan: subscriptionStatus ? faker.helpers.arrayElement(getSubscriptionPaymentPlanIds()) : null,
    role: UserRole.HELPER,
    caveId: null,
  };
}

/**
 * Seed default Loi Evin templates (platform-wide, admin-managed).
 * Run via wasp db seed when seedEvinTemplates is in db.seeds.
 */
export async function seedEvinTemplates(prismaClient: PrismaClient) {
  const defaults = [
    {
      slug: 'arrivage',
      name: 'Annonce Arrivage',
      type: EvinTemplateType.arrivage,
      body: '[Nom du vin] - [Appellation] [Millésime]. Disponible en quantité limitée. Caractéristiques: [notes de dégustation]. [Prix]€.',
    },
    {
      slug: 'vente_flash',
      name: 'Vente Flash',
      type: EvinTemplateType.flash,
      body: '[Cave] - [Nom du vin]. Stock limité: [quantité] bouteilles. Informations produit disponibles sur demande.',
    },
    {
      slug: 'box_mensuelle',
      name: 'Box Mensuelle',
      type: EvinTemplateType.box,
      body: 'Votre sélection [mois] est prête. [Nombre] références de [région(s)]. Retrait en cave ou livraison disponible.',
    },
  ];

  for (const t of defaults) {
    await prismaClient.evinTemplate.upsert({
      where: { slug: t.slug },
      create: { ...t, isActive: true },
      update: { name: t.name, body: t.body, type: t.type },
    });
  }
  console.log('✅ Seeded Loi Evin templates:', defaults.map((d) => d.slug).join(', '));
}
