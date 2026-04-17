const config = require('./config');

const logger = (message) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${config.appName}] [${timestamp}] ${message}`;

    console.log(formattedMessage);
};

module.exports = logger;