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
exports.ChatbotController = void 0;
const common_1 = require("@nestjs/common");
const chatbot_service_1 = require("./chatbot.service");
const send_message_dto_1 = require("./dto/send-message.dto");
let ChatbotController = class ChatbotController {
    chatbotService;
    constructor(chatbotService) {
        this.chatbotService = chatbotService;
    }
    async sendMessage(sendMessageDto) {
        const { message, sessionId } = sendMessageDto;
        return this.chatbotService.sendMessage(message, sessionId);
    }
    async getSessionHistory(sessionId) {
        const history = this.chatbotService.getSessionHistory(sessionId);
        if (!history) {
            return { error: 'Session not found' };
        }
        return { sessionId, history };
    }
    async clearSession(sessionId) {
        const deleted = this.chatbotService.clearSession(sessionId);
        if (!deleted) {
            return { error: 'Session not found' };
        }
        return { message: 'Session cleared' };
    }
    async getAllSessions() {
        return this.chatbotService.getAllSessions();
    }
};
exports.ChatbotController = ChatbotController;
__decorate([
    (0, common_1.Post)('message'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('sessions/:sessionId/history'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getSessionHistory", null);
__decorate([
    (0, common_1.Delete)('sessions/:sessionId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "clearSession", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getAllSessions", null);
exports.ChatbotController = ChatbotController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chatbot_service_1.ChatbotService])
], ChatbotController);
//# sourceMappingURL=chatbot.controller.js.map