const formatLogMessage = (level, message, requestId = null) => {
    const timestamp = new Date().toISOString();

    const levelStr = `[${level.toUpperCase()}]`;
    const requestIdStr = requestId ? ` [${requestId}]` : '';

    return `${timestamp} ${levelStr}${requestIdStr} ${message}`;
}

module.exports = { formatLogMessage };