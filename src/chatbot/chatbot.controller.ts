import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    try {
      const { message, sessionId } = sendMessageDto;
      return await this.chatbotService.sendMessage(message, sessionId);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to process message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sessions/:sessionId/history')
  async getSessionHistory(@Param('sessionId') sessionId: string) {
    try {
      const history = this.chatbotService.getSessionHistory(sessionId);
      if (!history) {
        return { error: 'Session not found' };
      }
      return { sessionId, history };
    } catch (error) {
      console.error('Error in getSessionHistory:', error);
      throw new HttpException(
        'Failed to get session history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearSession(@Param('sessionId') sessionId: string) {
    try {
      const deleted = this.chatbotService.clearSession(sessionId);
      if (!deleted) {
        return { error: 'Session not found' };
      }
      return { message: 'Session cleared' };
    } catch (error) {
      console.error('Error in clearSession:', error);
      throw new HttpException(
        'Failed to clear session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sessions')
  async getAllSessions() {
    try {
      return this.chatbotService.getAllSessions();
    } catch (error) {
      console.error('Error in getAllSessions:', error);
      throw new HttpException(
        'Failed to get sessions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
