"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEMINI_CONFIG = void 0;
exports.validateGeminiConfig = validateGeminiConfig;
exports.GEMINI_CONFIG = {
    MODEL: process.env.GEMINI_MODEL || 'gemini-pro',
    API_KEY: process.env.GEMINI_API_KEY,
    MIN_REQUEST_INTERVAL: parseInt(process.env.GEMINI_MIN_REQUEST_INTERVAL || '1000', 10),
    RETRY: {
        MAX_RETRIES: parseInt(process.env.GEMINI_MAX_RETRIES || '5', 10),
        INITIAL_DELAY: parseInt(process.env.GEMINI_INITIAL_DELAY || '1000', 10),
        MAX_DELAY: 5 * 60 * 1000,
    },
    SESSION: {
        MAX_HISTORY_LENGTH: parseInt(process.env.GEMINI_MAX_HISTORY_LENGTH || '20', 10),
        MAX_ITERATIONS: parseInt(process.env.GEMINI_MAX_ITERATIONS || '5', 10),
    },
};
function validateGeminiConfig() {
    if (!exports.GEMINI_CONFIG.API_KEY) {
        console.warn('GEMINI_API_KEY not found in environment variables');
    }
}
//# sourceMappingURL=chatbot.config.js.map