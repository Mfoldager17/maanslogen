import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';

@Injectable()
export class BeverageService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async getById(id: string) {
    const beverage = await this.prisma.beverage.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!beverage) throw new NotFoundException('Beverage not found');
    return beverage;
  }

  async getAll() {
    return this.prisma.beverage.findMany({
      include: { images: true },
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
      include: { images: true },
    });
    if (images?.length) {
      await this.uploadService.confirmUploads(images.map((img) => img.url));
    }
    return entity;
  }
}
