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
  console.log('Seeding database...');

  // Users
  const user1 = await prisma.user.create({
    data: {
      username: 'alice',
      email: 'alice@test.com',
      passwordHash: 'hashedpassword1',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'bob',
      email: 'bob@test.com',
      passwordHash: 'hashedpassword2',
    },
  });

  // Categories
  const beerCategory = await prisma.beverageCategory.create({
    data: {
      name: 'Øl',
      description: 'Alle typer øl',
      images: {
        create: [{ url: '🍺', type: 'ICON' }],
      },
    },
  });

  const wineCategory = await prisma.beverageCategory.create({
    data: {
      name: 'Vin',
      description: 'Rød, hvid og rosé',
      images: {
        create: [{ url: '🍷', type: 'ICON' }],
      },
    },
  });

  // Types
  const lagerType = await prisma.beverageType.create({
    data: {
      name: 'Lager',
      categoryId: beerCategory.id,
      description: 'Let og forfriskende',
    },
  });

  const ipaType = await prisma.beverageType.create({
    data: {
      name: 'IPA',
      categoryId: beerCategory.id,
      description: 'Humlet og bitter',
    },
  });

  const redWineType = await prisma.beverageType.create({
    data: {
      name: 'Rødvin',
      categoryId: wineCategory.id,
      description: 'Fyldig og frugtrig',
    },
  });

  // Attributes
  const abvAttribute = await prisma.attributeDefinition.create({
    data: {
      attributeKey: 'abv',
      displayName: 'Alkohol %',
      dataType: 'number',
      filterable: true,
      required: true,
      categories: { connect: { id: beerCategory.id } },
    },
  });

  const bitternessAttribute = await prisma.attributeDefinition.create({
    data: {
      attributeKey: 'ibu',
      displayName: 'Bitterhed (IBU)',
      dataType: 'number',
      filterable: true,
      categories: { connect: { id: beerCategory.id } },
      types: { connect: { id: ipaType.id } },
    },
  });

  // Questions
  const aromaQuestion = await prisma.question.create({
    data: {
      categoryId: beerCategory.id,
      typeId: null,
      questionText: 'Hvordan er aromaen?',
      answerType: 'text',
    },
  });

  const tasteQuestion = await prisma.question.create({
    data: {
      categoryId: beerCategory.id,
      typeId: ipaType.id,
      questionText: 'Hvor bitter smager den?',
      answerType: 'number',
    },
  });

  // Brands (tilladte kategorier: øl-mærker → Øl)
  const brandCarlsberg = await prisma.brand.create({
    data: { name: 'Carlsberg', description: 'Dansk bryggeri', categories: { connect: { id: beerCategory.id } } },
  });
  const brandMikkeller = await prisma.brand.create({
    data: { name: 'Mikkeller', description: 'Dansk mikrobryggeri', categories: { connect: { id: beerCategory.id } } },
  });

  // Beverages
  const beer1 = await prisma.beverage.create({
    data: {
      beverageTypeId: lagerType.id,
      brandId: brandCarlsberg.id,
      name: 'Classic Lager',
      country: 'DK',
      metadata: { notes: 'Lys og let' },
    },
  });

  const beer2 = await prisma.beverage.create({
    data: {
      beverageTypeId: ipaType.id,
      brandId: brandMikkeller.id,
      name: 'IPA Dark',
      country: 'DK',
      metadata: { notes: 'Humlet smag' },
    },
  });

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
