-- CreateEnum
CREATE TYPE "ArrangementType" AS ENUM ('TASTING');

-- CreateTable
CREATE TABLE "Arrangement" (
    "id" TEXT NOT NULL,
    "type" "ArrangementType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arrangement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArrangementBeverage" (
    "id" TEXT NOT NULL,
    "arrangementId" TEXT NOT NULL,
    "beverageId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ArrangementBeverage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Arrangement_createdById_idx" ON "Arrangement"("createdById");

-- CreateIndex
CREATE INDEX "Arrangement_type_idx" ON "Arrangement"("type");

-- CreateIndex
CREATE UNIQUE INDEX "ArrangementBeverage_arrangementId_beverageId_key" ON "ArrangementBeverage"("arrangementId", "beverageId");

-- CreateIndex
CREATE INDEX "ArrangementBeverage_arrangementId_idx" ON "ArrangementBeverage"("arrangementId");

-- CreateIndex
CREATE INDEX "ArrangementBeverage_beverageId_idx" ON "ArrangementBeverage"("beverageId");

-- AddForeignKey
ALTER TABLE "Arrangement" ADD CONSTRAINT "Arrangement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrangementBeverage" ADD CONSTRAINT "ArrangementBeverage_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "Arrangement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrangementBeverage" ADD CONSTRAINT "ArrangementBeverage_beverageId_fkey" FOREIGN KEY ("beverageId") REFERENCES "Beverage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
