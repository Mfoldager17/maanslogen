import { Module } from '@nestjs/common';
import { BeverageTypeService } from './beverage-type.service';
import { BeverageTypeAdminController } from './admin/beverage-type-admin.controller';
import { BeverageTypeWebController } from './web/beverage-type-web.controller';

@Module({
  controllers: [BeverageTypeAdminController, BeverageTypeWebController],
  providers: [BeverageTypeService],
})
export class BeverageTypeModule {}
