-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "customFields" JSONB NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "payload" JSONB,
    "errorMsg" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageQueueItem" (
    "id" TEXT NOT NULL,
    "caveId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "errorMsg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "MessageQueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncEvent" (
    "id" TEXT NOT NULL,
    "caveId" TEXT NOT NULL,
    "userId" TEXT,
    "operation" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dataSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3),

    CONSTRAINT "SyncEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebhookLog_provider_createdAt_idx" ON "WebhookLog"("provider", "createdAt");

-- CreateIndex
CREATE INDEX "WebhookLog_status_idx" ON "WebhookLog"("status");

-- CreateIndex
CREATE INDEX "WebhookLog_createdAt_idx" ON "WebhookLog"("createdAt");

-- CreateIndex
CREATE INDEX "MessageQueueItem_caveId_idx" ON "MessageQueueItem"("caveId");

-- CreateIndex
CREATE INDEX "MessageQueueItem_status_idx" ON "MessageQueueItem"("status");

-- CreateIndex
CREATE INDEX "MessageQueueItem_createdAt_idx" ON "MessageQueueItem"("createdAt");

-- CreateIndex
CREATE INDEX "MessageQueueItem_caveId_status_idx" ON "MessageQueueItem"("caveId", "status");

-- CreateIndex
CREATE INDEX "SyncEvent_caveId_status_idx" ON "SyncEvent"("caveId", "status");

-- CreateIndex
CREATE INDEX "SyncEvent_status_idx" ON "SyncEvent"("status");

-- CreateIndex
CREATE INDEX "SyncEvent_createdAt_idx" ON "SyncEvent"("createdAt");
