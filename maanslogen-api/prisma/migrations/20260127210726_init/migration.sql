-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profilePicture" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeverageCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,

    CONSTRAINT "BeverageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeverageType" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BeverageType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beverage" (
    "id" TEXT NOT NULL,
    "beverageTypeId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "metadata" JSONB,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Beverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeverageAttributeValue" (
    "id" TEXT NOT NULL,
    "beverageId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "valueString" TEXT,
    "valueNumber" DOUBLE PRECISION,
    "valueBoolean" BOOLEAN,

    CONSTRAINT "BeverageAttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeDefinition" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "typeId" TEXT,
    "attributeKey" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "filterable" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "validationRules" JSONB,
    "options" JSONB,
    "sortOrder" INTEGER,

    CONSTRAINT "AttributeDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "typeId" TEXT,
    "questionText" TEXT NOT NULL,
    "answerType" TEXT NOT NULL,
    "options" JSONB,
    "sortOrder" INTEGER,
    "required" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "beverageId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewAnswer" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "ReviewAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "BeverageType_categoryId_idx" ON "BeverageType"("categoryId");

-- CreateIndex
CREATE INDEX "Beverage_beverageTypeId_idx" ON "Beverage"("beverageTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Beverage_brand_name_key" ON "Beverage"("brand", "name");

-- CreateIndex
CREATE INDEX "BeverageAttributeValue_beverageId_idx" ON "BeverageAttributeValue"("beverageId");

-- CreateIndex
CREATE INDEX "BeverageAttributeValue_attributeId_idx" ON "BeverageAttributeValue"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "BeverageAttributeValue_beverageId_attributeId_key" ON "BeverageAttributeValue"("beverageId", "attributeId");

-- CreateIndex
CREATE INDEX "AttributeDefinition_categoryId_idx" ON "AttributeDefinition"("categoryId");

-- CreateIndex
CREATE INDEX "AttributeDefinition_typeId_idx" ON "AttributeDefinition"("typeId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeDefinition_categoryId_typeId_attributeKey_key" ON "AttributeDefinition"("categoryId", "typeId", "attributeKey");

-- CreateIndex
CREATE INDEX "Question_categoryId_idx" ON "Question"("categoryId");

-- CreateIndex
CREATE INDEX "Question_typeId_idx" ON "Question"("typeId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_beverageId_idx" ON "Review"("beverageId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_beverageId_key" ON "Review"("userId", "beverageId");

-- CreateIndex
CREATE INDEX "ReviewAnswer_reviewId_idx" ON "ReviewAnswer"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewAnswer_questionId_idx" ON "ReviewAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewAnswer_reviewId_questionId_key" ON "ReviewAnswer"("reviewId", "questionId");

-- AddForeignKey
ALTER TABLE "BeverageType" ADD CONSTRAINT "BeverageType_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BeverageCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beverage" ADD CONSTRAINT "Beverage_beverageTypeId_fkey" FOREIGN KEY ("beverageTypeId") REFERENCES "BeverageType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeverageAttributeValue" ADD CONSTRAINT "BeverageAttributeValue_beverageId_fkey" FOREIGN KEY ("beverageId") REFERENCES "Beverage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeverageAttributeValue" ADD CONSTRAINT "BeverageAttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "AttributeDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeDefinition" ADD CONSTRAINT "AttributeDefinition_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BeverageCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeDefinition" ADD CONSTRAINT "AttributeDefinition_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "BeverageType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BeverageCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "BeverageType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_beverageId_fkey" FOREIGN KEY ("beverageId") REFERENCES "Beverage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAnswer" ADD CONSTRAINT "ReviewAnswer_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAnswer" ADD CONSTRAINT "ReviewAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
