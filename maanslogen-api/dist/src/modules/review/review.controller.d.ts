import { ReviewService } from './review.service';
export declare class ReviewController {
    private reviewService;
    constructor(reviewService: ReviewService);
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
