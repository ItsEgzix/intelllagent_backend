import { TranslationsService } from './translations.service';
import { UpdateTranslationDto } from './dto/update-translation.dto';
export declare class TranslationsController {
    private readonly translationsService;
    constructor(translationsService: TranslationsService);
    listTranslations(): Promise<{
        nativeName: string | null;
        englishName: string | null;
        id: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTranslation(code: string): Promise<{
        data: import("@prisma/client/runtime/client").JsonValue;
        nativeName: string | null;
        englishName: string | null;
        id: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    upsertTranslation(code: string, updateTranslationDto: UpdateTranslationDto): Promise<{
        data: import("@prisma/client/runtime/client").JsonValue;
        nativeName: string | null;
        englishName: string | null;
        id: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
