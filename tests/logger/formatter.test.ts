const { formatLogMessage } = require('../../src/logger/formatter');

describe('Logger formatter', () => {
    test('add level and ISO-timestamp', () => {
        const result = formatLogMessage('info', 'Server started');

        expect(result).toContain('[INFO]');
        expect(result).toContain('Server started');
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    });

    test('add requestId when it was given', () => {
        const result = formatLogMessage('error', 'DB connection failed', 'req-123');
        expect(result).toContain('[req-123]');
    });

    test('do not add [] for requestId if it is null', () => {
        const result = formatLogMessage('warn', 'Low memory', null);
        expect(result).not.toMatch(/\[null\]|\[undefined\]/);
    });

    test('work with different levels correctly', () => {
        expect(formatLogMessage('trace', 'msg')).toContain('[TRACE]');
        expect(formatLogMessage('debug', 'msg')).toContain('[DEBUG]');
        expect(formatLogMessage('warn', 'msg')).toContain('[WARN]');
        expect(formatLogMessage('error', 'msg')).toContain('[ERROR]');
    });
});
