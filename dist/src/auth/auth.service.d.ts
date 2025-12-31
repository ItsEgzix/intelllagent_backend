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
    validateUser(userId: string): Promise<{
        email: string;
        name: string | null;
        id: string;
        createdAt: Date;
        timezone: string | null;
        role: string;
        isAgent: boolean;
        avatar: string | null;
        isActive: boolean;
    }>;
    findAllUsers(): Promise<{
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
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<{
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
