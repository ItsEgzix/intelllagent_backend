export declare const GEMINI_CONFIG: {
    readonly MODEL: string;
    readonly API_KEY: string | undefined;
    readonly MIN_REQUEST_INTERVAL: number;
    readonly RETRY: {
        readonly MAX_RETRIES: number;
        readonly INITIAL_DELAY: number;
        readonly MAX_DELAY: number;
    };
    readonly SESSION: {
        readonly MAX_HISTORY_LENGTH: number;
        readonly MAX_ITERATIONS: number;
    };
};
export declare function validateGeminiConfig(): void;
