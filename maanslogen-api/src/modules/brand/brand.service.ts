import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    return this.prisma.brand.findUnique({
      where: { id },
      include: { beverages: true },
    });
  }

  async create(createBrandDto: CreateBrandDto) {
    return this.prisma.brand.create({
      data: createBrandDto,
    });
  }
}
