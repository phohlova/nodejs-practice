import Database from 'better-sqlite3';
import { AppError } from '../errors/AppError';
import { DuplicateError } from '../errors/DuplicateError';

interface Currency {
	id: number;
	name: string;
	ticker: string;
}

interface CurrencyData {
	name: string;
	ticker: string;
}

export class CurrencyRepository {
	db: Database.Database;

	constructor(db: Database.Database) {
		this.db = db;
		this._ensureSchema();
	}

	private _ensureSchema(): void {
		this.db.exec(`
		CREATE TABLE IF NOT EXISTS currencies (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			ticker TEXT NOT NULL UNIQUE
		);
		`);
	}

	create(data: CurrencyData): Currency {
		try {
			const stmt = this.db.prepare('INSERT INTO currencies (name, ticker) VALUES (?, ?)');
			const info = stmt.run(data.name, data.ticker);
			return { id: Number(info.lastInsertRowid), name: data.name, ticker: data.ticker };
		} catch (err) {
			const error = err as NodeJS.ErrnoException;
			if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				throw new DuplicateError(`Ticker '${data.ticker}' already exists`);
			}
			throw new AppError(`Failed to create currency: ${error.message}`, 500);
		}
	}

	findAll(): Currency[] {
		try {
			return this.db.prepare('SELECT id, name, ticker FROM currencies ORDER BY id DESC').all() as Currency[];
		} catch (err) {
			throw new AppError(`Failed to fetch currencies: ${(err as Error).message}`, 500);
		}
	}

	findById(id: number): Currency | undefined {
		try {
			return this.db.prepare('SELECT id, name, ticker FROM currencies WHERE id = ?').get(id) as Currency | undefined;
		} catch (err) {
			throw new AppError(`Failed to find currency by id ${id}: ${(err as Error).message}`, 500);
		}
	}

	update(id: number, data: Partial<CurrencyData>): Currency | undefined {
		try {
			const existing = this.findById(id);
			if (!existing) return undefined;

			const sets: string[] = [];
			const params: unknown[] = [];

			if (data.name !== undefined) {
				sets.push('name = ?');
				params.push(data.name);
			}

			if (data.ticker !== undefined) {
				sets.push('ticker = ?');
				params.push(data.ticker);
			}

			if (sets.length === 0) return existing;

			params.push(id);
			this.db.prepare(`UPDATE currencies SET ${sets.join(', ')} WHERE id = ?`).run(params);

			return this.findById(id);
		} catch (err) {
			const error = err as NodeJS.ErrnoException;
			if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				throw new AppError(`Ticker '${data.ticker}' is already taken by another currency`, 409);
			}
			throw new AppError(`Failed to update currency ${id}: ${error.message}`, 500);
		}
	}

	remove(id: number): boolean {
		try {
			const info = this.db.prepare('DELETE FROM currencies WHERE id = ?').run(id);
			return info.changes > 0;
		} catch (err) {
			throw new AppError(`Failed to delete currency ${id}: ${(err as Error).message}`, 500);
		}
	}

	clear(): void {
		this.db.exec('DELETE FROM currencies');
		this.db.exec("DELETE FROM sqlite_sequence WHERE name = 'currencies'");
	}
}

module.exports = CurrencyRepository;
module.exports.CurrencyRepository = CurrencyRepository;
