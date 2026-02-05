import { Module } from '@nestjs/common';
import { BeverageTypeService } from './beverage-type.service';
import { BeverageTypeAdminController } from './beverage-type-admin.controller';
import { BeverageTypeWebController } from './beverage-type-web.controller';

@Module({
  controllers: [BeverageTypeAdminController, BeverageTypeWebController],
  providers: [BeverageTypeService],
})
export class BeverageTypeModule {}
