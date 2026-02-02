-- CreateIndex
CREATE INDEX "Campaign_sentAt_idx" ON "Campaign"("sentAt");

-- CreateIndex
CREATE INDEX "Campaign_caveId_status_idx" ON "Campaign"("caveId", "status");

-- CreateIndex
CREATE INDEX "Campaign_caveId_status_sentAt_idx" ON "Campaign"("caveId", "status", "sentAt");

-- CreateIndex
CREATE INDEX "CampaignMessage_campaignId_status_idx" ON "CampaignMessage"("campaignId", "status");

-- CreateIndex
CREATE INDEX "CampaignMessage_memberId_createdAt_idx" ON "CampaignMessage"("memberId", "createdAt");

-- CreateIndex
CREATE INDEX "Subscription_caveId_status_idx" ON "Subscription"("caveId", "status");

-- CreateIndex
CREATE INDEX "Subscription_caveId_status_nextBillingDate_idx" ON "Subscription"("caveId", "status", "nextBillingDate");

-- CreateIndex
CREATE INDEX "Subscription_memberId_status_idx" ON "Subscription"("memberId", "status");

-- CreateIndex
CREATE INDEX "WineBox_createdAt_idx" ON "WineBox"("createdAt");

-- CreateIndex
CREATE INDEX "WineBox_subscriptionId_status_idx" ON "WineBox"("subscriptionId", "status");
