import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto, @Request() req: any) {
    const adminId = req.user.sub; // User ID from JWT
    return this.customersService.create(createCustomerDto, adminId);
  }

  @Get()
  findAll(@Request() req: any) {
    const userRole = req.user.role;
    const adminId = userRole === 'superadmin' ? undefined : req.user.sub;
    return this.customersService.findAll(adminId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const userRole = req.user.role;
    const adminId = userRole === 'superadmin' ? undefined : req.user.sub;
    return this.customersService.findOne(id, adminId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Request() req: any,
  ) {
    const userRole = req.user.role;
    const adminId = userRole === 'superadmin' ? undefined : req.user.sub;
    return this.customersService.update(id, updateCustomerDto, adminId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const userRole = req.user.role;
    const adminId = userRole === 'superadmin' ? undefined : req.user.sub;
    return this.customersService.remove(id, adminId);
  }
}
