import { BeverageService } from './beverage.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';
export declare class BeverageController {
    private beverageService;
    constructor(beverageService: BeverageService);
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
    create(createBeverageDto: CreateBeverageDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
    }>;
}
