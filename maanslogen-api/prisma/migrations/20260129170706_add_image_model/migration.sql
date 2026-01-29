-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('THUMBNAIL', 'LARGE', 'PROFILE', 'ICON');

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "ImageType" NOT NULL,
    "userId" TEXT,
    "beverageId" TEXT,
    "categoryId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- DropColumn
ALTER TABLE "User" DROP COLUMN "profilePicture";

-- DropColumn
ALTER TABLE "BeverageCategory" DROP COLUMN "icon";

-- DropColumn
ALTER TABLE "Beverage" DROP COLUMN "imageUrl";

-- CreateIndex
CREATE INDEX "Image_userId_idx" ON "Image"("userId");

-- CreateIndex
CREATE INDEX "Image_beverageId_idx" ON "Image"("beverageId");

-- CreateIndex
CREATE INDEX "Image_categoryId_idx" ON "Image"("categoryId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_beverageId_fkey" FOREIGN KEY ("beverageId") REFERENCES "Beverage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BeverageCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
