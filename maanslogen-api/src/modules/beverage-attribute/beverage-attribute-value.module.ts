// src/beverage-attribute/beverage-attribute-value.module.ts
import { Module } from '@nestjs/common';
import { BeverageAttributeValueService } from './beverage-attribute-value.service';
import { BeverageAttributeValueController } from './beverage-attribute-value.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [BeverageAttributeValueController],
  providers: [BeverageAttributeValueService, PrismaService],
  exports: [BeverageAttributeValueService],
})
export class BeverageAttributeValueModule {}
