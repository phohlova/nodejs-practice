import { AppError } from './AppError';

export class DuplicateError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409, true);
        this.name = 'DuplicateError';
    }
}
