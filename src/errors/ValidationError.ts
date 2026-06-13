const AppError = require('./AppError');

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

module.exports = ValidationError;