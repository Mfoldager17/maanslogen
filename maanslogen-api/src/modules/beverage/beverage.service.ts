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
    await this.getById(id);
    const { images, ...beverageData } = dto;
    const entity = await this.prisma.beverage.update({
      where: { id },
      data: {
        ...beverageData,
        ...(images !== undefined
          ? images.length
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
            : { images: { deleteMany: {} } }
          : {}),
      },
      include: { images: true, brand: true },
    });
    if (images?.length) {
      await this.uploadService.confirmUploads(images.map((img) => img.url));
    }
    return entity;
  }

  async remove(id: string) {
    const beverage = await this.getById(id);
    const imageUrls = beverage.images.map((img) => img.url);
    if (imageUrls.length) {
      await this.uploadService.registerImagesForPendingCleanup(imageUrls);
    }
    const reviews = await this.prisma.review.findMany({
      where: { beverageId: id },
      select: { id: true },
    });
    for (const r of reviews) {
      await this.prisma.reviewAnswer.deleteMany({ where: { reviewId: r.id } });
    }
    await this.prisma.review.deleteMany({ where: { beverageId: id } });
    await this.prisma.beverageAttributeValue.deleteMany({
      where: { beverageId: id },
    });
    await this.prisma.beverage.delete({ where: { id } });
    return { deleted: true };
  }
}
