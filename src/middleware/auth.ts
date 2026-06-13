require('dotenv').config();
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
const logger = require('../logger');

interface JwtPayload {
    id: number;
    role: string;
    [key: string]: unknown;
}

declare global {
    namespace Express {
        interface Request {
        user?: JwtPayload;
        }
    }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn('No token provided', req.ip);
        return res.status(401).json({ error: 'Auth header required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.AUTH_SECRET as string) as JwtPayload;
        req.user = decoded;
        logger.debug('Token verified successfully', req.ip);
        next();
    } catch (err) {
        logger.warn(`Invalid token: ${(err as Error).message}`, req.ip);
        return res.status(403).json({ error: 'Invalid token' });
    }
    };

    module.exports = authenticateToken;