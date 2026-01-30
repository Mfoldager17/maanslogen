import { Module } from '@nestjs/common';
import { BeverageController } from './beverage.controller';
import { BeverageService } from './beverage.service';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [BeverageController],
  providers: [BeverageService],
})
export class BeverageModule {}
