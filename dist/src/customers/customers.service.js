"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomersService = class CustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCustomerDto, adminId) {
        const existingCustomer = await this.prisma.customer.findUnique({
            where: { email: createCustomerDto.email },
        });
        if (existingCustomer) {
            throw new common_1.BadRequestException('Customer with this email already exists');
        }
        return this.prisma.customer.create({
            data: {
                ...createCustomerDto,
                adminId,
                source: 'admin',
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
    async findAll(adminId) {
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
    async findOne(id, adminId) {
        const where = { id };
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
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async update(id, updateCustomerDto, adminId) {
        const where = { id };
        if (adminId) {
            where.adminId = adminId;
        }
        const existingCustomer = await this.prisma.customer.findFirst({
            where,
        });
        if (!existingCustomer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        if (updateCustomerDto.email &&
            updateCustomerDto.email !== existingCustomer.email) {
            const emailConflict = await this.prisma.customer.findUnique({
                where: { email: updateCustomerDto.email },
            });
            if (emailConflict && emailConflict.id !== id) {
                throw new common_1.BadRequestException('Customer with this email already exists');
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
    async remove(id, adminId) {
        const where = { id };
        if (adminId) {
            where.adminId = adminId;
        }
        const customer = await this.prisma.customer.findFirst({
            where,
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return this.prisma.customer.delete({
            where: { id },
        });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map