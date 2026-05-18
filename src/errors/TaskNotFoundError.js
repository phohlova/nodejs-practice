const AppError = require('./AppError');

class TaskNotFoundError extends AppError {
    constructor(taskName) {
        super(`Task "${taskName}" not found`, 404);
        this.name = 'TaskNotFoundError';
    }
}

module.exports = TaskNotFoundError;