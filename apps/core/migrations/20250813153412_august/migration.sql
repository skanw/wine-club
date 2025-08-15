/*
  Warnings:

  - You are about to drop the column `metadata` on the `Wine` table. All the data in the column will be lost.
  - You are about to drop the column `posExternalId` on the `Wine` table. All the data in the column will be lost.
  - You are about to drop the column `posProvider` on the `Wine` table. All the data in the column will be lost.
  - You are about to drop the `BillingAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GMVEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GMVMonthly` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `POSConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PilotAgreement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WineInventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillingAccount" DROP CONSTRAINT "BillingAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "GMVEvent" DROP CONSTRAINT "GMVEvent_billingAccountId_fkey";

-- DropForeignKey
ALTER TABLE "GMVMonthly" DROP CONSTRAINT "GMVMonthly_billingAccountId_fkey";

-- DropForeignKey
ALTER TABLE "POSConnection" DROP CONSTRAINT "POSConnection_wineCaveId_fkey";

-- DropForeignKey
ALTER TABLE "PilotAgreement" DROP CONSTRAINT "PilotAgreement_wineCaveId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_billingAccountId_fkey";

-- DropForeignKey
ALTER TABLE "WineInventory" DROP CONSTRAINT "WineInventory_posConnectionId_fkey";

-- DropForeignKey
ALTER TABLE "WineInventory" DROP CONSTRAINT "WineInventory_wineId_fkey";

-- AlterTable
ALTER TABLE "Wine" DROP COLUMN "metadata",
DROP COLUMN "posExternalId",
DROP COLUMN "posProvider";

-- DropTable
DROP TABLE "BillingAccount";

-- DropTable
DROP TABLE "GMVEvent";

-- DropTable
DROP TABLE "GMVMonthly";

-- DropTable
DROP TABLE "POSConnection";

-- DropTable
DROP TABLE "PilotAgreement";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "WineInventory";
