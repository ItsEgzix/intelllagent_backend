import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenAI } from '@google/genai';

/**
 * Translation utilities for the chatbot
 */

interface TranslationOptions {
  sourceLanguage?: string;
  targetLanguage: string;
  apiKey: string;
}

/**
 * Get the path to the messages directory
 */
function getMessagesDirectory(): string {
  // First, try environment variable (for production deployments)
  if (process.env.MESSAGES_DIRECTORY) {
    const envPath = process.env.MESSAGES_DIRECTORY;
    if (fs.existsSync(envPath)) {
      return envPath;
    }
  }

  // Try multiple possible paths
  const possiblePaths = [
    path.join(process.cwd(), '..', 'intellagent-webapp', 'messages'),
    path.join(process.cwd(), 'intellagent-webapp', 'messages'),
    path.join(process.cwd(), 'messages'),
    path.join(__dirname, '..', '..', '..', 'intellagent-webapp', 'messages'),
    // For Vercel/production: try absolute path from root
    path.join(process.cwd(), '..', 'messages'),
    // For monorepo structure
    path.join(process.cwd(), '..', '..', 'intellagent-webapp', 'messages'),
  ];

  for (const possiblePath of possiblePaths) {
    try {
      if (fs.existsSync(possiblePath)) {
        return possiblePath;
      }
    } catch (error) {
      // Continue to next path if this one fails
      continue;
    }
  }

  // If no path found, try to create messages directory in current working directory
  const fallbackPath = path.join(process.cwd(), 'messages');
  try {
    if (!fs.existsSync(fallbackPath)) {
      fs.mkdirSync(fallbackPath, { recursive: true });
    }
    return fallbackPath;
  } catch (error) {
    throw new Error(
      `Messages directory not found. Tried paths: ${possiblePaths.join(', ')}. Please set MESSAGES_DIRECTORY environment variable or ensure the messages folder exists. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Read the English (source) translation file
 */
export function readSourceTranslationFile(): any {
  const messagesDir = getMessagesDirectory();
  const sourcePath = path.join(messagesDir, 'en.json');

  if (!fs.existsSync(sourcePath)) {
    throw new Error('Source translation file (en.json) not found');
  }

  const content = fs.readFileSync(sourcePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Write translated content to a target language file
 * Tries to write via frontend API first (for production), falls back to direct file write
 */
export async function writeTranslationFile(
  languageCode: string,
  content: any,
): Promise<void> {
  // First, try to write via frontend API (for production deployments)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const apiSecret = process.env.TRANSLATION_API_SECRET;

  if (frontendUrl && apiSecret) {
    try {
      const response = await fetch(
        `${frontendUrl}/api/languages/${languageCode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiSecret}`,
          },
          body: JSON.stringify(content),
        },
      );

      if (response.ok) {
        console.log(`Translation file for ${languageCode} saved via API`);
        return;
      } else {
        console.warn(
          `Failed to save translation via API (${response.status}), falling back to file system`,
        );
      }
    } catch (error) {
      console.warn(
        `Error saving translation via API, falling back to file system:`,
        error,
      );
    }
  }

  // Fallback to direct file write (for local development or if API fails)
  try {
    const messagesDir = getMessagesDirectory();
    const targetPath = path.join(messagesDir, `${languageCode}.json`);

    // Ensure directory exists
    if (!fs.existsSync(messagesDir)) {
      fs.mkdirSync(messagesDir, { recursive: true });
    }

    // Write the translated content
    fs.writeFileSync(targetPath, JSON.stringify(content, null, 2), 'utf-8');
    console.log(`Translation file for ${languageCode} saved to file system`);
  } catch (error) {
    throw new Error(
      `Failed to write translation file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Translate a JSON object structure using Gemini API
 */
export async function translateJsonObject(
  obj: any,
  targetLanguage: string,
  apiKey: string,
): Promise<any> {
  const genAI = new GoogleGenAI({ apiKey });

  // Convert object to string for translation
  const jsonString = JSON.stringify(obj, null, 2);

  const prompt = `You are a professional translator. Translate the following JSON object to ${targetLanguage}. 

IMPORTANT RULES:
1. Keep the exact same JSON structure and keys
2. Only translate the VALUES, never the keys
3. Maintain the same data types (strings, arrays, objects)
4. For nested objects, translate all string values recursively
5. Preserve any special characters, formatting, or placeholders
6. Return ONLY the translated JSON, no explanations

JSON to translate:
${jsonString}`;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: {
          parts: [
            {
              text: 'You are a professional translator. Translate JSON content while preserving structure and keys.',
            },
          ],
        },
      },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // Extract text from response (similar to chatbot.service.ts)
    let translatedText = '';
    if (response?.candidates && response.candidates[0]?.content?.parts) {
      const parts = response.candidates[0].content.parts;
      translatedText = parts.map((part: any) => part.text || '').join('');
    } else if ((response as any)?.text) {
      translatedText = (response as any).text;
    }

    if (!translatedText) {
      throw new Error('No translation response received from API');
    }

    // Try to extract JSON from the response (in case there's extra text)
    const jsonMatch = translatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // If no match, try parsing the whole response
    return JSON.parse(translatedText);
  } catch (error) {
    console.error('Error translating JSON:', error);
    throw new Error(
      `Failed to translate: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Translate the entire website to a target language
 */
export async function translateWebsite(
  targetLanguage: string,
  apiKey: string,
): Promise<{ success: boolean; message: string; filePath?: string }> {
  try {
    // Validate target language code
    if (!targetLanguage || targetLanguage.length < 2) {
      return {
        success: false,
        message:
          'Invalid language code. Please provide a valid ISO 639-1 language code (e.g., "fr", "es", "de").',
      };
    }

    // Read source translation
    const sourceTranslations = readSourceTranslationFile();

    // Translate the content
    const translatedContent = await translateJsonObject(
      sourceTranslations,
      targetLanguage,
      apiKey,
    );

    // Write the translated file (now async)
    await writeTranslationFile(targetLanguage, translatedContent);

    // Update the language registry (now async)
    const languageName = getLanguageDisplayName(targetLanguage);
    await updateLanguageRegistry(targetLanguage, languageName, languageName);

    const messagesDir = getMessagesDirectory();
    const filePath = path.join(messagesDir, `${targetLanguage}.json`);

    return {
      success: true,
      message: `Website successfully translated to ${targetLanguage}. Translation file created at ${filePath}`,
      filePath,
    };
  } catch (error) {
    console.error('Error translating website:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to translate website. Please try again.',
    };
  }
}

/**
 * Get language display name mapping
 */
export function getLanguageDisplayNames(): Record<string, string> {
  // Common language codes and their display names
  const languageNames: Record<string, string> = {
    en: 'English',
    zh: '中文',
    ms: 'Bahasa Melayu',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',
    ja: '日本語',
    ko: '한국어',
    ar: 'العربية',
    hi: 'हिन्दी',
    pt: 'Português',
    ru: 'Русский',
    it: 'Italiano',
    th: 'ไทย',
    vi: 'Tiếng Việt',
    id: 'Bahasa Indonesia',
    tr: 'Türkçe',
    pl: 'Polski',
    nl: 'Nederlands',
  };

  return languageNames;
}

/**
 * Get display name for a language code
 */
export function getLanguageDisplayName(languageCode: string): string {
  const names = getLanguageDisplayNames();
  return names[languageCode] || languageCode.toUpperCase();
}

/**
 * Update the language registry file in the frontend
 * This adds a new language to the registry so it appears in the dropdown
 */
interface LanguageRegistryEntry {
  code: string;
  name: string;
  nameEn: string;
}

const DEFAULT_FRONTEND_LANGUAGES: LanguageRegistryEntry[] = [
  { code: 'en', name: 'English', nameEn: 'English' },
  { code: 'zh', name: '中文', nameEn: 'Chinese' },
  { code: 'ms', name: 'Bahasa Melayu', nameEn: 'Malay' },
];

export async function updateLanguageRegistry(
  languageCode: string,
  languageName: string,
  languageNameEn: string,
): Promise<void> {
  try {
    const normalizedEntry: LanguageRegistryEntry = {
      code: languageCode,
      name: languageName || languageCode.toUpperCase(),
      nameEn: languageNameEn || languageName || languageCode.toUpperCase(),
    };

    // First, try to update via frontend API (for production deployments)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const apiSecret = process.env.TRANSLATION_API_SECRET;

    if (frontendUrl && apiSecret) {
      try {
        // Fetch current registry
        const currentRegistryResponse = await fetch(
          `${frontendUrl}/api/languages/registry`,
        );
        let currentRegistry: LanguageRegistryEntry[] = [];

        if (currentRegistryResponse.ok) {
          const data = await currentRegistryResponse.json();
          if (Array.isArray(data)) {
            currentRegistry = data;
          }
        }

        // Merge with default languages
        if (currentRegistry.length === 0) {
          currentRegistry = [...DEFAULT_FRONTEND_LANGUAGES];
        }

        const registryMap = new Map<string, LanguageRegistryEntry>();
        currentRegistry.forEach((entry) => registryMap.set(entry.code, entry));
        DEFAULT_FRONTEND_LANGUAGES.forEach((entry) => {
          if (!registryMap.has(entry.code)) {
            registryMap.set(entry.code, entry);
          }
        });
        registryMap.set(normalizedEntry.code, normalizedEntry);

        const updatedRegistry = Array.from(registryMap.values());

        // Update via API
        const updateResponse = await fetch(
          `${frontendUrl}/api/languages/registry`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiSecret}`,
            },
            body: JSON.stringify(updatedRegistry),
          },
        );

        if (updateResponse.ok) {
          console.log(
            `Language ${languageCode} added to runtime registry via API successfully.`,
          );
          return;
        } else {
          console.warn(
            `Failed to update registry via API (${updateResponse.status}), falling back to file system`,
          );
        }
      } catch (error) {
        console.warn(
          `Error updating registry via API, falling back to file system:`,
          error,
        );
      }
    }

    // Fallback to direct file write (for local development or if API fails)
    const messagesDir = getMessagesDirectory();
    const registryPath = path.join(messagesDir, 'languages.json');

    let registry: LanguageRegistryEntry[] = [];

    if (fs.existsSync(registryPath)) {
      try {
        const raw = fs.readFileSync(registryPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          registry = parsed.filter(
            (entry): entry is LanguageRegistryEntry =>
              !!entry &&
              typeof entry === 'object' &&
              typeof entry.code === 'string' &&
              typeof entry.name === 'string' &&
              typeof entry.nameEn === 'string',
          );
        }
      } catch (error) {
        console.warn(
          'Unable to parse existing language registry, recreating file.',
          error,
        );
      }
    }

    if (registry.length === 0) {
      registry = [...DEFAULT_FRONTEND_LANGUAGES];
    }

    const registryMap = new Map<string, LanguageRegistryEntry>();
    registry.forEach((entry) => registryMap.set(entry.code, entry));
    DEFAULT_FRONTEND_LANGUAGES.forEach((entry) => {
      if (!registryMap.has(entry.code)) {
        registryMap.set(entry.code, entry);
      }
    });
    registryMap.set(normalizedEntry.code, normalizedEntry);

    const updatedRegistry = Array.from(registryMap.values());
    fs.writeFileSync(
      registryPath,
      JSON.stringify(updatedRegistry, null, 2),
      'utf-8',
    );
    console.log(
      `Language ${languageCode} added to runtime registry successfully.`,
    );
  } catch (error) {
    console.error('Error updating language registry:', error);
    // Don't throw - this is not critical, user can add manually
  }
}

/**
 * Get list of available language files
 */
export function getAvailableLanguageFiles(): string[] {
  try {
    const messagesDir = getMessagesDirectory();
    const files = fs.readdirSync(messagesDir);
    const languageFiles = files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''))
      .filter((code) => code.length === 2); // ISO 639-1 codes are 2 letters

    return languageFiles;
  } catch (error) {
    console.error('Error reading language files:', error);
    return ['en', 'zh', 'ms']; // Fallback to known languages
  }
}
