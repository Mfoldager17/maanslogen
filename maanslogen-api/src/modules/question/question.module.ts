import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuestionAdminController } from './question-admin.controller';
import { QuestionWebController } from './question-web.controller';
import { QuestionService } from './question.service';

@Module({
  controllers: [QuestionAdminController, QuestionWebController],
  providers: [QuestionService, PrismaService],
  exports: [QuestionService],
})
export class QuestionModule {}
