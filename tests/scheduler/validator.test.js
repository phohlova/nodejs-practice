const { validateTaskParams } = require('../../src/scheduler/validator');
const ValidationError = require('../../src/errors/ValidationError');

describe('Scheduler Validator', () => {
    const validTask = () => {};

    test('validate data without errors', () => {
        expect(() => validateTaskParams('backup', 5000, validTask)).not.toThrow();
    });

    test('throws ValidationError for empty name', () => {
        expect(() => validateTaskParams('', 5000, validTask)).toThrow(ValidationError);
        expect(() => validateTaskParams('', 5000, validTask)).toThrow('Task name must not be empty');

        expect(() => validateTaskParams('   ', 5000, validTask)).toThrow(ValidationError);
    });

    test('throws ValidationError for incorrect interval', () => {
        expect(() => validateTaskParams('task', 0, validTask)).toThrow('Interval must be a positive number');
        expect(() => validateTaskParams('task', -100, validTask)).toThrow(ValidationError);
        expect(() => validateTaskParams('task', 'fast', validTask)).toThrow('Interval must be a positive number');
    });

    test('throws ValidationError if task is not function', () => {
        expect(() => validateTaskParams('task', 1000, 'not a function')).toThrow('Task must be a function');
        expect(() => validateTaskParams('task', 1000, null)).toThrow(ValidationError);
        expect(() => validateTaskParams('task', 1000, 123)).toThrow(ValidationError);
    });

});