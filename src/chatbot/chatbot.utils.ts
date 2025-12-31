/**
 * Shared utility functions for Gemini AI chatbot
 * Reusable retry logic, error parsing, and rate limit handling
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  context?: string; // For logging context (e.g., "Translation", "Chat")
}

/**
 * Parse retry delay from API error response
 */
export function parseRetryDelay(error: any): number | null {
  try {
    if (error?.message) {
      const errorStr = error.message;

      // Look for "Please retry in X.XXs" pattern
      const retryMatch = errorStr.match(/Please retry in ([\d.]+)s/i);
      if (retryMatch) {
        const seconds = parseFloat(retryMatch[1]);
        return Math.ceil(seconds * 1000); // Convert to milliseconds
      }

      // Try to parse as JSON to get retryDelay from RetryInfo
      try {
        const errorJson = JSON.parse(errorStr);
        if (errorJson?.error?.details) {
          for (const detail of errorJson.error.details) {
            if (
              detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
            ) {
              const retryDelay = detail.retryDelay;
              if (retryDelay) {
                // Convert seconds to milliseconds
                const seconds = parseFloat(retryDelay);
                return Math.ceil(seconds * 1000);
              }
            }
          }
        }
      } catch (parseError) {
        // Not JSON, continue with other parsing methods
      }
    }
  } catch (e) {
    console.error('Error parsing retry delay:', e);
  }
  return null;
}

/**
 * Check if error is a rate limit/quota error
 */
export function isRateLimitError(error: any): boolean {
  if (!error) return false;

  const errorMsg = error.message?.toLowerCase() || '';
  const errorStr = String(error).toLowerCase();

  return (
    errorMsg.includes('429') ||
    errorMsg.includes('rate limit') ||
    errorMsg.includes('quota') ||
    errorMsg.includes('resource_exhausted') ||
    errorStr.includes('429') ||
    errorStr.includes('rate limit') ||
    errorStr.includes('quota') ||
    errorStr.includes('resource_exhausted') ||
    error?.name === 'ApiError' ||
    (error?.category && error.category.toLowerCase().includes('rate limit'))
  );
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  if (!(error instanceof Error)) return false;

  const errorMsg = error.message.toLowerCase();
  return (
    errorMsg.includes('fetch failed') ||
    errorMsg.includes('econnrefused') ||
    errorMsg.includes('etimedout') ||
    errorMsg.includes('enotfound') ||
    errorMsg.includes('network')
  );
}

/**
 * Retry helper for API calls with exponential backoff
 * Handles both network errors and rate limit errors
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = 5,
    initialDelay = 1000,
    maxDelay = 5 * 60 * 1000, // 5 minutes default
    context = '',
  } = options;

  const contextPrefix = context ? `${context}: ` : '';

  let lastError: Error | unknown;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if it's a network error
      const isNetwork = isNetworkError(error);

      // Check if it's a rate limit error
      const isRateLimit = isRateLimitError(error);

      // Don't retry on last attempt
      if (attempt >= maxRetries - 1) {
        throw error;
      }

      // Handle rate limit errors with API-specified delay or exponential backoff
      if (isRateLimit) {
        const apiRetryDelay = parseRetryDelay(error);
        const delay = apiRetryDelay || initialDelay * Math.pow(2, attempt);

        // Cap delay at maxDelay
        const cappedDelay = Math.min(delay, maxDelay);

        console.warn(
          `${contextPrefix}Rate limit/quota error on attempt ${attempt + 1}/${maxRetries}, retrying in ${Math.ceil(cappedDelay / 1000)}s...`,
        );

        await new Promise((resolve) => setTimeout(resolve, cappedDelay));
        continue;
      }

      // Handle network errors with exponential backoff
      if (isNetwork) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.warn(
          `${contextPrefix}Network error on attempt ${attempt + 1}/${maxRetries}, retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // For other errors, don't retry
      throw error;
    }
  }
  throw lastError;
}
