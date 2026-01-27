import { PrismaService } from '../../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        id: string;
        username: string;
        email: string;
        passwordHash: string;
        createdAt: Date;
        profilePicture: string | null;
    }[]>;
}
