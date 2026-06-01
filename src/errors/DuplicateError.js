const AppError = require('./AppError');

class DuplicateError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409, true);
    }
}

module.exports = DuplicateError;