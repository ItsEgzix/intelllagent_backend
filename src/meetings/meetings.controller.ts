import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  // Public endpoint - anyone can create a meeting
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    try {
      return await this.meetingsService.create(createMeetingDto);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to create meeting',
      );
    }
  }

  // Protected endpoint - only admins can view meetings
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  findAll(@Request() req: any) {
    const userRole = req.user.role;
    const adminId = userRole === 'superadmin' ? undefined : req.user.sub;
    return this.meetingsService.findAll(adminId);
  }
}
