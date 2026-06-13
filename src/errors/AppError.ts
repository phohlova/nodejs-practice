export class AppError extends Error {
    public readonly statusCode: number;
    public readonly status: string;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational: boolean = true) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

module.exports = AppError;