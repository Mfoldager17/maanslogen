import { Injectable, NotFoundException } from '@nestjs/common';
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
            question: { select: { id: true, questionText: true, answerType: true } },
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

  async create(createReviewDto: CreateReviewDto) {
    const beverage = await this.prisma.beverage.findUnique({
      where: { id: createReviewDto.beverageId },
      select: { reviewCount: true, averageRating: true },
    });
    const prevCount = beverage?.reviewCount ?? 0;
    const prevAverage = beverage?.averageRating ?? 0;
    const newCount = prevCount + 1;
    const newAverage = (prevAverage * prevCount + createReviewDto.rating) / newCount;
    await this.prisma.beverage.update({
      where: { id: createReviewDto.beverageId },
      data: { reviewCount: newCount, averageRating: newAverage },
    });
    return this.prisma.review.create({
      data: createReviewDto,
    });
  }

  async update(id: string, dto: UpdateReviewDto) {
    const existing = await this.prisma.review.findUnique({
      where: { id },
      select: { beverageId: true, rating: true },
    });
    if (!existing) throw new NotFoundException('Review not found');
    const updated = await this.prisma.review.update({
      where: { id },
      data: dto,
    });
    if (dto.rating !== undefined && dto.rating !== existing.rating) {
      const beverage = await this.prisma.beverage.findUnique({
        where: { id: existing.beverageId },
        select: { reviewCount: true, averageRating: true },
      });
      const count = beverage?.reviewCount ?? 0;
      const prevAverage = beverage?.averageRating ?? 0;
      if (count > 0) {
        const newAverage =
          (prevAverage * count - existing.rating + dto.rating) / count;
        await this.prisma.beverage.update({
          where: { id: existing.beverageId },
          data: { averageRating: newAverage },
        });
      }
    }
    return updated;
  }

  async remove(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      select: { beverageId: true, rating: true },
    });
    if (!review) throw new NotFoundException('Review not found');
    const beverage = await this.prisma.beverage.findUnique({
      where: { id: review.beverageId },
      select: { reviewCount: true, averageRating: true },
    });
    const prevCount = beverage?.reviewCount ?? 0;
    const prevAverage = beverage?.averageRating ?? 0;
    await this.prisma.reviewAnswer.deleteMany({ where: { reviewId: id } });
    await this.prisma.review.delete({ where: { id } });
    const newCount = prevCount - 1;
    const newAverage =
      newCount <= 0 ? 0 : (prevAverage * prevCount - review.rating) / newCount;
    await this.prisma.beverage.update({
      where: { id: review.beverageId },
      data: { reviewCount: Math.max(0, newCount), averageRating: newAverage },
    });
    return { deleted: true };
  }
}
