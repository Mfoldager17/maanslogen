import { Module } from '@nestjs/common';
import { BeverageCategoryService } from './beverage-category.service';
import { BeverageCategoryController } from './beverage-category.controller';

@Module({
  controllers: [BeverageCategoryController],
  providers: [BeverageCategoryService],
})
export class BeverageCategoryModule {}
