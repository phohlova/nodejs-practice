const config = require('./config');
const log = require('./logger');

console.log(`Запуск: ${config.appName} v${config.settings.version}`);

log('Сервер успешно инициализирован');
log('Ожидание подключений на порту ' + config.settings.port);