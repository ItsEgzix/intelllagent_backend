export declare function readSourceTranslationFile(): any;
export declare function writeTranslationFile(languageCode: string, content: any): void;
export declare function translateJsonObject(obj: any, targetLanguage: string, apiKey: string): Promise<any>;
export declare function translateWebsite(targetLanguage: string, apiKey: string): Promise<{
    success: boolean;
    message: string;
    filePath?: string;
}>;
export declare function getLanguageDisplayNames(): Record<string, string>;
export declare function getLanguageDisplayName(languageCode: string): string;
export declare function updateLanguageRegistry(languageCode: string, languageName: string, languageNameEn: string): void;
export declare function getAvailableLanguageFiles(): string[];
