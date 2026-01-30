import { Module } from '@nestjs/common';
import { BeverageController } from './beverage.controller';
import { BeverageService } from './beverage.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [BeverageController],
  providers: [BeverageService],
})
export class BeverageModule {}
