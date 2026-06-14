import { Request, Response, NextFunction } from 'express';

type ValidationRule = {
    field: string;
    required?: boolean;
    type?: 'string' | 'number' | 'email';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
};

export const validate = (rules: ValidationRule[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const data = { ...req.body, ...req.query, ...req.params };
        const errors: string[] = [];

        for (const rule of rules) {
            const value = data[rule.field];

            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`Field "${rule.field}" is required`);
                continue;
            }

            if (value !== undefined) {
                if (rule.type === 'string' && typeof value !== 'string') {
                    errors.push(`Field "${rule.field}" must be a string`);
                }

                if (rule.type === 'number') {
                    const numValue = Number(value);
                    if (isNaN(numValue)) {
                        errors.push(`Field "${rule.field}" must be a number`);
                    } else {
                        if (rule.min !== undefined && numValue < rule.min) {
                            errors.push(`Field "${rule.field}" must be at least ${rule.min}`);
                        }
                        if (rule.max !== undefined && numValue > rule.max) {
                            errors.push(`Field "${rule.field}" must be at most ${rule.max}`);
                        }
                    }
                }

                if (rule.type === 'string' && typeof value === 'string') {
                    if (rule.minLength !== undefined && value.length < rule.minLength) {
                        errors.push(`Field "${rule.field}" must be at least ${rule.minLength} characters`);
                    }
                    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
                        errors.push(`Field "${rule.field}" must be at most ${rule.maxLength} characters`);
                    }
                }
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors 
            });
        }
        next();
    };
};

module.exports = { validate };