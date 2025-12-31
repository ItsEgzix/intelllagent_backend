/**
 * Configuration constants for Gemini AI chatbot
 * All model names, API settings, and retry configurations in one place
 */

export const GEMINI_CONFIG = {
  // Model configuration
  // Valid models: 'gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'
  MODEL: process.env.GEMINI_MODEL || 'gemini-pro',

  // API configuration
  API_KEY: process.env.GEMINI_API_KEY,

  // Request throttling (milliseconds between requests)
  MIN_REQUEST_INTERVAL: parseInt(
    process.env.GEMINI_MIN_REQUEST_INTERVAL || '1000',
    10,
  ),

  // Retry configuration
  RETRY: {
    MAX_RETRIES: parseInt(process.env.GEMINI_MAX_RETRIES || '5', 10),
    INITIAL_DELAY: parseInt(process.env.GEMINI_INITIAL_DELAY || '1000', 10), // milliseconds
    MAX_DELAY: 5 * 60 * 1000, // 5 minutes in milliseconds
  },

  // Session configuration
  SESSION: {
    MAX_HISTORY_LENGTH: parseInt(
      process.env.GEMINI_MAX_HISTORY_LENGTH || '20',
      10,
    ),
    MAX_ITERATIONS: parseInt(process.env.GEMINI_MAX_ITERATIONS || '5', 10),
  },
} as const;

/**
 * Validate that required configuration is present
 */
export function validateGeminiConfig(): void {
  if (!GEMINI_CONFIG.API_KEY) {
    console.warn('GEMINI_API_KEY not found in environment variables');
  }
}
