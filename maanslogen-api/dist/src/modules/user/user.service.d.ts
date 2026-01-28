import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        username: string;
        email: string;
        passwordHash: string;
        profilePicture: string | null;
        id: string;
        createdAt: Date;
    }[]>;
    create(createUserDto: CreateUserDto): Promise<{
        username: string;
        email: string;
        passwordHash: string;
        profilePicture: string | null;
        id: string;
        createdAt: Date;
    }>;
}
