import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class AuthService {
    private readonly prisma;
    private jwtService;
    private cloudinaryService;
    constructor(prisma: PrismaService, jwtService: JwtService, cloudinaryService: CloudinaryService);
    register(registerDto: RegisterDto, requestingUserRole?: string): Promise<{
        access_token: string;
        user: {
            email: string;
            id: string;
            createdAt: Date;
            name: string | null;
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
    validateUser(userId: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        name: string | null;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        isAgent: boolean;
        role: string;
    }>;
    findAllUsers(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        isAgent: boolean;
        role: string;
    }[]>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        isAgent: boolean;
        role: string;
    }>;
}
