import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto, req: any): Promise<{
        admin: {
            id: string;
            email: string;
            name: string | null;
        } | null;
        meetings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerDate: string;
            customerTime: string;
            customerTimezone: string;
            agentDate: string | null;
            agentTime: string | null;
            agentTimezone: string | null;
            customerId: string;
            agentId: string | null;
        }[];
    } & {
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
        level: string;
    }>;
    findAll(req: any): Promise<({
        admin: {
            id: string;
            email: string;
            name: string | null;
        } | null;
        meetings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerDate: string;
            customerTime: string;
            customerTimezone: string;
            agentDate: string | null;
            agentTime: string | null;
            agentTimezone: string | null;
            customerId: string;
            agentId: string | null;
        }[];
    } & {
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
        level: string;
    })[]>;
    findOne(id: string, req: any): Promise<{
        admin: {
            id: string;
            email: string;
            name: string | null;
        } | null;
        meetings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerDate: string;
            customerTime: string;
            customerTimezone: string;
            agentDate: string | null;
            agentTime: string | null;
            agentTimezone: string | null;
            customerId: string;
            agentId: string | null;
        }[];
    } & {
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
        level: string;
    }>;
    update(id: string, updateCustomerDto: UpdateCustomerDto, req: any): Promise<{
        admin: {
            id: string;
            email: string;
            name: string | null;
        } | null;
        meetings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerDate: string;
            customerTime: string;
            customerTimezone: string;
            agentDate: string | null;
            agentTime: string | null;
            agentTimezone: string | null;
            customerId: string;
            agentId: string | null;
        }[];
    } & {
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
        level: string;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        timezone: string;
        companyDetails: string | null;
        adminId: string | null;
        source: string;
        level: string;
    }>;
}
