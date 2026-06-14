import { scheduleTask, cancelTask } from '../../src/scheduler/index';
import { TaskNotFoundError } from '../../src/errors/TaskNotFoundError';
const logger = require('../../src/logger');

jest.spyOn(logger, 'info').mockImplementation(() => { });
jest.spyOn(logger, 'warn').mockImplementation(() => { });

describe('Scheduler core', () => {
    afterEach(() => {
        try { cancelTask('myTask'); } catch { }
        try { cancelTask('toCancel'); } catch { }
    });

    test('scheduleTask returns task name and log registration', () => {
        const result = scheduleTask('myTask', 2000, () => { });

        expect(result).toBe('myTask');
        expect(logger.info).toHaveBeenCalledWith('Task "myTask" registered (interval: 2000ms)');
    });

    test('cancelTask cancel current task and log success', () => {
        scheduleTask('toCancel', 1000, () => { });

        const result = cancelTask('toCancel');

        expect(result).toBe(true);
        expect(logger.info).toHaveBeenCalledWith('Task "toCancel" cancelled');
    });

    test('cancelTask throws TaskNotFoundError for undefined task', () => {
        expect(() => cancelTask('nonExistent')).toThrow(TaskNotFoundError);
        expect(() => cancelTask('nonExistent')).toThrow('Task "nonExistent" not found');
    });
});