import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';

@Injectable()
export class BeverageService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.beverage.findMany();
  }

  async create(createCategoryDto: CreateBeverageDto) {
    return this.prisma.beverageCategory.create({
      data: createCategoryDto,
    });
  }
}
