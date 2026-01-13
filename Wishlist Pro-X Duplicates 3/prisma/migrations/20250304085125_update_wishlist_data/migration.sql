/*
  Warnings:

  - You are about to drop the column `count` on the `WishlistData` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT,
    "productId" TEXT NOT NULL,
    "add_count" INTEGER NOT NULL DEFAULT 1,
    "remove_count" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WishlistData" ("createdAt", "id", "productId", "shop", "updatedAt") SELECT "createdAt", "id", "productId", "shop", "updatedAt" FROM "WishlistData";
DROP TABLE "WishlistData";
ALTER TABLE "new_WishlistData" RENAME TO "WishlistData";
CREATE UNIQUE INDEX "WishlistData_productId_key" ON "WishlistData"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
