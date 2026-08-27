'use strict';
const path = require('path');
require('dotenv').config(); // maanslogen-api/.env
require('dotenv').config({ path: path.join(__dirname, '.env.local') }); // maanslogen-api/.env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); // repo root .env
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') }); // repo root .env.local
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL mangler. Sæt den i maanslogen-api/.env eller repo-roden .env.local');
  process.exit(1);
}
module.exports = {
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url }
};
