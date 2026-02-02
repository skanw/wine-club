-- AlterTable
ALTER TABLE "Cave" ADD COLUMN     "logoUrl" TEXT;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "caveId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vintage" INTEGER,
    "region" TEXT,
    "appellation" TEXT,
    "wineType" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "imageUrl" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_caveId_idx" ON "Product"("caveId");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_region_idx" ON "Product"("region");

-- CreateIndex
CREATE UNIQUE INDEX "Product_caveId_name_vintage_key" ON "Product"("caveId", "name", "vintage");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_caveId_fkey" FOREIGN KEY ("caveId") REFERENCES "Cave"("id") ON DELETE CASCADE ON UPDATE CASCADE;
