// src/prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
async function main() {
  console.log('Cleaning up database...');

  // ---------- Cleanup ----------
  await prisma.reviewAnswer.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.beverageAttributeValue.deleteMany({});
  await prisma.beverage.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.attributeDefinition.deleteMany({});
  await prisma.beverageType.deleteMany({});
  await prisma.beverageCategory.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding database...');

  // ---------- Users ----------
  const user1 = await prisma.user.create({
    data: { username: 'alice', email: 'alice@test.com', passwordHash: 'hashedpassword1' },
  });

  const user2 = await prisma.user.create({
    data: { username: 'bob', email: 'bob@test.com', passwordHash: 'hashedpassword2' },
  });

  const user3 = await prisma.user.create({
    data: { username: 'charlie', email: 'charlie@test.com', passwordHash: 'hashedpassword3' },
  });

  // ---------- Categories ----------
  const beerCategory = await prisma.beverageCategory.create({
    data: { name: 'Øl', description: 'Alle typer øl', icon: '🍺' },
  });

  const wineCategory = await prisma.beverageCategory.create({
    data: { name: 'Vin', description: 'Rød, hvid og rosé', icon: '🍷' },
  });

  // ---------- Types ----------
  const lagerType = await prisma.beverageType.create({ data: { name: 'Lager', categoryId: beerCategory.id, description: 'Let og forfriskende' } });
  const ipaType = await prisma.beverageType.create({ data: { name: 'IPA', categoryId: beerCategory.id, description: 'Humlet og bitter' } });
  const stoutType = await prisma.beverageType.create({ data: { name: 'Stout', categoryId: beerCategory.id, description: 'Mørk og fyldig' } });
  const redWineType = await prisma.beverageType.create({ data: { name: 'Rødvin', categoryId: wineCategory.id, description: 'Fyldig og frugtrig' } });
  const whiteWineType = await prisma.beverageType.create({ data: { name: 'Hvidvin', categoryId: wineCategory.id, description: 'Let og frisk' } });

  // ---------- Attribute Definitions ----------
  const abvAttribute = await prisma.attributeDefinition.create({
    data: { categoryId: beerCategory.id, typeId: null, attributeKey: 'abv', displayName: 'Alkohol %', dataType: 'number', filterable: true, required: true, sortOrder: 1 },
  });

  const ibuAttribute = await prisma.attributeDefinition.create({
    data: { categoryId: beerCategory.id, typeId: ipaType.id, attributeKey: 'ibu', displayName: 'Bitterhed (IBU)', dataType: 'number', filterable: true, sortOrder: 2 },
  });

  const colorAttribute = await prisma.attributeDefinition.create({
    data: { categoryId: beerCategory.id, typeId: null, attributeKey: 'color', displayName: 'Farve', dataType: 'string', filterable: true, sortOrder: 3 },
  });

  const sweetnessAttribute = await prisma.attributeDefinition.create({
    data: { categoryId: wineCategory.id, typeId: null, attributeKey: 'sweetness', displayName: 'Sødme', dataType: 'number', filterable: true, sortOrder: 1 },
  });

  // ---------- Beverages ----------
  const beer1 = await prisma.beverage.create({ data: { beverageTypeId: lagerType.id, brand: 'Carlsberg', name: 'Classic Lager', country: 'DK', metadata: { notes: 'Lys og let' } } });
  const beer2 = await prisma.beverage.create({ data: { beverageTypeId: ipaType.id, brand: 'Mikkeller', name: 'IPA Dark', country: 'DK', metadata: { notes: 'Humlet smag' } } });
  const beer3 = await prisma.beverage.create({ data: { beverageTypeId: stoutType.id, brand: 'Guinness', name: 'Original Stout', country: 'IE', metadata: { notes: 'Fyldig og mørk' } } });
  const wine1 = await prisma.beverage.create({ data: { beverageTypeId: redWineType.id, brand: 'Vega', name: 'Red Classic', country: 'ES' } });
  const wine2 = await prisma.beverage.create({ data: { beverageTypeId: whiteWineType.id, brand: 'Chardonnay', name: 'White Fresh', country: 'FR' } });

  // ---------- Beverage Attribute Values ----------
  await prisma.beverageAttributeValue.createMany({
    data: [
      { beverageId: beer1.id, attributeId: abvAttribute.id, valueNumber: 5.0 },
      { beverageId: beer1.id, attributeId: colorAttribute.id, valueString: 'Lys' },
      { beverageId: beer2.id, attributeId: abvAttribute.id, valueNumber: 6.5 },
      { beverageId: beer2.id, attributeId: ibuAttribute.id, valueNumber: 60 },
      { beverageId: beer2.id, attributeId: colorAttribute.id, valueString: 'Mørk' },
      { beverageId: beer3.id, attributeId: abvAttribute.id, valueNumber: 7.0 },
      { beverageId: beer3.id, attributeId: colorAttribute.id, valueString: 'Sort' },
      { beverageId: wine1.id, attributeId: sweetnessAttribute.id, valueNumber: 3 },
      { beverageId: wine2.id, attributeId: sweetnessAttribute.id, valueNumber: 2 },
    ],
  });

  // ---------- Questions ----------
  const aromaQuestion = await prisma.question.create({ data: { categoryId: beerCategory.id, typeId: null, questionText: 'Hvordan er aromaen?', answerType: 'text', sortOrder: 1 } });
  const bitternessQuestion = await prisma.question.create({ data: { categoryId: beerCategory.id, typeId: ipaType.id, questionText: 'Hvor bitter smager den?', answerType: 'number', sortOrder: 2 } });
  const colorQuestion = await prisma.question.create({ data: { categoryId: beerCategory.id, typeId: null, questionText: 'Hvordan ser den ud?', answerType: 'text', sortOrder: 3 } });

  // ---------- Reviews ----------
  const review1 = await prisma.$transaction(async (tx) => {
    // Find current review stats
    const bev = await tx.beverage.findUnique({ where: { id: beer1.id }, select: { reviewCount: true, averageRating: true } });
    const prevReviewCount = bev?.reviewCount ?? 0;
    const prevAverage = bev?.averageRating ?? 0;
    const newRating = 4.2;
    const newCount = prevReviewCount + 1;
    const newAverage = ((prevAverage * prevReviewCount) + newRating) / newCount;

    await tx.beverage.update({
      where: { id: beer1.id },
      data: { 
        reviewCount: { increment: 1 },
        averageRating: newAverage
      },
    });
    return tx.review.create({
      data: { userId: user1.id, beverageId: beer1.id, rating: newRating, title: 'Frisk og god', description: 'Let og forfriskende' },
    });
  });

  const review2 = await prisma.$transaction(async (tx) => {
    const bev = await tx.beverage.findUnique({ where: { id: beer2.id }, select: { reviewCount: true, averageRating: true } });
    const prevReviewCount = bev?.reviewCount ?? 0;
    const prevAverage = bev?.averageRating ?? 0;
    const newRating = 4.8;
    const newCount = prevReviewCount + 1;
    const newAverage = ((prevAverage * prevReviewCount) + newRating) / newCount;

    await tx.beverage.update({
      where: { id: beer2.id },
      data: { 
        reviewCount: { increment: 1 },
        averageRating: newAverage
      },
    });
    return tx.review.create({
      data: { userId: user2.id, beverageId: beer2.id, rating: newRating, title: 'Humlet og bitter', description: 'IPA som den skal smage' },
    });
  });

  const review3 = await prisma.$transaction(async (tx) => {
    const bev = await tx.beverage.findUnique({ where: { id: wine1.id }, select: { reviewCount: true, averageRating: true } });
    const prevReviewCount = bev?.reviewCount ?? 0;
    const prevAverage = bev?.averageRating ?? 0;
    const newRating = 3.5;
    const newCount = prevReviewCount + 1;
    const newAverage = ((prevAverage * prevReviewCount) + newRating) / newCount;

    await tx.beverage.update({
      where: { id: wine1.id },
      data: { 
        reviewCount: { increment: 1 },
        averageRating: newAverage
      },
    });
    return tx.review.create({
      data: { userId: user3.id, beverageId: wine1.id, rating: newRating, title: 'Rød og frugtig', description: 'God til aftensmad' },
    });
  });

  // ---------- Review Answers ----------
  await prisma.reviewAnswer.createMany({
    data: [
      { reviewId: review1.id, questionId: aromaQuestion.id, answer: 'Let malt aroma' },
      { reviewId: review1.id, questionId: colorQuestion.id, answer: 'Lys gul' },
      { reviewId: review2.id, questionId: aromaQuestion.id, answer: 'Humlet aroma' },
      { reviewId: review2.id, questionId: bitternessQuestion.id, answer: '60 IBU' },
      { reviewId: review3.id, questionId: colorQuestion.id, answer: 'Rød' },
    ],
  });

  console.log('✅ Seed complete with extended data and cleanup!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
