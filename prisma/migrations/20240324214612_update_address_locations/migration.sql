/*
  Warnings:

  - A unique constraint covering the columns `[addressId]` on the table `CompanyLocation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CompanyLocation_addressId_key" ON "CompanyLocation"("addressId");
