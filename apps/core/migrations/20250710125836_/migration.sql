/*
  Warnings:

  - You are about to drop the column `reason` on the `LoyaltyPoints` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `LoyaltyPoints` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Referral` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Referral` table. All the data in the column will be lost.
  - You are about to drop the column `refereeEmail` on the `Referral` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referralCode]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastUpdated` to the `LoyaltyPoints` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LoyaltyPoints` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `LoyaltyPoints` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralCode` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referredEmail` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referredName` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Referral` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LoyaltyPoints" DROP CONSTRAINT "LoyaltyPoints_memberId_fkey";

-- DropIndex
DROP INDEX "Referral_code_key";

-- AlterTable
ALTER TABLE "LoyaltyPoints" DROP COLUMN "reason",
DROP COLUMN "type",
ADD COLUMN     "complianceData" JSONB,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'BRONZE',
ADD COLUMN     "totalEarned" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalExpired" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalRedeemed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "points" SET DEFAULT 0,
ALTER COLUMN "memberId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Referral" DROP COLUMN "code",
DROP COLUMN "completedAt",
DROP COLUMN "refereeEmail",
ADD COLUMN     "complianceData" JSONB,
ADD COLUMN     "referralCode" TEXT NOT NULL,
ADD COLUMN     "referredEmail" TEXT NOT NULL,
ADD COLUMN     "referredName" TEXT NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "wineProfileId" TEXT;

-- CreateTable
CREATE TABLE "LoyaltyTransaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "orderId" TEXT,
    "complianceData" JSONB,
    "loyaltyPointsId" TEXT,

    CONSTRAINT "LoyaltyTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralReward" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "rewardType" TEXT NOT NULL,
    "pointsUsed" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "complianceData" JSONB,

    CONSTRAINT "ReferralReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "consentVersion" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "complianceData" JSONB,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingRate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "carrier" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "features" TEXT[],
    "logo" TEXT,
    "origin" JSONB NOT NULL,
    "destination" JSONB NOT NULL,
    "packages" JSONB NOT NULL,
    "complianceData" JSONB,

    CONSTRAINT "ShippingRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingInfo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "events" JSONB NOT NULL DEFAULT '[]',
    "estimatedDelivery" TIMESTAMP(3),
    "complianceData" JSONB NOT NULL DEFAULT '{}',
    "shipmentId" TEXT,

    CONSTRAINT "TrackingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingInfo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "events" JSONB NOT NULL DEFAULT '[]',
    "estimatedDelivery" TIMESTAMP(3),
    "complianceData" JSONB NOT NULL DEFAULT '{}',
    "stripeSubscriptionId" TEXT,

    CONSTRAINT "ShippingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WineRecommendation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "grapeVarieties" TEXT[],
    "vintage" INTEGER,
    "price" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION,
    "description" TEXT,
    "sommelierNotes" TEXT,
    "pairingSuggestions" TEXT[],
    "confidence" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WineRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WinePairing" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dish" TEXT NOT NULL,
    "cuisine" TEXT NOT NULL,
    "recommendedWines" JSONB NOT NULL,
    "sommelierNotes" TEXT,
    "alternativePairings" TEXT[],
    "servingTemperature" TEXT,
    "decanting" TEXT,
    "complianceData" JSONB,

    CONSTRAINT "WinePairing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WineProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "preferences" JSONB NOT NULL,
    "ratings" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "complianceData" JSONB,

    CONSTRAINT "WineProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackingInfo_trackingNumber_key" ON "TrackingInfo"("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingInfo_shipmentId_key" ON "TrackingInfo"("shipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingInfo_trackingNumber_key" ON "ShippingInfo"("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referralCode_key" ON "Referral"("referralCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_wineProfileId_fkey" FOREIGN KEY ("wineProfileId") REFERENCES "WineProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyPoints" ADD CONSTRAINT "LoyaltyPoints_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyTransaction" ADD CONSTRAINT "LoyaltyTransaction_loyaltyPointsId_fkey" FOREIGN KEY ("loyaltyPointsId") REFERENCES "LoyaltyPoints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingInfo" ADD CONSTRAINT "TrackingInfo_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingInfo" ADD CONSTRAINT "ShippingInfo_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "WineSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WineRecommendation" ADD CONSTRAINT "WineRecommendation_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
