import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';

const includeCategories = { categories: { select: { id: true } } };

function toResponse(brand: { id: string; name: string; description?: string | null; active: boolean; createdAt: Date; categories: { id: string }[] }) {
  return {
    ...brand,
    categoryIds: brand.categories.map((c) => c.id),
    categories: undefined,
  };
}

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const list = await this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: includeCategories,
    });
    return list.map(toResponse);
  }

  async getById(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: { beverages: true, ...includeCategories },
    });
    if (!brand) throw new NotFoundException('Brand not found');
    return { ...toResponse(brand), beverages: brand.beverages };
  }

  async create(dto: CreateBrandDto) {
    const { categoryIds = [], ...data } = dto;
    const brand = await this.prisma.brand.create({
      data: {
        ...data,
        categories: categoryIds.length ? { connect: categoryIds.map((id) => ({ id })) } : undefined,
      },
      include: includeCategories,
    });
    return toResponse(brand);
  }

  /** Brands that are allowed in this category (categories includes it, or categories empty = all). */
  async getByCategory(categoryId: string) {
    const list = await this.prisma.brand.findMany({
      where: {
        OR: [
          { categories: { none: {} } },
          { categories: { some: { id: categoryId } } },
        ],
      },
      orderBy: { name: 'asc' },
      include: includeCategories,
    });
    return list.map(toResponse);
  }
}
