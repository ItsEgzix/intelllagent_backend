import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AuthService implements OnModuleInit, OnModuleDestroy {
    private jwtService;
    private prisma;
    constructor(jwtService: JwtService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    register(registerDto: RegisterDto, requestingUserRole?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
            createdAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
            createdAt: Date;
        };
    }>;
    validateUser(userId: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        createdAt: Date;
    }>;
    findAllUsers(): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        isAgent: boolean;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        isAgent: boolean;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
