import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH: string = process.env.DB_PATH || path.join(__dirname, '../../data/app.sqlite');
const DB_DIR: string = path.dirname(DB_PATH);

if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

try {
    const db: Database.Database = new Database(DB_PATH);

    db.pragma('journal_mode = WAL');

    db.exec(`
    CREATE TABLE IF NOT EXISTS currencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ticker TEXT NOT NULL UNIQUE
    );
  `);

    console.log(`Database initialized successfully at: ${DB_PATH}`);
    db.close();
} catch (error) {
    console.error('Failed to initialize database:', (error as Error).message);
    process.exit(1);
}