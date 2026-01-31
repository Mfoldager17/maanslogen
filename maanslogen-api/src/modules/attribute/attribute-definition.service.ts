// src/attribute/attribute-definition.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';

@Injectable()
export class AttributeDefinitionService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const attr = await this.prisma.attributeDefinition.findUnique({
      where: { id },
    });
    if (!attr) throw new NotFoundException('Attribute definition not found');
    return attr;
  }

  create(dto: CreateAttributeDefinitionDto) {
    return this.prisma.attributeDefinition.create({ data: dto });
  }

  findAll() {
    return this.prisma.attributeDefinition.findMany();
  }

  findByCategory(categoryId: string) {
    return this.prisma.attributeDefinition.findMany({
      where: { categoryId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
