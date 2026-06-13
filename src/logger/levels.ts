import { LogLevel, LevelsMap } from './types';

export const LEVELS: LevelsMap = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
};

export const LEVEL_NAMES: LogLevel[] = Object.keys(LEVELS) as LogLevel[];

module.exports = { LEVELS, LEVEL_NAMES };