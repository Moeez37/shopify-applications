/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `WishlistData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WishlistData_productId_key" ON "WishlistData"("productId");
