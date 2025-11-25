import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get()
  async listTranslations() {
    return this.translationsService.listTranslations();
  }

  @Get(':code')
  async getTranslation(@Param('code') code: string) {
    return this.translationsService.getTranslationByCode(code);
  }

  @Put(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async upsertTranslation(
    @Param('code') code: string,
    @Body() updateTranslationDto: UpdateTranslationDto,
  ) {
    return this.translationsService.upsertTranslation(
      code,
      updateTranslationDto.data,
      updateTranslationDto.nativeName,
      updateTranslationDto.englishName,
    );
  }
}
