import './types/express';
import express, { Express, Request, Response, NextFunction } from 'express';
import Database from 'better-sqlite3';
import swaggerUi from 'swagger-ui-express';
import { initializeDatabase } from './database';
import { CurrencyRepository } from './repositories/CurrencyRepository';
import { ExchangeRateRepository } from './repositories/ExchangeRateRepository';
import { createCurrencyRoutes } from './routes/currencies';
import { createPriceRoutes } from './routes/prices';
import { AddressRepository } from './repositories/AddressRepository';
import { createAddressRoutes } from './routes/addresses';
const swaggerSpec = require('./config/swagger');
const authenticateToken = require('./middleware/auth');
const logger = require('./logger');

interface AppContext {
    app: Express;
    db: Database.Database;
    currencyRepo: CurrencyRepository;
    rateRepo: ExchangeRateRepository;
    addressRepo: AddressRepository;
}

export function createApp(testDb: Database.Database | null = null): AppContext {
    const app: Express = express();
    app.use(express.json());

    const db: Database.Database = testDb || initializeDatabase(process.env.DB_PATH || './data/app.sqlite');

    const currencyRepo = new CurrencyRepository(db);
    const rateRepo = new ExchangeRateRepository(db);
    const addressRepo = new AddressRepository(db);

    app.use('/currencies', createCurrencyRoutes(currencyRepo));
    app.use('/price', createPriceRoutes(rateRepo));
    app.use('/addresses', createAddressRoutes(addressRepo));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    app.get('/status', (req: Request, res: Response) => {
        res.status(200).send('ok');
    });

    app.get('/secure/data', authenticateToken, (req: Request, res: Response) => {
        res.json({ message: 'Secret data accessed', userId: req.user?.id || 'anonymous' });
    });

    app.use((err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
        logger.error(`Unhandled error: ${err.message}`, { path: req.path, stack: err.stack });
        const status = err.statusCode || 500;
        const message = process.env.NODE_ENV === 'development' ? err.message : 'Internal server error';
        res.status(status).json({ error: message });
    });

    return { app, db, currencyRepo, rateRepo, addressRepo };
}

module.exports = { createApp };