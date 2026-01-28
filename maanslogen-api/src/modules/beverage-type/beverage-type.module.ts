import { Module } from '@nestjs/common';
import { BeverageTypeService } from './beverage-type.service';
import { BeverageTypeController } from './beverage-type.controller';

@Module({
  controllers: [BeverageTypeController],
  providers: [BeverageTypeService],
})
export class BeverageTypeModule {}
