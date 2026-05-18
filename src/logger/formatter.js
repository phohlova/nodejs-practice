const formatLogMessage = (appName, message) => {
    const timestamp = new Date().toISOString();
    return `[${appName}] [${timestamp}] ${message}`;
}

module.exports = { formatLogMessage };