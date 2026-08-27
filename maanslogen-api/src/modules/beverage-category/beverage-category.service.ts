import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { ImageType } from '../image/dto/create-image.dto';
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
      include: {
        types: true,
        attributeDefinitions: true,
        questions: true,
        images: true,
      },
    });
  }

  async getById(id: string) {
    const category = await this.prisma.beverageCategory.findUnique({
      where: { id },
      include: {
        types: true,
        attributeDefinitions: true,
        questions: true,
        images: true,
      },
    });
    if (!category) throw new NotFoundException('Beverage category not found');
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { images, icon, ...categoryData } = createCategoryDto;
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
    if (icon) {
      await this.prisma.image.create({
        data: {
          categoryId: entity.id,
          type: ImageType.ICON,
          url: icon,
        },
      });
    }
    if (images?.length) {
      const uploadUrls = images
        .map((img) => img.url)
        .filter((url) => url.startsWith('http'));
      if (uploadUrls.length)
        await this.uploadService.confirmUploads(uploadUrls);
    }
    return this.getById(entity.id);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.getById(id);
    const { images, icon, ...categoryData } = dto;
    const hasIcon = icon !== undefined;
    const hasImages = images && images.length > 0;
    if (hasIcon || hasImages) {
      await this.prisma.image.deleteMany({ where: { categoryId: id } });
      const toCreate: Array<{
        url: string;
        type: ImageType;
        width?: number;
        height?: number;
      }> = [];
      if (hasIcon) toCreate.push({ type: ImageType.ICON, url: icon });
      if (hasImages)
        toCreate.push(
          ...images.map((img) => ({
            url: img.url,
            type: img.type,
            width: img.width,
            height: img.height,
          })),
        );
      await this.prisma.beverageCategory.update({
        where: { id },
        data: {
          ...categoryData,
          images: {
            create: toCreate.map((img) => ({
              url: img.url,
              type: img.type,
              width: img.width,
              height: img.height,
            })),
          },
        },
      });
      if (hasImages) {
        const uploadUrls = images
          .map((img) => img.url)
          .filter((url) => url.startsWith('http'));
        if (uploadUrls.length)
          await this.uploadService.confirmUploads(uploadUrls);
      }
    } else {
      await this.prisma.beverageCategory.update({
        where: { id },
        data: categoryData,
      });
    }
    return this.getById(id);
  }

  async remove(id: string) {
    const category = await this.prisma.beverageCategory.findUnique({
      where: { id },
      include: { _count: { select: { types: true, brands: true } } },
    });
    if (!category) throw new NotFoundException('Beverage category not found');
    if (category._count.types > 0) {
      throw new ConflictException(
        'Cannot delete category that has beverage types',
      );
    }
    if (category._count.brands > 0) {
      throw new ConflictException(
        'Cannot delete category that has linked brands',
      );
    }
    await this.prisma.beverageCategory.delete({ where: { id } });
    return { deleted: true };
  }
}
