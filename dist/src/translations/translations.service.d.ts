import { PrismaService } from '../prisma/prisma.service';
export declare class TranslationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTranslationByCode(code: string): Promise<{
        id: string;
        code: string;
        data: import("@prisma/client/runtime/client").JsonValue;
        nativeName: string | null;
        englishName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    upsertTranslation(code: string, data: Record<string, any>, nativeName?: string, englishName?: string): Promise<{
        id: string;
        code: string;
        data: import("@prisma/client/runtime/client").JsonValue;
        nativeName: string | null;
        englishName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listTranslations(): Promise<{
        id: string;
        code: string;
        nativeName: string | null;
        englishName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
