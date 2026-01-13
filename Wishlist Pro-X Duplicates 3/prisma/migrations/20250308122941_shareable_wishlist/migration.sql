-- CreateTable
CREATE TABLE "ShareableWishlistData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shareableWishlistId" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "withlistItems" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ShareableWishlistData_shareableWishlistId_key" ON "ShareableWishlistData"("shareableWishlistId");
