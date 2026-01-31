import { Module } from '@nestjs/common';
import { BeverageCategoryService } from './beverage-category.service';
import { BeverageCategoryAdminController } from './beverage-category-admin.controller';
import { BeverageCategoryWebController } from './beverage-category-web.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [BeverageCategoryAdminController, BeverageCategoryWebController],
  providers: [BeverageCategoryService],
})
export class BeverageCategoryModule {}
