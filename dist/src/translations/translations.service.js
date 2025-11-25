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
exports.TranslationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TranslationsService = class TranslationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTranslationByCode(code) {
        const translation = await this.prisma.translation.findUnique({
            where: { code },
        });
        if (!translation) {
            throw new common_1.NotFoundException(`Translation for locale "${code}" not found`);
        }
        return translation;
    }
    async upsertTranslation(code, data, nativeName, englishName) {
        const translation = await this.prisma.translation.upsert({
            where: { code },
            update: {
                data,
                ...(nativeName !== undefined && { nativeName }),
                ...(englishName !== undefined && { englishName }),
            },
            create: {
                code,
                data,
                nativeName: nativeName || null,
                englishName: englishName || null,
            },
        });
        return translation;
    }
    async listTranslations() {
        return this.prisma.translation.findMany({
            orderBy: { code: 'asc' },
            select: {
                id: true,
                code: true,
                nativeName: true,
                englishName: true,
                updatedAt: true,
                createdAt: true,
            },
        });
    }
};
exports.TranslationsService = TranslationsService;
exports.TranslationsService = TranslationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TranslationsService);
//# sourceMappingURL=translations.service.js.map