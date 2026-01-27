import { PrismaService } from '../../prisma/prisma.service';
export declare class BeverageService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        beverageTypeId: string;
        brand: string;
        country: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        averageRating: number;
        reviewCount: number;
        imageUrl: string | null;
    }[]>;
}
