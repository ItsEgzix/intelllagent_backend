import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailsModule } from './newsletter/emails.module';
import { MeetingsModule } from './meetings/meetings.module';
import { AuthModule } from './auth/auth.module';
import { AgentsModule } from './agents/agents.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { CustomersModule } from './customers/customers.module';
import { TranslationsModule } from './translations/translations.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    EmailsModule,
    MeetingsModule,
    AuthModule,
    AgentsModule,
    ChatbotModule,
    CustomersModule,
    TranslationsModule,
    CloudinaryModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
