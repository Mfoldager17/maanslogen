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
    await this.prisma.beverage.update({
      where: { id: createReviewDto.beverageId },
      data: {
        reviewCount: { increment: 1 },
      },
    });
    return this.prisma.review.create({
      data: createReviewDto,
    });
  }

  async update(id: string, dto: UpdateReviewDto) {
    await this.getById(id);
    return this.prisma.review.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      select: { beverageId: true },
    });
    if (!review) throw new NotFoundException('Review not found');
    await this.prisma.reviewAnswer.deleteMany({ where: { reviewId: id } });
    await this.prisma.review.delete({ where: { id } });
    await this.prisma.beverage.update({
      where: { id: review.beverageId },
      data: { reviewCount: { decrement: 1 } },
    });
    return { deleted: true };
  }
}
