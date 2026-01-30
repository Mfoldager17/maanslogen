import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
