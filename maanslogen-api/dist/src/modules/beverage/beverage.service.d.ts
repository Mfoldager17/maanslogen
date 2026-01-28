import { PrismaService } from '../../prisma/prisma.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';
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
        imageUrl: string | null;
        averageRating: number;
        reviewCount: number;
    }[]>;
    create(createCategoryDto: CreateBeverageDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
    }>;
}
