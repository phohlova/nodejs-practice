const Database = require('better-sqlite3');
const { createApp } = require('../../src/app');

function createTestApp() {
    const testDb = new Database(':memory:');
    const { app, db, currencyRepo } = createApp(testDb);
    return { app, db, currencyRepo };
}

module.exports = { createTestApp };