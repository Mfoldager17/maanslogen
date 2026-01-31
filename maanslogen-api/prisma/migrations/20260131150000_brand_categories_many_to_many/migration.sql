-- Many-to-many: Brand has allowed categories (BeverageCategory).
-- Prisma implicit join table: _BrandToBeverageCategory (A = Brand, B = BeverageCategory).

CREATE TABLE "_BrandToBeverageCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BrandToBeverageCategory_AB_unique" UNIQUE ("A", "B")
);

-- Optional: populate from existing beverages (brands get categories they already have products in)
INSERT INTO "_BrandToBeverageCategory" ("A", "B")
SELECT DISTINCT b."brandId", bt."categoryId"
FROM "Beverage" b
JOIN "BeverageType" bt ON bt.id = b."beverageTypeId"
WHERE b."brandId" IS NOT NULL AND bt."categoryId" IS NOT NULL
ON CONFLICT ("A", "B") DO NOTHING;

ALTER TABLE "_BrandToBeverageCategory" ADD CONSTRAINT "_BrandToBeverageCategory_pkey" PRIMARY KEY ("A", "B");

CREATE INDEX "_BrandToBeverageCategory_B_index" ON "_BrandToBeverageCategory"("B");

ALTER TABLE "_BrandToBeverageCategory" ADD CONSTRAINT "_BrandToBeverageCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_BrandToBeverageCategory" ADD CONSTRAINT "_BrandToBeverageCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "BeverageCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
