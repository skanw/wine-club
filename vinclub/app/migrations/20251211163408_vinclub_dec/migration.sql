/*
  Warnings:

  - A unique constraint covering the columns `[caveId,phone]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[caveId,email]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Member_caveId_phone_key" ON "Member"("caveId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "Member_caveId_email_key" ON "Member"("caveId", "email");
