const Database = require('better-sqlite3');
const { createApp } = require('../../src/app');

function createTestApp() {
    const testDb = new Database(':memory:');
    const { app, db, currencyRepo, rateRepo } = createApp(testDb);
    return { app, db, currencyRepo, rateRepo };
}

module.exports = { createTestApp };