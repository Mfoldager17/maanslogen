import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
  ) {}

  async getAll() {
    return this.prisma.user.findMany({
      include: { images: true },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { images, ...userData } = createUserDto;
    const entity = await this.prisma.user.create({
      data: {
        ...userData,
        ...(images?.length
          ? { images: { create: images.map((img) => ({ url: img.url, type: img.type })) } }
          : {}),
      },
      include: { images: true },
    });
    if (images?.length) {
      await this.minioService.confirmUploads(images.map((img) => img.url));
    }
    return entity;
  }
}
