const { formatLogMessage } = require('./formatter');
const { writeConsole } = require('./writer');
const config = require('../config');

const log = (message) => {
    const formatted = formatLogMessage(config.appName, message);
    writeConsole(formatted);
}

module.exports = log;