// src/beverage-attribute/beverage-attribute-value.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBeverageAttributeValueDto } from './dto/create-beverage-attribute-value.dto';

@Injectable()
export class BeverageAttributeValueService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateBeverageAttributeValueDto) {
    return this.prisma.beverageAttributeValue.create({
      data: dto,
      include: { attribute: true }, // inkluderer definitionen
    });
  }

  findAllForBeverage(beverageId: string) {
    return this.prisma.beverageAttributeValue.findMany({
      where: { beverageId },
      include: { attribute: true },
    });
  }
}
