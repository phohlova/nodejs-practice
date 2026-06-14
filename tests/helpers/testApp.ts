import Database from 'better-sqlite3';
import { createApp } from '../../src/app';

interface TestAppContext {
    app: any;
    db: Database.Database;
    currencyRepo: any;
    rateRepo: any;
    addressRepo: any;
    priceHistoryRepo: any;
}

export function createTestApp(): TestAppContext {
    const testDb = new Database(':memory:');
    const { app, db, currencyRepo, rateRepo, addressRepo, priceHistoryRepo } = createApp(testDb);
    return { app, db, currencyRepo, rateRepo, addressRepo, priceHistoryRepo };
}

module.exports = { createTestApp };