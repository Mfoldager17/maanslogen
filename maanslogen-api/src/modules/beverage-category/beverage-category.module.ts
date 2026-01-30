import { Module } from '@nestjs/common';
import { BeverageCategoryService } from './beverage-category.service';
import { BeverageCategoryController } from './beverage-category.controller';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [BeverageCategoryController],
  providers: [BeverageCategoryService],
})
export class BeverageCategoryModule {}
