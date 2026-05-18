const validateTaskParams = (name, interval, task) => {

    if (typeof name !== 'string' || !name.trim()) {
        throw new Error('Task name must not be empty');
    }

    if (typeof interval !== 'number' || interval <= 0) {
        throw new Error('Interval must be a positive number');
    }

    if (typeof task !== 'function') {
        throw new Error('Task must be a function');
    }
};

module.exports = { validateTaskParams };