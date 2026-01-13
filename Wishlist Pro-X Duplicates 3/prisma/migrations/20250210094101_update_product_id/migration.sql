/*
  Warnings:

  - Made the column `productId` on table `WishlistData` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT,
    "productId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WishlistData" ("count", "createdAt", "id", "productId", "shop", "updatedAt") SELECT "count", "createdAt", "id", "productId", "shop", "updatedAt" FROM "WishlistData";
DROP TABLE "WishlistData";
ALTER TABLE "new_WishlistData" RENAME TO "WishlistData";
CREATE UNIQUE INDEX "WishlistData_productId_key" ON "WishlistData"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
