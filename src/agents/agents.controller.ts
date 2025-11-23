import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get('active')
  async findActive() {
    // Public endpoint - no auth required for calendar selection
    try {
      return await this.agentsService.findActive();
    } catch (error) {
      console.error('Error fetching active agents:', error);
      throw new BadRequestException(
        'Failed to fetch active agents. Please try again later.',
      );
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentsService.create(createAgentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    return this.agentsService.update(id, updateAgentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }

  // Agent Availability Endpoints
  @Get(':id/available-slots')
  getAvailableSlots(
    @Param('id') id: string,
    @Query('date') date: string,
    @Query('timezone') customerTimezone: string,
  ) {
    if (!date) {
      throw new BadRequestException('Date parameter is required');
    }
    if (!customerTimezone) {
      throw new BadRequestException('Timezone parameter is required');
    }
    return this.agentsService.getAvailableTimeSlots(id, date, customerTimezone);
  }
}
