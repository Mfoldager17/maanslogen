import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) { }

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
}
