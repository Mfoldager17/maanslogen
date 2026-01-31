/*
  Warnings:

  - You are about to drop the `_BrandToBeverageCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BrandToBeverageCategory" DROP CONSTRAINT "_BrandToBeverageCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BrandToBeverageCategory" DROP CONSTRAINT "_BrandToBeverageCategory_B_fkey";

-- DropTable
DROP TABLE "_BrandToBeverageCategory";

-- CreateTable
CREATE TABLE "_BeverageCategoryToBrand" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BeverageCategoryToBrand_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BeverageCategoryToBrand_B_index" ON "_BeverageCategoryToBrand"("B");

-- AddForeignKey
ALTER TABLE "_BeverageCategoryToBrand" ADD CONSTRAINT "_BeverageCategoryToBrand_A_fkey" FOREIGN KEY ("A") REFERENCES "BeverageCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeverageCategoryToBrand" ADD CONSTRAINT "_BeverageCategoryToBrand_B_fkey" FOREIGN KEY ("B") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
