const { validateTaskParams } = require('./validator');
const { createRepeatingTimer, cancelTimer } = require('./timer-manager');
const { TaskRegistry } = require('./task-registry');
const log = require('../logger');
const TaskNotFoundError = require('../errors/TaskNotFoundError');

const registry = new TaskRegistry();

const scheduleTask = (name, interval, task) => {
    validateTaskParams(name, interval, task);

    const wrappedTask = () => {
        try {
            task();
        } catch (error) {
            handleTaskError(name, error);
        }
    };

    const timerId = createRepeatingTimer(interval, wrappedTask);

    registry.register(name, timerId);

    log(`Task "${name}" registered (interval: ${interval}ms)`);
};

const cancelTask = (name) => {
    if (!registry.has(name)) {
        throw new TaskNotFoundError(name);
    }

    const timerId = registry.unregister(name);
    cancelTimer(timerId);
    log(`Task "${name}" cancelled`);

    return true;
};

module.exports = { scheduleTask, cancelTask };