const AppError = require('./AppError');

export class DatabaseError extends AppError {
    constructor(message: string = 'Database operation failed') {
        super(message, 500, false); 
        this.name = 'DatabaseError';
    }
}

module.exports = DatabaseError;