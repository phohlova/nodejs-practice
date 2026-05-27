const express = require('express');
const config = require('./config');
const logger = require('./logger');
const { scheduleTask } = require('./scheduler');
const authenticateToken = require('./middleware/auth');
const swaggerSpec = require('./config/swagger');
const swaggerUi = require('swagger-ui-express');

const currenciesRouter = require('./routes/currencies');

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/status', (req, res) => {
    res.status(200).send('ok');
});

app.get('/secure/data', authenticateToken, (req, res) => {
    res.json({
        message: 'Secret data accessed',
        userId: req.user.id || 'anonymous'
    });
});

app.use('/currencies', currenciesRouter);

const initApp = () => {
    logger.info(`Starting: ${config.appName}`);

    scheduleTask('mainTask', 1000, () => {
        logger.debug('Main task executed');
        console.log('running');
    });
};

module.exports = { app, initApp };