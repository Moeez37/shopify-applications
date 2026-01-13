/*
  Warnings:

  - You are about to drop the `wishlistData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "wishlistData";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "WishlistData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT,
    "productId" TEXT,
    "count" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
