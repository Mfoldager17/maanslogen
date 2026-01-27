import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BeverageService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.beverage.findMany();
  }
}
