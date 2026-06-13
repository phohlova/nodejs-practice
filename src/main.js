const { createApp } = require('./app');
const { syncPrices } = require('./tasks/syncPricesTask');
const binanceService = require('./services/binanceService');
const config = require('./config');
const logger = require('./logger');
const { scheduleTask } = require('./scheduler');

const { app, db, currencyRepo, rateRepo } = createApp();

const initApp = () => {
    logger.info(`Starting: ${config.appName}`);

    scheduleTask('mainTask', 10000, () => {
        logger.debug('Main task executed');
        console.log('running');
    });

    logger.info('Starting background price sync (interval: 60000ms)');

    syncPrices(binanceService, rateRepo);

    const syncIntervalId = setInterval(() => {
        syncPrices(binanceService, rateRepo);
    }, 60000);

    return { syncIntervalId };
};

const { syncIntervalId } = initApp();

const server = app.listen(config.settings.port, () => {
    logger.info(`Server listening on port ${config.settings.port}`);
});

const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    clearInterval(syncIntervalId);
    logger.info(' Background price sync stopped');

    server.close(() => {
        logger.info(' HTTP server closed');

        db.close();
        logger.info(' Database connection closed');

        process.exit(0);
    });

    setTimeout(() => {
        logger.error(' Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', { message: err.message, stack: err.stack });
    shutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', { reason });
    shutdown('UNHANDLED_REJECTION');
});