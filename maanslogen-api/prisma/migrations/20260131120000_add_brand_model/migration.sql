-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- Step 1: Add brandId as nullable
ALTER TABLE "Beverage" ADD COLUMN "brandId" TEXT;

-- Step 2: Create one Brand per distinct "brand" value in Beverage
INSERT INTO "Brand" ("id", "name", "description", "active", "createdAt")
SELECT gen_random_uuid(), "brand", NULL, true, CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "brand" FROM "Beverage") AS distinct_brands;

-- Step 3: Set brandId on each Beverage from the matching Brand
UPDATE "Beverage" b
SET "brandId" = (SELECT "id" FROM "Brand" br WHERE br.name = b.brand LIMIT 1);

-- Step 4: Drop old unique constraint on (brand, name)
DROP INDEX IF EXISTS "Beverage_brand_name_key";

-- Step 5: Make brandId required
ALTER TABLE "Beverage" ALTER COLUMN "brandId" SET NOT NULL;

-- Step 6: Remove old brand column
ALTER TABLE "Beverage" DROP COLUMN "brand";

-- CreateIndex
CREATE UNIQUE INDEX "Beverage_brandId_name_key" ON "Beverage"("brandId", "name");

-- CreateIndex
CREATE INDEX "Beverage_brandId_idx" ON "Beverage"("brandId");

-- AddForeignKey
ALTER TABLE "Beverage" ADD CONSTRAINT "Beverage_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
