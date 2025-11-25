import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto, adminId: string) {
    // Check if customer with email already exists
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new BadRequestException('Customer with this email already exists');
    }

    return this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        adminId,
        source: 'admin', // Customer added by admin through admin panel
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        meetings: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });
  }

  async findAll(adminId?: string) {
    const where = adminId ? { adminId } : {};

    return this.prisma.customer.findMany({
      where,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        meetings: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, adminId?: string) {
    const where: any = { id };
    if (adminId) {
      where.adminId = adminId;
    }

    const customer = await this.prisma.customer.findFirst({
      where,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        meetings: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    adminId?: string,
  ) {
    const where: any = { id };
    if (adminId) {
      where.adminId = adminId;
    }

    // Check if customer exists and belongs to admin
    const existingCustomer = await this.prisma.customer.findFirst({
      where,
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // If email is being updated, check for conflicts
    if (
      updateCustomerDto.email &&
      updateCustomerDto.email !== existingCustomer.email
    ) {
      const emailConflict = await this.prisma.customer.findUnique({
        where: { email: updateCustomerDto.email },
      });

      if (emailConflict && emailConflict.id !== id) {
        throw new BadRequestException(
          'Customer with this email already exists',
        );
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        meetings: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });
  }

  async remove(id: string, adminId?: string) {
    const where: any = { id };
    if (adminId) {
      where.adminId = adminId;
    }

    const customer = await this.prisma.customer.findFirst({
      where,
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
