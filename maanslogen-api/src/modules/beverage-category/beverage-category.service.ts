import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateCategoryDto } from './admin/dto/create-category.dto';
import { UpdateCategoryDto } from './admin/dto/update-category.dto';

@Injectable()
export class BeverageCategoryService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async getAll() {
    return this.prisma.beverageCategory.findMany({
      include: { types: true, attributeDefinitions: true, questions: true, images: true},
    });
  }

  async getById(id: string) {
    const category = await this.prisma.beverageCategory.findUnique({
      where: { id },
      include: { types: true, attributeDefinitions: true, questions: true, images: true },
    });
    if (!category) throw new NotFoundException('Beverage category not found');
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { images, ...categoryData } = createCategoryDto;
    const entity = await this.prisma.beverageCategory.create({
      data: {
        ...categoryData,
        ...(images?.length
          ? {
              images: {
                create: images.map((img) => ({
                  url: img.url,
                  type: img.type,
                  width: img.width,
                  height: img.height,
                })),
              },
            }
          : {}),
      },
      include: { images: true },
    });
    if (images?.length) {
      await this.uploadService.confirmUploads(images.map((img) => img.url));
    }
    return entity;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.getById(id);
    const { images, ...categoryData } = dto;
    const entity = await this.prisma.beverageCategory.update({
      where: { id },
      data: {
        ...categoryData,
        ...(images?.length
          ? {
              images: {
                deleteMany: {},
                create: images.map((img) => ({
                  url: img.url,
                  type: img.type,
                  width: img.width,
                  height: img.height,
                })),
              },
            }
          : {}),
      },
      include: { images: true },
    });
    if (images?.length) {
      await this.uploadService.confirmUploads(images.map((img) => img.url));
    }
    return entity;
  }

  async remove(id: string) {
    const category = await this.prisma.beverageCategory.findUnique({
      where: { id },
      include: { _count: { select: { types: true, brands: true } } },
    });
    if (!category) throw new NotFoundException('Beverage category not found');
    if (category._count.types > 0) {
      throw new ConflictException('Cannot delete category that has beverage types');
    }
    if (category._count.brands > 0) {
      throw new ConflictException('Cannot delete category that has linked brands');
    }
    await this.prisma.beverageCategory.delete({ where: { id } });
    return { deleted: true };
  }
}
