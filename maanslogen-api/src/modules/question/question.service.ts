import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionDto) {
    const rawOrder = dto.sortOrder;
    // 0 = "sidst i rækken" → behandles som ingen angivet rækkefølge
    const sortOrder =
      rawOrder != null && rawOrder !== undefined && rawOrder > 0
        ? rawOrder
        : undefined;

    return this.prisma.$transaction(async (tx) => {
      const scope = {
        categoryId: dto.categoryId,
        ...(dto.typeId != null && dto.typeId !== ''
          ? { typeId: dto.typeId }
          : { typeId: null }),
      };

      let finalSortOrder: number | undefined = sortOrder;

      if (sortOrder != null) {
        // Angivet plads: skub alle med sortOrder >= denne én plads ned
        await tx.question.updateMany({
          where: { ...scope, sortOrder: { gte: sortOrder } },
          data: { sortOrder: { increment: 1 } },
        });
      } else {
        // Ingen plads eller 0: sæt til sidst (max + 1)
        const max = await tx.question.aggregate({
          where: scope,
          _max: { sortOrder: true },
        });
        finalSortOrder = (max._max.sortOrder ?? 0) + 1;
      }

      return tx.question.create({
        data: {
          ...scope,
          questionText: dto.questionText,
          answerType: dto.answerType,
          options: dto.options ?? undefined,
          sortOrder: finalSortOrder,
          required: dto.required ?? false,
        },
      });
    });
  }

  async getById(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  findAll() {
    return this.prisma.question.findMany({
      orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  findByCategory(categoryId: string) {
    return this.prisma.question.findMany({
      where: { categoryId },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  findByType(typeId: string) {
    return this.prisma.question.findMany({
      where: { typeId },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  async remove(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      select: { categoryId: true, typeId: true },
    });
    if (!question) throw new NotFoundException('Question not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.reviewAnswer.deleteMany({ where: { questionId: id } });
      await tx.question.delete({ where: { id } });

      // Kompakt rækkefølge: sæt sortOrder til 1, 2, 3, … for resten i samme kategori/type
      const scope = {
        categoryId: question.categoryId,
        typeId: question.typeId,
      };
      const remaining = await tx.question.findMany({
        where: scope,
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        select: { id: true },
      });
      for (let i = 0; i < remaining.length; i++) {
        await tx.question.update({
          where: { id: remaining[i].id },
          data: { sortOrder: i + 1 },
        });
      }
      return { deleted: true };
    });
  }
}
