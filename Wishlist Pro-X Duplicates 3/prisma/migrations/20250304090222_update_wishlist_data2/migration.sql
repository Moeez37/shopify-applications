-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT,
    "productId" TEXT NOT NULL,
    "add_count" INTEGER,
    "remove_count" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WishlistData" ("add_count", "createdAt", "id", "productId", "remove_count", "shop", "updatedAt") SELECT "add_count", "createdAt", "id", "productId", "remove_count", "shop", "updatedAt" FROM "WishlistData";
DROP TABLE "WishlistData";
ALTER TABLE "new_WishlistData" RENAME TO "WishlistData";
CREATE UNIQUE INDEX "WishlistData_productId_key" ON "WishlistData"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
