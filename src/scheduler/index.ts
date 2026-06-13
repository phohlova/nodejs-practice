import { validateTaskParams } from './validator';
import { createRepeatingTimer, cancelTimer } from './timer-manager';
import { TaskRegistry } from './task-registry';
import { handleTaskError } from './error-handler';
import { TaskNotFoundError } from '../errors/TaskNotFoundError';
const logger = require('../logger');

const registry = new TaskRegistry();

export const scheduleTask = (
    name: string,
    interval: number,
    task: () => void
): string => {
    validateTaskParams(name, interval, task);

    const wrappedTask = (): void => {
        try {
            task();
        } catch (error) {
            handleTaskError(name, error as Error);
        }
    };

    const timerId = createRepeatingTimer(interval, wrappedTask);
    registry.register(name, timerId);

    logger.info(`Task "${name}" registered (interval: ${interval}ms)`);

    return name;
};

export const cancelTask = (name: string): boolean => {
    if (!registry.has(name)) {
        throw new TaskNotFoundError(name);
    }

    const timerId = registry.unregister(name);
    cancelTimer(timerId!);
    logger.info(`Task "${name}" cancelled`);

    return true;
};

module.exports = { scheduleTask, cancelTask };