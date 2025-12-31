import { AuthService } from './auth.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly cloudinaryService;
    constructor(authService: AuthService, cloudinaryService: CloudinaryService);
    register(registerDto: RegisterDto, req: any): Promise<{
        access_token: string;
        user: {
            email: string;
            name: string | null;
            id: string;
            createdAt: Date;
            role: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
            timezone: string | null;
            avatar: string | null;
            isActive: boolean;
            isAgent: boolean;
            createdAt: Date;
        };
    }>;
    logout(): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
    getAllUsers(): Promise<{
        email: string;
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        timezone: string | null;
        role: string;
        isAgent: boolean;
        avatar: string | null;
        isActive: boolean;
    }[]>;
    updateUser(id: string, body: any, req: any, file?: any): Promise<{
        email: string;
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        timezone: string | null;
        role: string;
        isAgent: boolean;
        avatar: string | null;
        isActive: boolean;
    }>;
}
