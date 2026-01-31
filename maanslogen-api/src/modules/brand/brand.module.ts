import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandAdminController } from './brand-admin.controller';
import { BrandWebController } from './brand-web.controller';

@Module({
  controllers: [BrandAdminController, BrandWebController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
