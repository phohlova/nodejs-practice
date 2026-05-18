const { formatLogMessage } = require('./formatter');
const { writeConsole } = require('./writer');
const config = require('../config');
const { LEVELS, LEVEL_NAMES } = require('./levels');

let currentLevel = LEVELS.info;

const setLevel = (level) => {
    if (LEVELS[level] !== undefined) {
        currentLevel = LEVELS[level];
        console.log(`[System] Log level changed to: ${level.toUpperCase()}`);
    }
    else {
        console.error(`[System] Invalid log level: ${level}. Use one of: ${LEVEL_NAMES.join(', ')}`);
    }
};

const log = (level, message, requestId = null) => {

    if (LEVELS[level] < currentLevel) {
        return;
    }

    const formatted = formatLogMessage(level, message, requestId);
    writeConsole(level, formatted);
}

module.exports = {
    trace: (msg, id) => log('trace', msg, id),
    debug: (msg, id) => log('debug', msg, id),
    info: (msg, id) => log('info', msg, id),
    warn: (msg, id) => log('warn', msg, id),
    error: (msg, id) => log('error', msg, id),
    setLevel: setLevel
};