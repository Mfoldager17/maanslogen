import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateBeverageDto } from './admin/dto/create-beverage.dto';
import { UpdateBeverageDto } from './admin/dto/update-beverage.dto';

@Injectable()
export class BeverageService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async getById(id: string) {
    const beverage = await this.prisma.beverage.findUnique({
      where: { id },
      include: { images: true, brand: true },
    });
    if (!beverage) throw new NotFoundException('Beverage not found');
    return beverage;
  }

  async getAll() {
    return this.prisma.beverage.findMany({
      include: { images: true, brand: true },
    });
  }

  async create(createBeverageDto: CreateBeverageDto) {
    const { images, ...beverageData } = createBeverageDto;
    const entity = await this.prisma.beverage.create({
      data: {
        ...beverageData,
        country: beverageData.country || 'DK',
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
      include: { images: true, brand: true },
    });
    if (images?.length) {
      await this.uploadService.confirmUploads(images.map((img) => img.url));
    }
    return entity;
  }

  async update(id: string, dto: UpdateBeverageDto) {
    const existing = await this.getById(id);
    const { images, ...beverageData } = dto;
    const entity = await this.prisma.beverage.update({
      where: { id },
      data: {
        ...beverageData,
        ...(images !== undefined
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
      include: { images: true, brand: true },
    });
    if (images !== undefined) {
      if (images.length) {
        await this.uploadService.confirmUploads(images.map((img) => img.url));
      }
      // Billeder der er fjernet i redigeringen skal også ryddes op i S3
      const keptUrls = new Set(images.map((img) => img.url));
      const removedUrls = existing.images
        .map((img) => img.url)
        .filter((url) => !keptUrls.has(url));
      if (removedUrls.length) {
        await this.uploadService.registerImagesForPendingCleanup(removedUrls);
      }
    }
    return entity;
  }

  async remove(id: string) {
    const beverage = await this.getById(id);
    const imageUrls = beverage.images.map((img) => img.url);
    if (imageUrls.length) {
      await this.uploadService.registerImagesForPendingCleanup(imageUrls);
    }
    await this.prisma.$transaction([
      this.prisma.reviewAnswer.deleteMany({
        where: { review: { beverageId: id } },
      }),
      this.prisma.review.deleteMany({ where: { beverageId: id } }),
      this.prisma.beverageAttributeValue.deleteMany({
        where: { beverageId: id },
      }),
      this.prisma.beverage.delete({ where: { id } }),
    ]);
    return { deleted: true };
  }
}
