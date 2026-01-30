import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class BeverageCategoryService {
  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
  ) {}

  async getAll() {
    return this.prisma.beverageCategory.findMany({
      include: { types: true, attributes: true, questions: true, images: true },
    });
  }

  async getById(id: string) {
    return this.prisma.beverageCategory.findUnique({
      where: { id },
      include: { types: true, attributes: true, questions: true, images: true },
    });
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { images, ...categoryData } = createCategoryDto;
    const entity = await this.prisma.beverageCategory.create({
      data: {
        ...categoryData,
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
