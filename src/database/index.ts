import Database from 'better-sqlite3';
import path from 'path';
const logger = require('../logger');

export function initializeDatabase(dbPath: string): Database.Database {
    const absolutePath: string = path.resolve(dbPath);
    logger.info(`Initializing database at: ${absolutePath}`);

    const db: Database.Database = new Database(absolutePath);

    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('busy_timeout = 5000');

    db.exec(`
      CREATE TABLE IF NOT EXISTS currencies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ticker TEXT NOT NULL UNIQUE
      );
      
      CREATE TABLE IF NOT EXISTS exchange_rates (
        pair TEXT PRIMARY KEY,
        price REAL NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info('Database schema verified/created');
    return db;
}

module.exports = { initializeDatabase };