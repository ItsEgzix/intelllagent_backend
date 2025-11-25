import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TranslationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTranslationByCode(code: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { code },
    });

    if (!translation) {
      throw new NotFoundException(`Translation for locale "${code}" not found`);
    }

    return translation;
  }

  async upsertTranslation(
    code: string,
    data: Record<string, any>,
    nativeName?: string,
    englishName?: string,
  ) {
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
}
