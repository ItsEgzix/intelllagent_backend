import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailsModule } from './emails/emails.module';
import { MeetingsModule } from './meetings/meetings.module';
import { AuthModule } from './auth/auth.module';
import { AgentsModule } from './agents/agents.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { CustomersModule } from './customers/customers.module';
import { UploadsController } from './uploads/uploads.controller';
import { TranslationsModule } from './translations/translations.module';

@Module({
  imports: [
    EmailsModule,
    MeetingsModule,
    AuthModule,
    AgentsModule,
    ChatbotModule,
    CustomersModule,
    TranslationsModule,
  ],
  controllers: [AppController, UploadsController],
  providers: [AppService],
})
export class AppModule {}
