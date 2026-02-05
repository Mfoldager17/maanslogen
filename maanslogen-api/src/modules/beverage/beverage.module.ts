import { Module } from '@nestjs/common';
import { BeverageAdminController } from './beverage-admin.controller';
import { BeverageWebController } from './beverage-web.controller';
import { BeverageService } from './beverage.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [BeverageAdminController, BeverageWebController],
  providers: [BeverageService],
})
export class BeverageModule {}
