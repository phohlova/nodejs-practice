const ValidationError = require("../errors/ValidationError");

const validateTaskParams = (name, interval, task) => {

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