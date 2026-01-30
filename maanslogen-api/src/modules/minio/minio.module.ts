import { Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import { MinioService } from './minio.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MinioController],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
