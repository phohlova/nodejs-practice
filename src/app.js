const config = require('./config');
const logger = require('./logger');
const { scheduleTask } = require('./scheduler');

const bootstrap = () => {
    logger.info(`Starting: ${config.appName}`);
    
    logger.info(`Server initialized, wait for connections on port ${config.settings.port}`);

    logger.setLevel('debug');
    
    scheduleTask('mainTask', 1000, () => {
        logger.debug('Main task executed');
        console.log('running');
    });
};

module.exports = { bootstrap };