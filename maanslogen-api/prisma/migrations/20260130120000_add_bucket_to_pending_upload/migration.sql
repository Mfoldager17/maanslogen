-- AlterTable
ALTER TABLE "PendingUpload" ADD COLUMN "bucket" TEXT NOT NULL DEFAULT 'maanslogen-test';

-- DropIndex
DROP INDEX "PendingUpload_key_key";

-- CreateIndex
CREATE UNIQUE INDEX "PendingUpload_bucket_key_key" ON "PendingUpload"("bucket", "key");
