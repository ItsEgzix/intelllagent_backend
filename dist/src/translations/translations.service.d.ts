import { PrismaService } from '../prisma/prisma.service';
export declare class TranslationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTranslationByCode(code: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/client").JsonValue;
        code: string;
        nativeName: string | null;
        englishName: string | null;
    }>;
    upsertTranslation(code: string, data: Record<string, any>, nativeName?: string, englishName?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/client").JsonValue;
        code: string;
        nativeName: string | null;
        englishName: string | null;
    }>;
    listTranslations(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        nativeName: string | null;
        englishName: string | null;
    }[]>;
}
