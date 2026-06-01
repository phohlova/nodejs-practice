const Database = require('better-sqlite3');
const path = require('path');
const logger = require('../logger');

function initializeDatabase(dbPath) {
    const absolutePath = path.resolve(dbPath);
    logger.info(`Initializing database at: ${absolutePath}`);

    const db = new Database(absolutePath);

    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('busy_timeout = 5000');

    db.exec(`
    CREATE TABLE IF NOT EXISTS currencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ticker TEXT NOT NULL UNIQUE
    );
  `);

    logger.info('Database schema verified/created');
    return db;
}

module.exports = { initializeDatabase };