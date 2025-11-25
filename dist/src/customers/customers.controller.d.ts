import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto, req: any): Promise<{
        admin: {
            email: string;
            id: string;
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
        email: string;
        id: string;
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
            email: string;
            id: string;
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
        email: string;
        id: string;
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
            email: string;
            id: string;
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
        email: string;
        id: string;
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
            email: string;
            id: string;
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
        email: string;
        id: string;
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
        email: string;
        id: string;
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
