import { Module } from '@nestjs/common';
import { BeverageAdminController } from './admin/beverage-admin.controller';
import { BeverageWebController } from './web/beverage-web.controller';
import { BeverageService } from './beverage.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [BeverageAdminController, BeverageWebController],
  providers: [BeverageService],
})
export class BeverageModule {}
