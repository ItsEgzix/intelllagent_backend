import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersService implements OnModuleInit, OnModuleDestroy {
    private prisma;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
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
        level: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
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
        level: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
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
        level: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
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
        level: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
    }>;
    remove(id: string, adminId?: string): Promise<{
        email: string;
        name: string;
        level: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
    }>;
}
