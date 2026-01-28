import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { BeverageModule } from './modules/beverage/beverage.module';
import { ReviewModule } from './modules/review/review.module';
import { BeverageCategoryModule } from './modules/beverage-category/beverage-category.module';
import { BeverageTypeModule } from './modules/beverage-type/beverage-type.module';
@Module({
  imports: [PrismaModule, UserModule, BeverageModule, ReviewModule, BeverageCategoryModule, BeverageTypeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
