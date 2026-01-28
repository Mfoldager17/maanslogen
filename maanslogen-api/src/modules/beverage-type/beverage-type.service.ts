import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBeverageTypeDto } from './dto/create-beverage-type.dto';

@Injectable()
export class BeverageTypeService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.beverageType.findMany({
      include: { attributes: true, questions: true },
    });
  }

  async getById(id: string) {
    return this.prisma.beverageType.findUnique({
      where: { id },
      include: { attributes: true, questions: true },
    });
  }

  async create(createBeverageTypeDto: CreateBeverageTypeDto) {
    return this.prisma.beverageType.create({
      data: createBeverageTypeDto,
    });
  }
}
