export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';
export type LevelValue = 0 | 1 | 2 | 3 | 4;
export type LevelsMap = Record<LogLevel, LevelValue>;