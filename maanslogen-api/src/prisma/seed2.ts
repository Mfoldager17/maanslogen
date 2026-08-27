// src/prisma/seed2.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

async function main() {
  console.log('Cleaning up database...');

  await prisma.reviewAnswer.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.beverageAttributeValue.deleteMany({});
  await prisma.beverage.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.pendingUpload.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.attributeDefinition.deleteMany({});
  await prisma.beverageType.deleteMany({});
  await prisma.beverageCategory.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding database...');

  // ---------- Users ----------
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
  const user3 = await prisma.user.create({
    data: {
      username: 'charlie',
      email: 'charlie@test.com',
      passwordHash: 'hashedpassword3',
    },
  });
  const user4 = await prisma.user.create({
    data: {
      username: 'diana',
      email: 'diana@test.com',
      passwordHash: 'hashedpassword4',
    },
  });
  const user5 = await prisma.user.create({
    data: {
      username: 'erik',
      email: 'erik@test.com',
      passwordHash: 'hashedpassword5',
    },
  });

  // ---------- Categories ----------
  const beerCategory = await prisma.beverageCategory.create({
    data: {
      name: 'Øl',
      description: 'Alle typer øl',
      images: { create: [{ url: '🍺', type: 'ICON' }] },
    },
  });
  const wineCategory = await prisma.beverageCategory.create({
    data: {
      name: 'Vin',
      description: 'Rød, hvid og rosé',
      images: { create: [{ url: '🍷', type: 'ICON' }] },
    },
  });
  const rumCategory = await prisma.beverageCategory.create({
    data: {
      name: 'Rom',
      description: 'Karibisk og mørkt rom',
      images: { create: [{ url: '🥃', type: 'ICON' }] },
    },
  });
  const whiskeyCategory = await prisma.beverageCategory.create({
    data: {
      name: 'Whiskey',
      description: 'Skotsk, irsk og bourbon',
      images: { create: [{ url: '🥃', type: 'ICON' }] },
    },
  });
  const ginCategory = await prisma.beverageCategory.create({
    data: {
      name: 'Gin',
      description: 'London Dry og genever',
      images: { create: [{ url: '🍸', type: 'ICON' }] },
    },
  });
  const ciderCategory = await prisma.beverageCategory.create({
    data: {
      name: 'Cider',
      description: 'Æble- og pærecider',
      images: { create: [{ url: '🍎', type: 'ICON' }] },
    },
  });

  // ---------- Types ----------
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
  const stoutType = await prisma.beverageType.create({
    data: {
      name: 'Stout',
      categoryId: beerCategory.id,
      description: 'Mørk og fyldig',
    },
  });
  const pilsnerType = await prisma.beverageType.create({
    data: {
      name: 'Pilsner',
      categoryId: beerCategory.id,
      description: 'Klar og let',
    },
  });
  const wheatBeerType = await prisma.beverageType.create({
    data: {
      name: 'Hvedeøl',
      categoryId: beerCategory.id,
      description: 'Frugtig og let',
    },
  });

  const redWineType = await prisma.beverageType.create({
    data: {
      name: 'Rødvin',
      categoryId: wineCategory.id,
      description: 'Fyldig og frugtrig',
    },
  });
  const whiteWineType = await prisma.beverageType.create({
    data: {
      name: 'Hvidvin',
      categoryId: wineCategory.id,
      description: 'Let og frisk',
    },
  });
  const roseType = await prisma.beverageType.create({
    data: {
      name: 'Rosé',
      categoryId: wineCategory.id,
      description: 'Let og frugtig',
    },
  });
  const sparklingWineType = await prisma.beverageType.create({
    data: {
      name: 'Mousserende',
      categoryId: wineCategory.id,
      description: 'Bobler og fest',
    },
  });

  const whiteRumType = await prisma.beverageType.create({
    data: {
      name: 'Hvidt rom',
      categoryId: rumCategory.id,
      description: 'Let og renset',
    },
  });
  const darkRumType = await prisma.beverageType.create({
    data: {
      name: 'Mørkt rom',
      categoryId: rumCategory.id,
      description: 'Karamel og krydderier',
    },
  });
  const goldRumType = await prisma.beverageType.create({
    data: {
      name: 'Guld rom',
      categoryId: rumCategory.id,
      description: 'Mellemvej',
    },
  });

  const scotchType = await prisma.beverageType.create({
    data: {
      name: 'Skotsk whisky',
      categoryId: whiskeyCategory.id,
      description: 'Røget og malt',
    },
  });
  const bourbonType = await prisma.beverageType.create({
    data: {
      name: 'Bourbon',
      categoryId: whiskeyCategory.id,
      description: 'Sød og vanilje',
    },
  });
  const irishType = await prisma.beverageType.create({
    data: {
      name: 'Irsk whisky',
      categoryId: whiskeyCategory.id,
      description: 'Blød og rund',
    },
  });
  const ryeType = await prisma.beverageType.create({
    data: {
      name: 'Rug whisky',
      categoryId: whiskeyCategory.id,
      description: 'Krydret og skarp',
    },
  });

  const londonDryType = await prisma.beverageType.create({
    data: {
      name: 'London Dry',
      categoryId: ginCategory.id,
      description: 'Klar og enebær',
    },
  });
  const oldTomType = await prisma.beverageType.create({
    data: {
      name: 'Old Tom',
      categoryId: ginCategory.id,
      description: 'Lidt sødere',
    },
  });
  const geneverType = await prisma.beverageType.create({
    data: {
      name: 'Genever',
      categoryId: ginCategory.id,
      description: 'Maltet og rund',
    },
  });

  const appleCiderType = await prisma.beverageType.create({
    data: {
      name: 'Æblecider',
      categoryId: ciderCategory.id,
      description: 'Syrlig og frugtig',
    },
  });
  const pearCiderType = await prisma.beverageType.create({
    data: {
      name: 'Pærecider',
      categoryId: ciderCategory.id,
      description: 'Sødere og blød',
    },
  });

  // ---------- Brands ----------
  const brandCarlsberg = await prisma.brand.create({
    data: {
      name: 'Carlsberg',
      description: 'Dansk bryggeri',
      categories: { connect: [{ id: beerCategory.id }] },
    },
  });
  const brandMikkeller = await prisma.brand.create({
    data: {
      name: 'Mikkeller',
      description: 'Dansk mikrobryggeri',
      categories: { connect: [{ id: beerCategory.id }] },
    },
  });
  const brandGuinness = await prisma.brand.create({
    data: {
      name: 'Guinness',
      description: 'Irsk stout',
      categories: { connect: [{ id: beerCategory.id }] },
    },
  });
  const brandTuborg = await prisma.brand.create({
    data: {
      name: 'Tuborg',
      description: 'Dansk bryggeri',
      categories: { connect: [{ id: beerCategory.id }] },
    },
  });
  const brandWeihenstephaner = await prisma.brand.create({
    data: {
      name: 'Weihenstephaner',
      description: 'Tysk hvedeøl',
      categories: { connect: [{ id: beerCategory.id }] },
    },
  });

  const brandVega = await prisma.brand.create({
    data: {
      name: 'Vega',
      description: 'Spansk vin',
      categories: { connect: [{ id: wineCategory.id }] },
    },
  });
  const brandChardonnay = await prisma.brand.create({
    data: {
      name: 'Chardonnay',
      description: 'Vindruesort',
      categories: { connect: [{ id: wineCategory.id }] },
    },
  });
  const brandMoet = await prisma.brand.create({
    data: {
      name: 'Moët & Chandon',
      description: 'Champagne',
      categories: { connect: [{ id: wineCategory.id }] },
    },
  });
  const brandConcha = await prisma.brand.create({
    data: {
      name: 'Concha y Toro',
      description: 'Chilensk vin',
      categories: { connect: [{ id: wineCategory.id }] },
    },
  });

  const brandHavana = await prisma.brand.create({
    data: {
      name: 'Havana Club',
      description: 'Cubansk rom',
      categories: { connect: [{ id: rumCategory.id }] },
    },
  });
  const brandBacardi = await prisma.brand.create({
    data: {
      name: 'Bacardi',
      description: 'Puerto Ricansk rom',
      categories: { connect: [{ id: rumCategory.id }] },
    },
  });
  const brandCaptain = await prisma.brand.create({
    data: {
      name: 'Captain Morgan',
      description: 'Spiced rum',
      categories: { connect: [{ id: rumCategory.id }] },
    },
  });
  const brandPlantation = await prisma.brand.create({
    data: {
      name: 'Plantation',
      description: 'Premium rom',
      categories: { connect: [{ id: rumCategory.id }] },
    },
  });

  const brandGlenfiddich = await prisma.brand.create({
    data: {
      name: 'Glenfiddich',
      description: 'Skotsk single malt',
      categories: { connect: [{ id: whiskeyCategory.id }] },
    },
  });
  const brandJameson = await prisma.brand.create({
    data: {
      name: 'Jameson',
      description: 'Irsk whisky',
      categories: { connect: [{ id: whiskeyCategory.id }] },
    },
  });
  const brandJackDaniels = await prisma.brand.create({
    data: {
      name: "Jack Daniel's",
      description: 'Tennessee whiskey',
      categories: { connect: [{ id: whiskeyCategory.id }] },
    },
  });
  const brandMacallan = await prisma.brand.create({
    data: {
      name: 'The Macallan',
      description: 'Skotsk single malt',
      categories: { connect: [{ id: whiskeyCategory.id }] },
    },
  });
  const brandWildTurkey = await prisma.brand.create({
    data: {
      name: 'Wild Turkey',
      description: 'Bourbon',
      categories: { connect: [{ id: whiskeyCategory.id }] },
    },
  });

  const brandTanqueray = await prisma.brand.create({
    data: {
      name: 'Tanqueray',
      description: 'London Dry gin',
      categories: { connect: [{ id: ginCategory.id }] },
    },
  });
  const brandHendricks = await prisma.brand.create({
    data: {
      name: "Hendrick's",
      description: 'Skotsk gin med agurke',
      categories: { connect: [{ id: ginCategory.id }] },
    },
  });
  const brandBombay = await prisma.brand.create({
    data: {
      name: 'Bombay Sapphire',
      description: 'London Dry gin',
      categories: { connect: [{ id: ginCategory.id }] },
    },
  });
  const brandBeefeater = await prisma.brand.create({
    data: {
      name: 'Beefeater',
      description: 'London Dry gin',
      categories: { connect: [{ id: ginCategory.id }] },
    },
  });

  const brandRekorderlig = await prisma.brand.create({
    data: {
      name: 'Rekorderlig',
      description: 'Svensk cider',
      categories: { connect: [{ id: ciderCategory.id }] },
    },
  });
  const brandSommersby = await prisma.brand.create({
    data: {
      name: 'Sommersby',
      description: 'Dansk cider',
      categories: { connect: [{ id: ciderCategory.id }] },
    },
  });
  const brandThatchers = await prisma.brand.create({
    data: {
      name: "Thatcher's",
      description: 'Engelsk cider',
      categories: { connect: [{ id: ciderCategory.id }] },
    },
  });

  // ---------- Attribute Definitions ----------
  const abvAttribute = await prisma.attributeDefinition.create({
    data: {
      attributeKey: 'abv',
      displayName: 'Alkohol %',
      dataType: 'number',
      filterable: true,
      required: true,
      sortOrder: 1,
      categories: {
        connect: [
          { id: beerCategory.id },
          { id: wineCategory.id },
          { id: rumCategory.id },
          { id: whiskeyCategory.id },
          { id: ginCategory.id },
          { id: ciderCategory.id },
        ],
      },
    },
  });

  const ibuAttribute = await prisma.attributeDefinition.create({
    data: {
      attributeKey: 'ibu',
      displayName: 'Bitterhed (IBU)',
      dataType: 'number',
      filterable: true,
      sortOrder: 2,
      categories: { connect: [{ id: beerCategory.id }] },
      types: { connect: [{ id: ipaType.id }] },
    },
  });

  const colorAttribute = await prisma.attributeDefinition.create({
    data: {
      attributeKey: 'color',
      displayName: 'Farve',
      dataType: 'string',
      filterable: true,
      sortOrder: 3,
      categories: {
        connect: [{ id: beerCategory.id }, { id: wineCategory.id }],
      },
    },
  });

  const sweetnessAttribute = await prisma.attributeDefinition.create({
    data: {
      attributeKey: 'sweetness',
      displayName: 'Sødme',
      dataType: 'number',
      filterable: true,
      sortOrder: 1,
      categories: {
        connect: [{ id: wineCategory.id }, { id: ciderCategory.id }],
      },
    },
  });

  const ageYearsAttribute = await prisma.attributeDefinition.create({
    data: {
      attributeKey: 'age_years',
      displayName: 'Lagring (år)',
      dataType: 'number',
      filterable: true,
      sortOrder: 2,
      categories: {
        connect: [{ id: whiskeyCategory.id }, { id: rumCategory.id }],
      },
    },
  });

  const botanicalsAttribute = await prisma.attributeDefinition.create({
    data: {
      attributeKey: 'botanicals',
      displayName: 'Botanicals',
      dataType: 'string',
      filterable: false,
      sortOrder: 2,
      categories: { connect: [{ id: ginCategory.id }] },
    },
  });

  // ---------- Beverages ----------
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
  const beer3 = await prisma.beverage.create({
    data: {
      beverageTypeId: stoutType.id,
      brandId: brandGuinness.id,
      name: 'Original Stout',
      country: 'IE',
      metadata: { notes: 'Fyldig og mørk' },
    },
  });
  const beer4 = await prisma.beverage.create({
    data: {
      beverageTypeId: pilsnerType.id,
      brandId: brandTuborg.id,
      name: 'Grøn',
      country: 'DK',
    },
  });
  const beer5 = await prisma.beverage.create({
    data: {
      beverageTypeId: wheatBeerType.id,
      brandId: brandWeihenstephaner.id,
      name: 'Hefeweissbier',
      country: 'DE',
    },
  });
  const beer6 = await prisma.beverage.create({
    data: {
      beverageTypeId: lagerType.id,
      brandId: brandCarlsberg.id,
      name: 'Nordic',
      country: 'DK',
    },
  });
  const beer7 = await prisma.beverage.create({
    data: {
      beverageTypeId: ipaType.id,
      brandId: brandMikkeller.id,
      name: 'American Dream',
      country: 'DK',
    },
  });

  const wine1 = await prisma.beverage.create({
    data: {
      beverageTypeId: redWineType.id,
      brandId: brandVega.id,
      name: 'Red Classic',
      country: 'ES',
    },
  });
  const wine2 = await prisma.beverage.create({
    data: {
      beverageTypeId: whiteWineType.id,
      brandId: brandChardonnay.id,
      name: 'White Fresh',
      country: 'FR',
    },
  });
  const wine3 = await prisma.beverage.create({
    data: {
      beverageTypeId: roseType.id,
      brandId: brandVega.id,
      name: 'Rosé Frisk',
      country: 'ES',
    },
  });
  const wine4 = await prisma.beverage.create({
    data: {
      beverageTypeId: sparklingWineType.id,
      brandId: brandMoet.id,
      name: 'Impérial',
      country: 'FR',
    },
  });
  const wine5 = await prisma.beverage.create({
    data: {
      beverageTypeId: redWineType.id,
      brandId: brandConcha.id,
      name: 'Casillero del Diablo',
      country: 'CL',
    },
  });
  const wine6 = await prisma.beverage.create({
    data: {
      beverageTypeId: whiteWineType.id,
      brandId: brandConcha.id,
      name: 'Sauvignon Blanc',
      country: 'CL',
    },
  });

  const rum1 = await prisma.beverage.create({
    data: {
      beverageTypeId: whiteRumType.id,
      brandId: brandHavana.id,
      name: '3 Años',
      country: 'CU',
    },
  });
  const rum2 = await prisma.beverage.create({
    data: {
      beverageTypeId: darkRumType.id,
      brandId: brandHavana.id,
      name: 'Añejo 7 Años',
      country: 'CU',
    },
  });
  const rum3 = await prisma.beverage.create({
    data: {
      beverageTypeId: whiteRumType.id,
      brandId: brandBacardi.id,
      name: 'Carta Blanca',
      country: 'PR',
    },
  });
  const rum4 = await prisma.beverage.create({
    data: {
      beverageTypeId: goldRumType.id,
      brandId: brandCaptain.id,
      name: 'Original Spiced',
      country: 'JM',
    },
  });
  const rum5 = await prisma.beverage.create({
    data: {
      beverageTypeId: darkRumType.id,
      brandId: brandPlantation.id,
      name: 'Original Dark',
      country: 'BB',
    },
  });

  const whiskey1 = await prisma.beverage.create({
    data: {
      beverageTypeId: scotchType.id,
      brandId: brandGlenfiddich.id,
      name: '12 Year Old',
      country: 'GB',
    },
  });
  const whiskey2 = await prisma.beverage.create({
    data: {
      beverageTypeId: scotchType.id,
      brandId: brandMacallan.id,
      name: 'Double Cask 12',
      country: 'GB',
    },
  });
  const whiskey3 = await prisma.beverage.create({
    data: {
      beverageTypeId: irishType.id,
      brandId: brandJameson.id,
      name: 'Original',
      country: 'IE',
    },
  });
  const whiskey4 = await prisma.beverage.create({
    data: {
      beverageTypeId: bourbonType.id,
      brandId: brandJackDaniels.id,
      name: 'Old No. 7',
      country: 'US',
    },
  });
  const whiskey5 = await prisma.beverage.create({
    data: {
      beverageTypeId: bourbonType.id,
      brandId: brandWildTurkey.id,
      name: '101',
      country: 'US',
    },
  });
  const whiskey6 = await prisma.beverage.create({
    data: {
      beverageTypeId: ryeType.id,
      brandId: brandJackDaniels.id,
      name: 'Rye',
      country: 'US',
    },
  });

  const gin1 = await prisma.beverage.create({
    data: {
      beverageTypeId: londonDryType.id,
      brandId: brandTanqueray.id,
      name: 'London Dry',
      country: 'GB',
    },
  });
  const gin2 = await prisma.beverage.create({
    data: {
      beverageTypeId: londonDryType.id,
      brandId: brandBombay.id,
      name: 'Sapphire',
      country: 'GB',
    },
  });
  const gin3 = await prisma.beverage.create({
    data: {
      beverageTypeId: londonDryType.id,
      brandId: brandHendricks.id,
      name: 'Gin',
      country: 'GB',
    },
  });
  const gin4 = await prisma.beverage.create({
    data: {
      beverageTypeId: londonDryType.id,
      brandId: brandBeefeater.id,
      name: 'London Dry',
      country: 'GB',
    },
  });
  const gin5 = await prisma.beverage.create({
    data: {
      beverageTypeId: oldTomType.id,
      brandId: brandTanqueray.id,
      name: 'Old Tom',
      country: 'GB',
    },
  });

  const cider1 = await prisma.beverage.create({
    data: {
      beverageTypeId: appleCiderType.id,
      brandId: brandRekorderlig.id,
      name: 'Strawberry-Lime',
      country: 'SE',
    },
  });
  const cider2 = await prisma.beverage.create({
    data: {
      beverageTypeId: appleCiderType.id,
      brandId: brandSommersby.id,
      name: 'Æblecider',
      country: 'DK',
    },
  });
  const cider3 = await prisma.beverage.create({
    data: {
      beverageTypeId: pearCiderType.id,
      brandId: brandRekorderlig.id,
      name: 'Pærecider',
      country: 'SE',
    },
  });
  const cider4 = await prisma.beverage.create({
    data: {
      beverageTypeId: appleCiderType.id,
      brandId: brandThatchers.id,
      name: 'Gold',
      country: 'GB',
    },
  });

  // ---------- Beverage Attribute Values ----------
  const attrValues: Array<{
    beverageId: string;
    attributeId: string;
    valueNumber?: number;
    valueString?: string;
  }> = [
    { beverageId: beer1.id, attributeId: abvAttribute.id, valueNumber: 5.0 },
    {
      beverageId: beer1.id,
      attributeId: colorAttribute.id,
      valueString: 'Lys',
    },
    { beverageId: beer2.id, attributeId: abvAttribute.id, valueNumber: 6.5 },
    { beverageId: beer2.id, attributeId: ibuAttribute.id, valueNumber: 60 },
    {
      beverageId: beer2.id,
      attributeId: colorAttribute.id,
      valueString: 'Mørk',
    },
    { beverageId: beer3.id, attributeId: abvAttribute.id, valueNumber: 7.0 },
    {
      beverageId: beer3.id,
      attributeId: colorAttribute.id,
      valueString: 'Sort',
    },
    { beverageId: beer4.id, attributeId: abvAttribute.id, valueNumber: 4.6 },
    {
      beverageId: beer4.id,
      attributeId: colorAttribute.id,
      valueString: 'Lys',
    },
    { beverageId: beer5.id, attributeId: abvAttribute.id, valueNumber: 5.4 },
    {
      beverageId: beer5.id,
      attributeId: colorAttribute.id,
      valueString: 'Uklar gul',
    },
    { beverageId: beer6.id, attributeId: abvAttribute.id, valueNumber: 4.5 },
    { beverageId: beer7.id, attributeId: abvAttribute.id, valueNumber: 6.8 },
    { beverageId: beer7.id, attributeId: ibuAttribute.id, valueNumber: 55 },
    { beverageId: wine1.id, attributeId: abvAttribute.id, valueNumber: 13.5 },
    {
      beverageId: wine1.id,
      attributeId: sweetnessAttribute.id,
      valueNumber: 3,
    },
    { beverageId: wine2.id, attributeId: abvAttribute.id, valueNumber: 12.0 },
    {
      beverageId: wine2.id,
      attributeId: sweetnessAttribute.id,
      valueNumber: 2,
    },
    { beverageId: wine3.id, attributeId: abvAttribute.id, valueNumber: 12.5 },
    { beverageId: wine4.id, attributeId: abvAttribute.id, valueNumber: 12.0 },
    { beverageId: wine5.id, attributeId: abvAttribute.id, valueNumber: 13.0 },
    {
      beverageId: wine5.id,
      attributeId: sweetnessAttribute.id,
      valueNumber: 4,
    },
    { beverageId: wine6.id, attributeId: abvAttribute.id, valueNumber: 12.5 },
    { beverageId: rum1.id, attributeId: abvAttribute.id, valueNumber: 38 },
    { beverageId: rum2.id, attributeId: abvAttribute.id, valueNumber: 40 },
    { beverageId: rum2.id, attributeId: ageYearsAttribute.id, valueNumber: 7 },
    { beverageId: rum3.id, attributeId: abvAttribute.id, valueNumber: 37.5 },
    { beverageId: rum4.id, attributeId: abvAttribute.id, valueNumber: 35 },
    { beverageId: rum5.id, attributeId: abvAttribute.id, valueNumber: 40 },
    { beverageId: rum5.id, attributeId: ageYearsAttribute.id, valueNumber: 5 },
    { beverageId: whiskey1.id, attributeId: abvAttribute.id, valueNumber: 40 },
    {
      beverageId: whiskey1.id,
      attributeId: ageYearsAttribute.id,
      valueNumber: 12,
    },
    { beverageId: whiskey2.id, attributeId: abvAttribute.id, valueNumber: 43 },
    {
      beverageId: whiskey2.id,
      attributeId: ageYearsAttribute.id,
      valueNumber: 12,
    },
    { beverageId: whiskey3.id, attributeId: abvAttribute.id, valueNumber: 40 },
    { beverageId: whiskey4.id, attributeId: abvAttribute.id, valueNumber: 40 },
    {
      beverageId: whiskey5.id,
      attributeId: abvAttribute.id,
      valueNumber: 50.5,
    },
    { beverageId: whiskey6.id, attributeId: abvAttribute.id, valueNumber: 45 },
    { beverageId: gin1.id, attributeId: abvAttribute.id, valueNumber: 47.3 },
    {
      beverageId: gin1.id,
      attributeId: botanicalsAttribute.id,
      valueString: 'Enebær, koriander, angelica',
    },
    { beverageId: gin2.id, attributeId: abvAttribute.id, valueNumber: 40 },
    {
      beverageId: gin2.id,
      attributeId: botanicalsAttribute.id,
      valueString: 'Enebær, citron, mandel',
    },
    { beverageId: gin3.id, attributeId: abvAttribute.id, valueNumber: 41.4 },
    {
      beverageId: gin3.id,
      attributeId: botanicalsAttribute.id,
      valueString: 'Enebær, agurke, rosenblade',
    },
    { beverageId: gin4.id, attributeId: abvAttribute.id, valueNumber: 40 },
    { beverageId: gin5.id, attributeId: abvAttribute.id, valueNumber: 41.3 },
    { beverageId: cider1.id, attributeId: abvAttribute.id, valueNumber: 4.5 },
    {
      beverageId: cider1.id,
      attributeId: sweetnessAttribute.id,
      valueNumber: 4,
    },
    { beverageId: cider2.id, attributeId: abvAttribute.id, valueNumber: 4.5 },
    {
      beverageId: cider2.id,
      attributeId: sweetnessAttribute.id,
      valueNumber: 3,
    },
    { beverageId: cider3.id, attributeId: abvAttribute.id, valueNumber: 4.0 },
    {
      beverageId: cider3.id,
      attributeId: sweetnessAttribute.id,
      valueNumber: 4,
    },
    { beverageId: cider4.id, attributeId: abvAttribute.id, valueNumber: 4.0 },
    {
      beverageId: cider4.id,
      attributeId: sweetnessAttribute.id,
      valueNumber: 2,
    },
  ];
  for (const row of attrValues) {
    await prisma.beverageAttributeValue.create({
      data: {
        beverageId: row.beverageId,
        attributeId: row.attributeId,
        ...(row.valueNumber != null && { valueNumber: row.valueNumber }),
        ...(row.valueString != null && { valueString: row.valueString }),
      },
    });
  }

  // ---------- Questions ----------
  const aromaQuestion = await prisma.question.create({
    data: {
      categoryId: beerCategory.id,
      typeId: null,
      questionText: 'Hvordan er aromaen?',
      answerType: 'text',
      sortOrder: 1,
    },
  });
  const bitternessQuestion = await prisma.question.create({
    data: {
      categoryId: beerCategory.id,
      typeId: ipaType.id,
      questionText: 'Hvor bitter smager den?',
      answerType: 'number',
      sortOrder: 2,
    },
  });
  const colorQuestion = await prisma.question.create({
    data: {
      categoryId: beerCategory.id,
      typeId: null,
      questionText: 'Hvordan ser den ud?',
      answerType: 'text',
      sortOrder: 3,
    },
  });
  const tasteQuestion = await prisma.question.create({
    data: {
      categoryId: beerCategory.id,
      typeId: null,
      questionText: 'Hvordan er smagen?',
      answerType: 'text',
      sortOrder: 4,
    },
  });
  const recommendQuestion = await prisma.question.create({
    data: {
      categoryId: beerCategory.id,
      typeId: null,
      questionText: 'Vil du anbefale den?',
      answerType: 'text',
      sortOrder: 5,
    },
  });

  const wineTasteQuestion = await prisma.question.create({
    data: {
      categoryId: wineCategory.id,
      typeId: null,
      questionText: 'Hvordan er smagen?',
      answerType: 'text',
      sortOrder: 1,
    },
  });
  const winePairingQuestion = await prisma.question.create({
    data: {
      categoryId: wineCategory.id,
      typeId: null,
      questionText: 'Hvad vil du parre den med?',
      answerType: 'text',
      sortOrder: 2,
    },
  });

  const spiritSmoothQuestion = await prisma.question.create({
    data: {
      categoryId: whiskeyCategory.id,
      typeId: null,
      questionText: 'Hvor blød/skarp er den?',
      answerType: 'text',
      sortOrder: 1,
    },
  });
  const spiritNeatQuestion = await prisma.question.create({
    data: {
      categoryId: ginCategory.id,
      typeId: null,
      questionText: 'Drikker du den ren eller i cocktail?',
      answerType: 'text',
      sortOrder: 1,
    },
  });
  const rumTasteQuestion = await prisma.question.create({
    data: {
      categoryId: rumCategory.id,
      typeId: null,
      questionText: 'Hvordan er rommen?',
      answerType: 'text',
      sortOrder: 1,
    },
  });
  const ciderTasteQuestion = await prisma.question.create({
    data: {
      categoryId: ciderCategory.id,
      typeId: null,
      questionText: 'Hvordan smager cideren?',
      answerType: 'text',
      sortOrder: 1,
    },
  });

  // ---------- Reviews (helper) ----------
  async function createReview(
    userId: string,
    beverageId: string,
    rating: number,
    title: string,
    description: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const bev = await tx.beverage.findUnique({
        where: { id: beverageId },
        select: { reviewCount: true, averageRating: true },
      });
      const prevReviewCount = bev?.reviewCount ?? 0;
      const prevAverage = bev?.averageRating ?? 0;
      const newCount = prevReviewCount + 1;
      const newAverage = (prevAverage * prevReviewCount + rating) / newCount;
      await tx.beverage.update({
        where: { id: beverageId },
        data: { reviewCount: { increment: 1 }, averageRating: newAverage },
      });
      return tx.review.create({
        data: { userId, beverageId, rating, title, description },
      });
    });
  }

  const review1 = await createReview(
    user1.id,
    beer1.id,
    4.2,
    'Frisk og god',
    'Let og forfriskende',
  );
  const review2 = await createReview(
    user2.id,
    beer2.id,
    4.8,
    'Humlet og bitter',
    'IPA som den skal smage',
  );
  const review3 = await createReview(
    user3.id,
    wine1.id,
    3.5,
    'Rød og frugtig',
    'God til aftensmad',
  );
  const review4 = await createReview(
    user1.id,
    whiskey1.id,
    4.5,
    'Klassisk malt',
    'God balance',
  );
  const review5 = await createReview(
    user2.id,
    gin1.id,
    4.0,
    'Klar og kraftig',
    'Perfekt til G&T',
  );
  const review6 = await createReview(
    user4.id,
    rum2.id,
    4.7,
    'Lækker mørk rom',
    'God til sipping',
  );
  const review7 = await createReview(
    user5.id,
    cider1.id,
    4.2,
    'Sød og frugtig',
    'Perfekt sommerdrink',
  );
  const review8 = await createReview(
    user3.id,
    wine4.id,
    4.9,
    'Fest champagne',
    'Bobler og elegance',
  );
  const review9 = await createReview(
    user4.id,
    whiskey4.id,
    4.0,
    'Amerikansk klassiker',
    'God med is',
  );
  const review10 = await createReview(
    user5.id,
    beer5.id,
    4.6,
    'Tysk hvede',
    'Frugtig og let',
  );

  // ---------- Review Answers ----------
  await prisma.reviewAnswer.createMany({
    data: [
      {
        reviewId: review1.id,
        questionId: aromaQuestion.id,
        answer: 'Let malt aroma',
      },
      { reviewId: review1.id, questionId: colorQuestion.id, answer: 'Lys gul' },
      {
        reviewId: review1.id,
        questionId: tasteQuestion.id,
        answer: 'Let og forfriskende, lidt sød malt',
      },
      {
        reviewId: review1.id,
        questionId: recommendQuestion.id,
        answer: 'Ja, god hverdagsøl',
      },
      {
        reviewId: review2.id,
        questionId: aromaQuestion.id,
        answer: 'Humlet aroma',
      },
      { reviewId: review2.id, questionId: bitternessQuestion.id, answer: '60' },
      {
        reviewId: review2.id,
        questionId: colorQuestion.id,
        answer: 'Mørk amber',
      },
      {
        reviewId: review2.id,
        questionId: tasteQuestion.id,
        answer: 'Kraftig humle, citrus og lidt malt',
      },
      {
        reviewId: review2.id,
        questionId: recommendQuestion.id,
        answer: 'Ja, helt sikkert til IPA-fans',
      },
      {
        reviewId: review3.id,
        questionId: wineTasteQuestion.id,
        answer: 'Frugtig og fyldig',
      },
      {
        reviewId: review3.id,
        questionId: winePairingQuestion.id,
        answer: 'Kød og pasta',
      },
      {
        reviewId: review4.id,
        questionId: spiritSmoothQuestion.id,
        answer: 'Blød og maltet',
      },
      {
        reviewId: review5.id,
        questionId: spiritNeatQuestion.id,
        answer: 'I gin og tonic',
      },
      {
        reviewId: review6.id,
        questionId: rumTasteQuestion.id,
        answer: 'Blød og karamel',
      },
      {
        reviewId: review7.id,
        questionId: ciderTasteQuestion.id,
        answer: 'Sød jordbær og lime',
      },
      {
        reviewId: review8.id,
        questionId: winePairingQuestion.id,
        answer: 'Fest og forretter',
      },
      {
        reviewId: review9.id,
        questionId: spiritSmoothQuestion.id,
        answer: 'Lidt skarp, god med is',
      },
      {
        reviewId: review10.id,
        questionId: aromaQuestion.id,
        answer: 'Banana og nellik',
      },
      {
        reviewId: review10.id,
        questionId: tasteQuestion.id,
        answer: 'Frugtig hvede, let bitter',
      },
    ],
  });

  console.log(
    '✅ Seed complete with extended data (øl, vin, rom, whiskey, gin, cider)!',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
