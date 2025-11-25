import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto, @Request() req) {
    return this.authService.register(registerDto, req.user.role);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout() {
    // With JWT, logout is typically handled client-side by removing the token
    // This endpoint can be used for logging purposes or token blacklisting in the future
    return {
      message: 'Logged out successfully',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async getAllUsers() {
    return this.authService.findAllUsers();
  }

  @Patch('users/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @Body() body: any,
    @Request() req: any,
    @UploadedFile() file?: any,
  ) {
    // Allow users to update their own profile, or superadmins to update any profile
    const userId = req.user?.id ?? req.user?.sub;
    const userRole = req.user?.role;

    if (userId !== id && userRole !== 'superadmin') {
      throw new ForbiddenException(
        'You can only update your own profile unless you are a superadmin',
      );
    }

    const updateUserDto: UpdateUserDto = {
      name: body.name,
      email: body.email,
      timezone: body.timezone,
    };

    if (file) {
      // Save file path relative to uploads folder
      updateUserDto.avatar = `/uploads/avatars/${file.filename}`;
    }

    return this.authService.updateUser(id, updateUserDto);
  }
}
