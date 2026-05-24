const { app, initApp } = require('./app');
const config = require('./config');
const logger = require('./logger');

initApp();

const server = app.listen(config.settings.port, () => {
    logger.info(`Server listening on port ${config.settings.port}`);
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});