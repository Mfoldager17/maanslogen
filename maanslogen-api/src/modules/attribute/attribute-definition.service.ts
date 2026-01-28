// src/attribute/attribute-definition.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';

@Injectable()
export class AttributeDefinitionService {
  constructor(private prisma: PrismaService) {}

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
