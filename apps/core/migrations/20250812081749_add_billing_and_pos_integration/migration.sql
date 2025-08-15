-- AlterTable
ALTER TABLE "Wine" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "posExternalId" TEXT,
ADD COLUMN     "posProvider" TEXT;

-- CreateTable
CREATE TABLE "BillingAccount" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "billingPortalUrl" TEXT,
    "trialEndsAt" TIMESTAMP(3),
    "isVerifiedAge" BOOLEAN NOT NULL DEFAULT false,
    "stripeIdentitySessionId" TEXT,

    CONSTRAINT "BillingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "billingAccountId" TEXT NOT NULL,
    "stripeSubId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GMVEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billingAccountId" TEXT NOT NULL,
    "externalRef" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GMVEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GMVMonthly" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billingAccountId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "feeCents" INTEGER NOT NULL,
    "stripeInvoiceId" TEXT,

    CONSTRAINT "GMVMonthly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POSConnection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wineCaveId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "POSConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WineInventory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wineId" TEXT NOT NULL,
    "posConnectionId" TEXT NOT NULL,
    "posVariationId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WineInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PilotAgreement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wineCaveId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "signedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "freeTrialDays" INTEGER NOT NULL DEFAULT 60,
    "testimonialAgreement" BOOLEAN NOT NULL DEFAULT false,
    "posAuthAgreement" BOOLEAN NOT NULL DEFAULT false,
    "screenRecordingConsent" BOOLEAN NOT NULL DEFAULT false,
    "setupCompletedAt" TIMESTAMP(3),
    "firstOrderAt" TIMESTAMP(3),
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalGMV" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PilotAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingAccount_stripeCustomerId_key" ON "BillingAccount"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubId_key" ON "Subscription"("stripeSubId");

-- CreateIndex
CREATE UNIQUE INDEX "GMVMonthly_billingAccountId_month_key" ON "GMVMonthly"("billingAccountId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "POSConnection_wineCaveId_provider_key" ON "POSConnection"("wineCaveId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "WineInventory_wineId_posVariationId_key" ON "WineInventory"("wineId", "posVariationId");

-- CreateIndex
CREATE UNIQUE INDEX "PilotAgreement_wineCaveId_key" ON "PilotAgreement"("wineCaveId");

-- AddForeignKey
ALTER TABLE "BillingAccount" ADD CONSTRAINT "BillingAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_billingAccountId_fkey" FOREIGN KEY ("billingAccountId") REFERENCES "BillingAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GMVEvent" ADD CONSTRAINT "GMVEvent_billingAccountId_fkey" FOREIGN KEY ("billingAccountId") REFERENCES "BillingAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GMVMonthly" ADD CONSTRAINT "GMVMonthly_billingAccountId_fkey" FOREIGN KEY ("billingAccountId") REFERENCES "BillingAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POSConnection" ADD CONSTRAINT "POSConnection_wineCaveId_fkey" FOREIGN KEY ("wineCaveId") REFERENCES "WineCave"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WineInventory" ADD CONSTRAINT "WineInventory_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WineInventory" ADD CONSTRAINT "WineInventory_posConnectionId_fkey" FOREIGN KEY ("posConnectionId") REFERENCES "POSConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilotAgreement" ADD CONSTRAINT "PilotAgreement_wineCaveId_fkey" FOREIGN KEY ("wineCaveId") REFERENCES "WineCave"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
