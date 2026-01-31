import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { BeverageModule } from './modules/beverage/beverage.module';
import { ReviewModule } from './modules/review/review.module';
import { BeverageCategoryModule } from './modules/beverage-category/beverage-category.module';
import { BeverageTypeModule } from './modules/beverage-type/beverage-type.module';
import { UploadModule } from './modules/upload/upload.module';
import { AttributeDefinitionModule } from './modules/attribute/attribute-definition.module';
import { QuestionModule } from './modules/question/question.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    BeverageModule,
    ReviewModule,
    BeverageCategoryModule,
    BeverageTypeModule,
    UploadModule,
    AttributeDefinitionModule,
    QuestionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
