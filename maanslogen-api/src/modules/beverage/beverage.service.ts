import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';

@Injectable()
export class BeverageService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.beverage.findMany({
      include: { images: true },
    });
  }

  async create(createBeverageDto: CreateBeverageDto) {
    const { images, ...beverageData } = createBeverageDto;
    return this.prisma.beverage.create({
      data: {
        ...beverageData,
        country: beverageData.country || 'DK',
        ...(images?.length
          ? { images: { create: images.map((img) => ({ url: img.url, type: img.type })) } }
          : {}),
      },
      include: { images: true },
    });
  }
}
