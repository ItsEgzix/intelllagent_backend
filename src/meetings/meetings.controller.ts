import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

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

  @Get()
  findAll() {
    return this.meetingsService.findAll();
  }
}
