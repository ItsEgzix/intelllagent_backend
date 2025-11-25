import { TranslationsService } from './translations.service';
import { UpdateTranslationDto } from './dto/update-translation.dto';
export declare class TranslationsController {
    private readonly translationsService;
    constructor(translationsService: TranslationsService);
    listTranslations(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        nativeName: string | null;
        englishName: string | null;
    }[]>;
    getTranslation(code: string): Promise<{
        data: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        nativeName: string | null;
        englishName: string | null;
    }>;
    upsertTranslation(code: string, updateTranslationDto: UpdateTranslationDto): Promise<{
        data: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        nativeName: string | null;
        englishName: string | null;
    }>;
}
