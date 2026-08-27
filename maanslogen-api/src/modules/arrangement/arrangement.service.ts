import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateArrangementDto } from './admin/dto/create-arrangement.dto';
import { UpdateArrangementDto } from './admin/dto/update-arrangement.dto';

const includeBeverages = {
  beverages: {
    orderBy: { sortOrder: 'asc' as const },
    include: { beverage: { include: { images: true, brand: true } } },
  },
};

@Injectable()
export class ArrangementService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.arrangement.findMany({
      include: includeBeverages,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const arrangement = await this.prisma.arrangement.findUnique({
      where: { id },
      include: includeBeverages,
    });
    if (!arrangement) throw new NotFoundException('Arrangement not found');
    return arrangement;
  }

  async create(dto: CreateArrangementDto) {
    return this.prisma.arrangement.create({
      data: {
        type: dto.type,
        name: dto.name,
        description: dto.description ?? null,
        createdById: dto.createdById,
        beverages: {
          create: dto.beverages.map((b) => ({
            beverageId: b.beverageId,
            sortOrder: b.sortOrder,
          })),
        },
      },
      include: includeBeverages,
    });
  }

  async update(id: string, dto: UpdateArrangementDto) {
    await this.getById(id);
    const updateData: Parameters<
      typeof this.prisma.arrangement.update
    >[0]['data'] = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
    };
    if (dto.beverages !== undefined) {
      updateData.beverages = {
        deleteMany: {},
        create: dto.beverages.map((b) => ({
          beverageId: b.beverageId,
          sortOrder: b.sortOrder,
        })),
      };
    }
    return this.prisma.arrangement.update({
      where: { id },
      data: updateData,
      include: includeBeverages,
    });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.arrangement.delete({ where: { id } });
    return { deleted: true };
  }
}
