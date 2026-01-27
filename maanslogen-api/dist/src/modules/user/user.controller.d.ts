import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAll(): Promise<{
        id: string;
        username: string;
        email: string;
        passwordHash: string;
        createdAt: Date;
        profilePicture: string | null;
    }[]>;
}
