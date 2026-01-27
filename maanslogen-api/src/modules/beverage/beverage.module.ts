import { Module } from '@nestjs/common';
import { BeverageController } from './beverage.controller';
import { BeverageService } from './beverage.service';

@Module({
  controllers: [BeverageController],
  providers: [BeverageService],
})
export class BeverageModule {}
