import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
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
