// src/attribute/attribute-definition.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';

const includeRelations = {
  categories: { select: { id: true } },
  types: { select: { id: true } },
};

function toResponse(attr: {
  id: string;
  attributeKey: string;
  displayName: string;
  dataType: string;
  filterable: boolean;
  required: boolean;
  validationRules?: unknown;
  options?: unknown;
  sortOrder?: number | null;
  categories: { id: string }[];
  types: { id: string }[];
}) {
  return {
    ...attr,
    categoryIds: attr.categories.map((c) => c.id),
    typeIds: attr.types.map((t) => t.id),
    categories: undefined,
    types: undefined,
  };
}

@Injectable()
export class AttributeDefinitionService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const attr = await this.prisma.attributeDefinition.findUnique({
      where: { id },
      include: includeRelations,
    });
    if (!attr) throw new NotFoundException('Attribute definition not found');
    return toResponse(attr);
  }

  async create(dto: CreateAttributeDefinitionDto) {
    const { categoryIds, typeIds = [], ...data } = dto;
    const attr = await this.prisma.attributeDefinition.create({
      data: {
        ...data,
        categories: { connect: categoryIds.map((id) => ({ id })) },
        types: typeIds.length ? { connect: typeIds.map((id) => ({ id })) } : undefined,
      },
      include: includeRelations,
    });
    return toResponse(attr);
  }

  async findAll() {
    const list = await this.prisma.attributeDefinition.findMany({
      include: includeRelations,
      orderBy: { sortOrder: 'asc' },
    });
    return list.map(toResponse);
  }

  async findByCategory(categoryId: string) {
    const list = await this.prisma.attributeDefinition.findMany({
      where: { categories: { some: { id: categoryId } } },
      include: includeRelations,
      orderBy: { sortOrder: 'asc' },
    });
    return list.map(toResponse);
  }

  /** Definitions that apply to this beverage type: category matches and (no type filter or type matches). */
  async findByType(beverageTypeId: string) {
    const type = await this.prisma.beverageType.findUnique({
      where: { id: beverageTypeId },
      select: { categoryId: true },
    });
    if (!type) throw new NotFoundException('Beverage type not found');
    const list = await this.prisma.attributeDefinition.findMany({
      where: {
        categories: { some: { id: type.categoryId } },
        OR: [
          { types: { none: {} } },
          { types: { some: { id: beverageTypeId } } },
        ],
      },
      include: includeRelations,
      orderBy: { sortOrder: 'asc' },
    });
    return list.map(toResponse);
  }
}
