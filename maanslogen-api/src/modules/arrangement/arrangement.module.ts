import { Module } from '@nestjs/common';
import { ArrangementAdminController } from './admin/arrangement-admin.controller';
import { ArrangementWebController } from './web/arrangement-web.controller';
import { ArrangementService } from './arrangement.service';

@Module({
  controllers: [ArrangementAdminController, ArrangementWebController],
  providers: [ArrangementService],
})
export class ArrangementModule {}
