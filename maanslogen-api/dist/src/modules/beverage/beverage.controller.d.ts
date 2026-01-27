import { BeverageService } from './beverage.service';
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
        averageRating: number;
        reviewCount: number;
        imageUrl: string | null;
    }[]>;
}
