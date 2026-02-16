import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuestionAdminController } from './admin/question-admin.controller';
import { QuestionWebController } from './web/question-web.controller';
import { QuestionService } from './question.service';

@Module({
  controllers: [QuestionAdminController, QuestionWebController],
  providers: [QuestionService, PrismaService],
  exports: [QuestionService],
})
export class QuestionModule {}
