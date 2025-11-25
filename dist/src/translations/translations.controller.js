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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationsController = void 0;
const common_1 = require("@nestjs/common");
const translations_service_1 = require("./translations.service");
const update_translation_dto_1 = require("./dto/update-translation.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let TranslationsController = class TranslationsController {
    translationsService;
    constructor(translationsService) {
        this.translationsService = translationsService;
    }
    async listTranslations() {
        return this.translationsService.listTranslations();
    }
    async getTranslation(code) {
        return this.translationsService.getTranslationByCode(code);
    }
    async upsertTranslation(code, updateTranslationDto) {
        return this.translationsService.upsertTranslation(code, updateTranslationDto.data, updateTranslationDto.nativeName, updateTranslationDto.englishName);
    }
};
exports.TranslationsController = TranslationsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TranslationsController.prototype, "listTranslations", null);
__decorate([
    (0, common_1.Get)(':code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TranslationsController.prototype, "getTranslation", null);
__decorate([
    (0, common_1.Put)(':code'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('superadmin'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_translation_dto_1.UpdateTranslationDto]),
    __metadata("design:returntype", Promise)
], TranslationsController.prototype, "upsertTranslation", null);
exports.TranslationsController = TranslationsController = __decorate([
    (0, common_1.Controller)('translations'),
    __metadata("design:paramtypes", [translations_service_1.TranslationsService])
], TranslationsController);
//# sourceMappingURL=translations.controller.js.map