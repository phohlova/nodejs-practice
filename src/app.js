const express = require('express');
const { initializeDatabase } = require('./database');
const { scheduleTask } = require('./scheduler');
const CurrencyRepository = require('./repositories/CurrencyRepository');
const { createCurrencyRoutes } = require('./routes/currencies');
const swaggerSpec = require('./config/swagger');
const swaggerUi = require('swagger-ui-express');
const authenticateToken = require('./middleware/auth');
const logger = require('./logger');
const config = require('./config');

function createApp(testDb = null) {
    const app = express();
    app.use(express.json());

    const db = testDb || initializeDatabase(process.env.DB_PATH || './data/app.sqlite');

    const currencyRepo = new CurrencyRepository(db);

    app.use('/currencies', createCurrencyRoutes(currencyRepo));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/status', (req, res) => res.status(200).send('ok'));

    app.get('/secure/data', authenticateToken, (req, res) => {
        res.json({ message: 'Secret data accessed', userId: req.user?.id || 'anonymous' });
    });

    app.use((err, req, res, next) => {
        logger.error(`Unhandled error: ${err.message}`, { path: req.path, stack: err.stack });
        const status = err.statusCode || 500;
        const message = process.env.NODE_ENV === 'development' ? err.message : 'Internal server error';
        res.status(status).json({ error: message });
    });

    return { app, db, currencyRepo };
}

const initApp = () => {
    logger.info(`Starting: ${config.appName}`);

    scheduleTask('mainTask', 1000, () => {
        logger.debug('Main task executed');
        console.log('running');
    });
};

module.exports = { createApp, initApp };