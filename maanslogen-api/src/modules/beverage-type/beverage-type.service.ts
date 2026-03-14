import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBeverageTypeDto } from './admin/dto/create-beverage-type.dto';
import { UpdateBeverageTypeDto } from './admin/dto/update-beverage-type.dto';

@Injectable()
export class BeverageTypeService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.beverageType.findMany({
      include: { attributeDefinitions: true, questions: true },
    });
  }

  async getById(id: string) {
    const type = await this.prisma.beverageType.findUnique({
      where: { id },
      include: { attributeDefinitions: true, questions: true },
    });
    if (!type) throw new NotFoundException('Beverage type not found');
    return type;
  }

  async create(createBeverageTypeDto: CreateBeverageTypeDto) {
    return this.prisma.beverageType.create({
      data: createBeverageTypeDto,
    });
  }

  async update(id: string, dto: UpdateBeverageTypeDto) {
    await this.getById(id);
    return this.prisma.beverageType.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const type = await this.prisma.beverageType.findUnique({
      where: { id },
      include: { _count: { select: { beverages: true } } },
    });
    if (!type) throw new NotFoundException('Beverage type not found');
    if (type._count.beverages > 0) {
      throw new ConflictException(
        'Cannot delete beverage type that has beverages',
      );
    }
    await this.prisma.beverageType.delete({ where: { id } });
    return { deleted: true };
  }
}
