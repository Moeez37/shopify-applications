/*
  Warnings:

  - You are about to drop the column `add_count` on the `WishlistData` table. All the data in the column will be lost.
  - You are about to drop the column `remove_count` on the `WishlistData` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT,
    "productId" TEXT NOT NULL,
    "add_wl_count" INTEGER DEFAULT 0,
    "remove_wl_count" INTEGER DEFAULT 0,
    "add_to_cart" INTEGER DEFAULT 0,
    "remove_from_cart" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WishlistData" ("add_to_cart", "createdAt", "id", "productId", "remove_from_cart", "shop", "updatedAt") SELECT "add_to_cart", "createdAt", "id", "productId", "remove_from_cart", "shop", "updatedAt" FROM "WishlistData";
DROP TABLE "WishlistData";
ALTER TABLE "new_WishlistData" RENAME TO "WishlistData";
CREATE UNIQUE INDEX "WishlistData_productId_key" ON "WishlistData"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
