export interface RetryOptions {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    context?: string;
}
export declare function parseRetryDelay(error: any): number | null;
export declare function isRateLimitError(error: any): boolean;
export declare function isNetworkError(error: any): boolean;
export declare function retryWithBackoff<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>;
