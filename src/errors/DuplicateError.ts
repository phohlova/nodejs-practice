const AppError = require('./AppError');

export class DuplicateError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409, true);
        this.name = 'DuplicateError';
    }
}

module.exports = DuplicateError;