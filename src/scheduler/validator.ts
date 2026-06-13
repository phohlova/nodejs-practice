import { ValidationError } from '../errors/ValidationError';

export const validateTaskParams = (
    name: string,
    interval: number,
    task: () => void
): void => {
    if (typeof name !== 'string' || !name.trim()) {
        throw new ValidationError('Task name must not be empty');
    }

    if (typeof interval !== 'number' || interval <= 0) {
        throw new ValidationError('Interval must be a positive number');
    }

    if (typeof task !== 'function') {
        throw new ValidationError('Task must be a function');
    }
};

module.exports = { validateTaskParams };