const logger = require('../logger');

export async function withRetry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isLast = attempt === retries;
        
            logger.warn(
                `Attempt ${attempt}/${retries} failed: ${(error as Error).message}`
            );
        
            if (isLast) {
                throw error;
            }

            await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
    }
    
    throw new Error('Retry logic failed unexpectedly');
}

module.exports = { withRetry };