import Database from 'better-sqlite3';
import { AppError } from '../errors/AppError';

interface PriceHistoryRecord {
    id: number;
    pair: string;
    price: number;
    recorded_at: string;
}

interface PriceHistoryFilter {
    pair: string;
    from?: string;
    to?: string;
    limit?: number;
}

export class PriceHistoryRepository {
    db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
        this._ensureSchema();
    }

    private _ensureSchema(): void {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS price_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pair TEXT NOT NULL,
                price REAL NOT NULL,
                recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    create(pair: string, price: number): PriceHistoryRecord {
        try {
            const stmt = this.db.prepare(
                'INSERT INTO price_history (pair, price) VALUES (?, ?)'
            );
            const info = stmt.run(pair, price);
            return {
                id: Number(info.lastInsertRowid),
                pair,
                price,
                recorded_at: new Date().toISOString()
            };
        } catch (err) {
            throw new AppError(`Failed to record price: ${(err as Error).message}`, 500);
        }
    }

    findByPair(filter: PriceHistoryFilter): PriceHistoryRecord[] {
        try {
            let query = 'SELECT id, pair, price, recorded_at FROM price_history WHERE pair = ?';
            const params: unknown[] = [filter.pair];

            if (filter.from) {
                query += ' AND recorded_at >= ?';
                params.push(filter.from);
            }

            if (filter.to) {
                query += ' AND recorded_at <= ?';
                params.push(filter.to);
            }

            query += ' ORDER BY id DESC';

            if (filter.limit) {
                query += ' LIMIT ?';
                params.push(filter.limit);
            }

            return this.db.prepare(query).all(...params) as PriceHistoryRecord[];
        } catch (err) {
            throw new AppError(`Failed to fetch price history: ${(err as Error).message}`, 500);
        }
    }

    clear(): void {
        this.db.exec('DELETE FROM price_history');
        this.db.exec("DELETE FROM sqlite_sequence WHERE name = 'price_history'");
    }
}

module.exports = PriceHistoryRepository;
module.exports.PriceHistoryRepository = PriceHistoryRepository;