import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        userId: string;
        beverageId: string;
        rating: number;
        title: string | null;
        updatedAt: Date;
    }[]>;
    create(createReviewDto: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        userId: string;
        beverageId: string;
        rating: number;
        title: string | null;
        updatedAt: Date;
    }>;
}
