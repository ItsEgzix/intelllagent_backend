"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRetryDelay = parseRetryDelay;
exports.isRateLimitError = isRateLimitError;
exports.isNetworkError = isNetworkError;
exports.retryWithBackoff = retryWithBackoff;
function parseRetryDelay(error) {
    try {
        if (error?.message) {
            const errorStr = error.message;
            const retryMatch = errorStr.match(/Please retry in ([\d.]+)s/i);
            if (retryMatch) {
                const seconds = parseFloat(retryMatch[1]);
                return Math.ceil(seconds * 1000);
            }
            try {
                const errorJson = JSON.parse(errorStr);
                if (errorJson?.error?.details) {
                    for (const detail of errorJson.error.details) {
                        if (detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo') {
                            const retryDelay = detail.retryDelay;
                            if (retryDelay) {
                                const seconds = parseFloat(retryDelay);
                                return Math.ceil(seconds * 1000);
                            }
                        }
                    }
                }
            }
            catch (parseError) {
            }
        }
    }
    catch (e) {
        console.error('Error parsing retry delay:', e);
    }
    return null;
}
function isRateLimitError(error) {
    if (!error)
        return false;
    const errorMsg = error.message?.toLowerCase() || '';
    const errorStr = String(error).toLowerCase();
    return (errorMsg.includes('429') ||
        errorMsg.includes('rate limit') ||
        errorMsg.includes('quota') ||
        errorMsg.includes('resource_exhausted') ||
        errorStr.includes('429') ||
        errorStr.includes('rate limit') ||
        errorStr.includes('quota') ||
        errorStr.includes('resource_exhausted') ||
        error?.name === 'ApiError' ||
        (error?.category && error.category.toLowerCase().includes('rate limit')));
}
function isNetworkError(error) {
    if (!(error instanceof Error))
        return false;
    const errorMsg = error.message.toLowerCase();
    return (errorMsg.includes('fetch failed') ||
        errorMsg.includes('econnrefused') ||
        errorMsg.includes('etimedout') ||
        errorMsg.includes('enotfound') ||
        errorMsg.includes('network'));
}
async function retryWithBackoff(fn, options = {}) {
    const { maxRetries = 5, initialDelay = 1000, maxDelay = 5 * 60 * 1000, context = '', } = options;
    const contextPrefix = context ? `${context}: ` : '';
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            const isNetwork = isNetworkError(error);
            const isRateLimit = isRateLimitError(error);
            if (attempt >= maxRetries - 1) {
                throw error;
            }
            if (isRateLimit) {
                const apiRetryDelay = parseRetryDelay(error);
                const delay = apiRetryDelay || initialDelay * Math.pow(2, attempt);
                const cappedDelay = Math.min(delay, maxDelay);
                console.warn(`${contextPrefix}Rate limit/quota error on attempt ${attempt + 1}/${maxRetries}, retrying in ${Math.ceil(cappedDelay / 1000)}s...`);
                await new Promise((resolve) => setTimeout(resolve, cappedDelay));
                continue;
            }
            if (isNetwork) {
                const delay = initialDelay * Math.pow(2, attempt);
                console.warn(`${contextPrefix}Network error on attempt ${attempt + 1}/${maxRetries}, retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}
//# sourceMappingURL=chatbot.utils.js.map