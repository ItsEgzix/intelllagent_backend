import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCustomerDto: CreateCustomerDto, adminId: string): Promise<{
        admin: {
            email: string;
            name: string | null;
            id: string;
        } | null;
        meetings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            agentId: string | null;
            customerDate: string;
            customerTime: string;
            customerTimezone: string;
            agentDate: string | null;
            agentTime: string | null;
            agentTimezone: string | null;
            customerId: string;
        }[];
    } & {
        email: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
        level: string;
    }>;
    findAll(adminId?: string): Promise<({
        admin: {
            email: string;
            name: string | null;
            id: string;
        } | null;
        meetings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            agentId: string | null;
            customerDate: string;
            customerTime: string;
            customerTimezone: string;
            agentDate: string | null;
            agentTime: string | null;
            agentTimezone: string | null;
            customerId: string;
        }[];
    } & {
        email: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
        level: string;
    })[]>;
    findOne(id: string, adminId?: string): Promise<{
        admin: {
            email: string;
            name: string | null;
            id: string;
        } | null;
        meetings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            agentId: string | null;
            customerDate: string;
            customerTime: string;
            customerTimezone: string;
            agentDate: string | null;
            agentTime: string | null;
            agentTimezone: string | null;
            customerId: string;
        }[];
    } & {
        email: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
        level: string;
    }>;
    update(id: string, updateCustomerDto: UpdateCustomerDto, adminId?: string): Promise<{
        admin: {
            email: string;
            name: string | null;
            id: string;
        } | null;
        meetings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            agentId: string | null;
            customerDate: string;
            customerTime: string;
            customerTimezone: string;
            agentDate: string | null;
            agentTime: string | null;
            agentTimezone: string | null;
            customerId: string;
        }[];
    } & {
        email: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
        level: string;
    }>;
    remove(id: string, adminId?: string): Promise<{
        email: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
        level: string;
    }>;
}
