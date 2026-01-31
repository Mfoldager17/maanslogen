import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewAdminController } from './review-admin.controller';
import { ReviewWebController } from './review-web.controller';

@Module({
  controllers: [ReviewAdminController, ReviewWebController],
  providers: [ReviewService],
})
export class ReviewModule {}
