import { Module, forwardRef } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { MeetingsModule } from '../meetings/meetings.module';
import { AgentsModule } from '../agents/agents.module';
import { TranslationsModule } from '../translations/translations.module';

@Module({
  imports: [
    forwardRef(() => MeetingsModule),
    forwardRef(() => AgentsModule),
    TranslationsModule,
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
