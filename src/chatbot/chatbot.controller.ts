import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    const { message, sessionId } = sendMessageDto;
    return this.chatbotService.sendMessage(message, sessionId);
  }

  @Get('sessions/:sessionId/history')
  async getSessionHistory(@Param('sessionId') sessionId: string) {
    const history = this.chatbotService.getSessionHistory(sessionId);
    if (!history) {
      return { error: 'Session not found' };
    }
    return { sessionId, history };
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearSession(@Param('sessionId') sessionId: string) {
    const deleted = this.chatbotService.clearSession(sessionId);
    if (!deleted) {
      return { error: 'Session not found' };
    }
    return { message: 'Session cleared' };
  }

  @Get('sessions')
  async getAllSessions() {
    return this.chatbotService.getAllSessions();
  }
}

