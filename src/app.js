const config = require('./config');
const log = require('./logger');
const { scheduleTask } = require('./scheduler');

const bootstrap = () => {
    log(`Starting: ${config.appName}`);
    
    log(`Server initialized, wait for connections on port ${config.settings.port}`);

    scheduleTask('mainTask', 10000, () => {
        console.log('running')
    });
}

module.exports = { bootstrap };