import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto, req: any): Promise<{
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
    findAll(req: any): Promise<({
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
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateCustomerDto: UpdateCustomerDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
