-- Drop UNIQUE constraints (in PostgreSQL these are constraints, not standalone indexes)
ALTER TABLE "_AttributeDefinitionToBeverageCategory" DROP CONSTRAINT IF EXISTS "_AttributeDefinitionToBeverageCategory_AB_unique";
ALTER TABLE "_AttributeDefinitionToBeverageType" DROP CONSTRAINT IF EXISTS "_AttributeDefinitionToBeverageType_AB_unique";

-- AlterTable: rename primary key to match Prisma's expected name
ALTER TABLE "_AttributeDefinitionToBeverageCategory" RENAME CONSTRAINT "_AttributeDefinitionToBeverageCategory_pkey" TO "_AttributeDefinitionToBeverageCategory_AB_pkey";
ALTER TABLE "_AttributeDefinitionToBeverageType" RENAME CONSTRAINT "_AttributeDefinitionToBeverageType_pkey" TO "_AttributeDefinitionToBeverageType_AB_pkey";
