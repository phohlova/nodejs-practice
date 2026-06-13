import { LogLevel } from './types';
const { formatLogMessage } = require('./formatter');
const { writeConsole } = require('./writer');
const { LEVELS, LEVEL_NAMES } = require('./levels');

let currentLevel: LogLevel = 'info';

const setLevel = (level: string): void => {
    if (LEVELS[level] !== undefined) {
        currentLevel = level as LogLevel;
        console.log(`[System] Log level changed to: ${level.toUpperCase()}`);
    }
    else {
        console.error(`[System] Invalid log level: ${level}. Use one of: ${LEVEL_NAMES.join(', ')}`);
    }
};

const log = (level: LogLevel, message: string, requestId: string | null = null): void => {

    if (LEVELS[level] < currentLevel) {
        return;
    }

    const formatted = formatLogMessage(level, message, requestId);
    writeConsole(level, formatted);
}

module.exports = {
    trace: (msg: string, id?: string | null) => log('trace', msg, id ?? null),
    debug: (msg: string, id?: string | null) => log('debug', msg, id ?? null),
    info: (msg: string, id?: string | null) => log('info', msg, id ?? null),
    warn: (msg: string, id?: string | null) => log('warn', msg, id ?? null),
    error: (msg: string, id?: string | null) => log('error', msg, id ?? null),
    setLevel: setLevel
};