const AppError = require('./AppError');

export class ConflictError extends AppError {
    constructor(resource: string) {
        super(`${resource} already exists`, 409);
        this.name = 'ConflictError';
    }
}

module.exports = ConflictError;
module.exports.ConflictError = ConflictError;