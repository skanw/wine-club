-- AlterTable
ALTER TABLE "CampaignMessage" ADD COLUMN "externalId" TEXT;

-- CreateIndex
CREATE INDEX "CampaignMessage_externalId_idx" ON "CampaignMessage"("externalId");
