import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './admin/dto/create-review.dto';
import { UpdateReviewDto } from './admin/dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        answers: {
          include: {
            question: {
              select: { id: true, questionText: true, answerType: true },
            },
          },
          orderBy: { question: { sortOrder: 'asc' } },
        },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async getAll() {
    return this.prisma.review.findMany();
  }

  async create(dto: CreateReviewDto) {
    const beverage = await this.prisma.beverage.findUnique({
      where: { id: dto.beverageId },
      select: { id: true },
    });
    if (!beverage) throw new NotFoundException('Beverage not found');
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({ data: dto });
      await this.recalcBeverageStats(tx, dto.beverageId);
      return review;
    });
  }

  async update(id: string, dto: UpdateReviewDto) {
    const existing = await this.prisma.review.findUnique({
      where: { id },
      select: { beverageId: true },
    });
    if (!existing) throw new NotFoundException('Review not found');
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({ where: { id }, data: dto });
      if (dto.rating !== undefined) {
        await this.recalcBeverageStats(tx, existing.beverageId);
      }
      return updated;
    });
  }

  async remove(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      select: { beverageId: true },
    });
    if (!review) throw new NotFoundException('Review not found');
    await this.prisma.$transaction(async (tx) => {
      await tx.reviewAnswer.deleteMany({ where: { reviewId: id } });
      await tx.review.delete({ where: { id } });
      await this.recalcBeverageStats(tx, review.beverageId);
    });
    return { deleted: true };
  }

  /** Genberegner reviewCount og averageRating ud fra de faktiske reviews (én kilde til sandhed). */
  private async recalcBeverageStats(
    tx: Prisma.TransactionClient,
    beverageId: string,
  ) {
    const stats = await tx.review.aggregate({
      where: { beverageId },
      _count: true,
      _avg: { rating: true },
    });
    await tx.beverage.update({
      where: { id: beverageId },
      data: {
        reviewCount: stats._count,
        averageRating: stats._avg.rating ?? 0,
      },
    });
  }
}
