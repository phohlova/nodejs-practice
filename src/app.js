const express = require('express');
const config = require('./config');
const logger = require('./logger');
const { scheduleTask } = require('./scheduler');
const authenticateToken = require('./middleware/auth');

const app = express();

app.get('/status', (req, res) => {
    res.status(200).send('ok');
});

app.get('/secure/data', authenticateToken, (req, res) => {
    res.json({
        message: 'Secret data accessed',
        userId: req.user.id || 'anonymous'
    });
});

const initApp = () => {
    logger.info(`Starting: ${config.appName}`);

    scheduleTask('mainTask', 1000, () => {
        logger.debug('Main task executed');
        console.log('running');
    });
};

module.exports = { app, initApp };