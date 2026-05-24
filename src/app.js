const express = require('express');
const config = require('./config');
const logger = require('./logger');
const { scheduleTask } = require('./scheduler');

const app = express();

app.get('/status', (req, res) => {
    res.status(200).send('ok');
});

const initApp = () => {
    logger.info(`Starting: ${config.appName}`);
    logger.setLevel('debug');

    scheduleTask('mainTask', 1000, () => {
        logger.debug('Main task executed');
        console.log('running');
    });
};

module.exports = { app, initApp };