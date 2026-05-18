const AppError = require('./AppError');

class ConflictError extends AppError {
    constructor(resourse) {
        super(`${resource} already exists`, 409);
        this.name = 'ConflictError'
    }
}

module.exports = ConflictError;