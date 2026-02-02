-- CreateEnum
CREATE TYPE "EvinTemplateType" AS ENUM ('arrivage', 'flash', 'box');

-- CreateTable
CREATE TABLE "EvinTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "EvinTemplateType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvinTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvinTemplate_slug_key" ON "EvinTemplate"("slug");

-- CreateIndex
CREATE INDEX "EvinTemplate_isActive_idx" ON "EvinTemplate"("isActive");

-- CreateIndex
CREATE INDEX "EvinTemplate_type_idx" ON "EvinTemplate"("type");
