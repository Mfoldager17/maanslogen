// src/beverage-attribute/beverage-attribute-value.module.ts
import { Module } from '@nestjs/common';
import { BeverageAttributeValueService } from './beverage-attribute-value.service';
import { BeverageAttributeValueAdminController } from './beverage-attribute-value-admin.controller';
import { BeverageAttributeValueWebController } from './beverage-attribute-value-web.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [BeverageAttributeValueAdminController, BeverageAttributeValueWebController],
  providers: [BeverageAttributeValueService, PrismaService],
  exports: [BeverageAttributeValueService],
})
export class BeverageAttributeValueModule {}
