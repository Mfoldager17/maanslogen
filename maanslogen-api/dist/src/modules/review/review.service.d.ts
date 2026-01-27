import { PrismaService } from '../../prisma/prisma.service';
export declare class ReviewService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        beverageId: string;
        rating: number;
        title: string | null;
        description: string | null;
        updatedAt: Date;
    }[]>;
}
