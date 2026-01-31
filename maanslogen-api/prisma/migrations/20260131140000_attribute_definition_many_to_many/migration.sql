-- Many-to-many: AttributeDefinition can belong to multiple categories and types.
-- Prisma implicit join tables use columns "A" and "B" (alphabetical: A = AttributeDefinition, B = BeverageCategory / BeverageType).

-- Create join table AttributeDefinition <-> BeverageCategory
CREATE TABLE "_AttributeDefinitionToBeverageCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AttributeDefinitionToBeverageCategory_AB_unique" UNIQUE ("A", "B")
);

-- Create join table AttributeDefinition <-> BeverageType
CREATE TABLE "_AttributeDefinitionToBeverageType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AttributeDefinitionToBeverageType_AB_unique" UNIQUE ("A", "B")
);

-- Migrate existing data: copy (id, categoryId) and (id, typeId) into join tables
INSERT INTO "_AttributeDefinitionToBeverageCategory" ("A", "B")
SELECT "id", "categoryId" FROM "AttributeDefinition";

INSERT INTO "_AttributeDefinitionToBeverageType" ("A", "B")
SELECT "id", "typeId" FROM "AttributeDefinition" WHERE "typeId" IS NOT NULL;

-- Drop FKs and unique so we can drop columns
ALTER TABLE "AttributeDefinition" DROP CONSTRAINT IF EXISTS "AttributeDefinition_categoryId_fkey";
ALTER TABLE "AttributeDefinition" DROP CONSTRAINT IF EXISTS "AttributeDefinition_typeId_fkey";

DROP INDEX IF EXISTS "AttributeDefinition_categoryId_typeId_attributeKey_key";
DROP INDEX IF EXISTS "AttributeDefinition_categoryId_idx";
DROP INDEX IF EXISTS "AttributeDefinition_typeId_idx";

ALTER TABLE "AttributeDefinition" DROP COLUMN "categoryId";
ALTER TABLE "AttributeDefinition" DROP COLUMN "typeId";

-- Unique attributeKey (fails if duplicates exist; merge those manually first)
CREATE UNIQUE INDEX "AttributeDefinition_attributeKey_key" ON "AttributeDefinition"("attributeKey");

-- PK and FK for join tables
ALTER TABLE "_AttributeDefinitionToBeverageCategory" ADD CONSTRAINT "_AttributeDefinitionToBeverageCategory_pkey" PRIMARY KEY ("A", "B");
ALTER TABLE "_AttributeDefinitionToBeverageType" ADD CONSTRAINT "_AttributeDefinitionToBeverageType_pkey" PRIMARY KEY ("A", "B");

CREATE INDEX "_AttributeDefinitionToBeverageCategory_B_index" ON "_AttributeDefinitionToBeverageCategory"("B");
CREATE INDEX "_AttributeDefinitionToBeverageType_B_index" ON "_AttributeDefinitionToBeverageType"("B");

ALTER TABLE "_AttributeDefinitionToBeverageCategory" ADD CONSTRAINT "_AttributeDefinitionToBeverageCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "AttributeDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_AttributeDefinitionToBeverageCategory" ADD CONSTRAINT "_AttributeDefinitionToBeverageCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "BeverageCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_AttributeDefinitionToBeverageType" ADD CONSTRAINT "_AttributeDefinitionToBeverageType_A_fkey" FOREIGN KEY ("A") REFERENCES "AttributeDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_AttributeDefinitionToBeverageType" ADD CONSTRAINT "_AttributeDefinitionToBeverageType_B_fkey" FOREIGN KEY ("B") REFERENCES "BeverageType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
