import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class BeverageCategoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.beverageCategory.findMany({
      include: { types: true, attributes: true, questions: true },
    });
  }

  async getById(id: string) {
    return this.prisma.beverageCategory.findUnique({
      where: { id },
      include: { types: true, attributes: true, questions: true },
    });
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.beverageCategory.create({
      data: createCategoryDto,
    });
  }
}
