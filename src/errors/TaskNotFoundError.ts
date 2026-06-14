const AppError = require('./AppError');

export class TaskNotFoundError extends AppError {
    constructor(taskName: string) {
        super(`Task "${taskName}" not found`, 404);
        this.name = 'TaskNotFoundError';
    }
}

module.exports = TaskNotFoundError;
module.exports.TaskNotFoundError = TaskNotFoundError;
