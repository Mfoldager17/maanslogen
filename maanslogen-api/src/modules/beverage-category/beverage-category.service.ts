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
    const toCreate = [
      ...(icon ? [{ type: ImageType.ICON, url: icon }] : []),
      ...(images ?? []).map((img) => ({
        url: img.url,
        type: img.type,
        width: img.width,
        height: img.height,
      })),
    ];
    const entity = await this.prisma.beverageCategory.create({
      data: {
        ...categoryData,
        ...(toCreate.length ? { images: { create: toCreate } } : {}),
      },
    });
    await this.confirmUploadedImages(images);
    return this.getById(entity.id);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.getById(id);
    const { images, icon, ...categoryData } = dto;
    await this.prisma.$transaction(async (tx) => {
      await tx.beverageCategory.update({ where: { id }, data: categoryData });
      // Icon og øvrige billeder udskiftes hver for sig, så et icon-skift ikke rydder galleriet
      if (icon !== undefined) {
        await tx.image.deleteMany({
          where: { categoryId: id, type: ImageType.ICON },
        });
        if (icon) {
          await tx.image.create({
            data: { categoryId: id, type: ImageType.ICON, url: icon },
          });
        }
      }
      if (images !== undefined) {
        await tx.image.deleteMany({
          where: { categoryId: id, type: { not: ImageType.ICON } },
        });
        if (images.length) {
          await tx.image.createMany({
            data: images.map((img) => ({
              categoryId: id,
              url: img.url,
              type: img.type,
              width: img.width,
              height: img.height,
            })),
          });
        }
      }
    });
    await this.confirmUploadedImages(images);
    return this.getById(id);
  }

  /** Fjerner uploadede billeder fra PendingUpload, så cleanup-jobbet ikke sletter dem. */
  private async confirmUploadedImages(
    images?: { url: string }[],
  ): Promise<void> {
    const uploadUrls = (images ?? [])
      .map((img) => img.url)
      .filter((url) => url.startsWith('http'));
    if (uploadUrls.length) await this.uploadService.confirmUploads(uploadUrls);
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
