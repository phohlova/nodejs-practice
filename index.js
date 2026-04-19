const config = require('./config');
const log = require('./logger');
const { scheduleTask } = require('./scheduler');

console.log(`Запуск: ${config.appName} v${config.settings.version}`);

log('Сервер успешно инициализирован');
log('Ожидание подключений на порту ' + config.settings.port);

scheduleTask('mainTask', 10000, () => {
    console.log('running');
});