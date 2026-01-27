import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { BeverageModule } from './modules/beverage/beverage.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [PrismaModule, UserModule, BeverageModule, ReviewModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
