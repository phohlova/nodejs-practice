const AppError = require('./AppError');

class ConflictError extends AppError {
    constructor(resource) {
        super(`${resource} already exists`, 409);
        this.name = 'ConflictError'
    }
}

module.exports = ConflictError;