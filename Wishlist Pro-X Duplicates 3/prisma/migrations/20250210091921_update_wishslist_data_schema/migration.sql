/*
  Warnings:

  - You are about to alter the column `count` on the `WishlistData` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT,
    "productId" TEXT,
    "count" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WishlistData" ("count", "createdAt", "id", "productId", "shop", "updatedAt") SELECT coalesce("count", 1) AS "count", "createdAt", "id", "productId", "shop", "updatedAt" FROM "WishlistData";
DROP TABLE "WishlistData";
ALTER TABLE "new_WishlistData" RENAME TO "WishlistData";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
