// src/modules/beverage-attribute/beverage-attribute-value.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBeverageAttributeValueDto } from './admin/dto/create-beverage-attribute-value.dto';
import { UpdateBeverageAttributeValueDto } from './admin/dto/update-beverage-attribute-value.dto';

@Injectable()
export class BeverageAttributeValueService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateBeverageAttributeValueDto) {
    return this.prisma.beverageAttributeValue.create({
      data: dto,
      include: { attribute: true },
    });
  }

  async getById(id: string) {
    const val = await this.prisma.beverageAttributeValue.findUnique({
      where: { id },
      include: { attribute: true },
    });
    if (!val) throw new NotFoundException('Beverage attribute value not found');
    return val;
  }

  findAllForBeverage(beverageId: string) {
    return this.prisma.beverageAttributeValue.findMany({
      where: { beverageId },
      include: { attribute: true },
    });
  }

  async update(id: string, dto: UpdateBeverageAttributeValueDto) {
    await this.getById(id);
    return this.prisma.beverageAttributeValue.update({
      where: { id },
      data: dto,
      include: { attribute: true },
    });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.beverageAttributeValue.delete({ where: { id } });
    return { deleted: true };
  }
}
