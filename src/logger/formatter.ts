import { LogLevel } from './types';

const formatLogMessage = (
    level: LogLevel,
    message: string,
    requestId: string | null = null
): string => {
    const timestamp = new Date().toISOString();
    const levelStr = `[${level.toUpperCase()}]`;
    const requestIdStr = requestId ? ` [${requestId}]` : '';

    return `${timestamp} ${levelStr}${requestIdStr} ${message}`;
};

module.exports = { formatLogMessage };