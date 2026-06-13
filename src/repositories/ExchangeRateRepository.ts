import Database from 'better-sqlite3';

interface ExchangeRate {
	pair: string;
	price: number;
	updated_at: string;
	}

export class ExchangeRateRepository {
	db: Database.Database;

	constructor(db: Database.Database) {
		this.db = db;
		this._ensureSchema();
	}

	private _ensureSchema(): void {
		this.db.exec(`
		CREATE TABLE IF NOT EXISTS exchange_rates (
			pair TEXT PRIMARY KEY,
			price REAL NOT NULL,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);
		`);
	}

	findByCurrency(currency: string): ExchangeRate[] {
		return this.db.prepare(`
		SELECT pair, price, updated_at 
		FROM exchange_rates 
		WHERE pair LIKE ? 
		ORDER BY price DESC
		`).all(`%${currency}%`) as ExchangeRate[];
	}

	upsert(pair: string, price: number): void {
		this.db.prepare(`
		INSERT INTO exchange_rates (pair, price, updated_at) 
		VALUES (?, ?, CURRENT_TIMESTAMP)
		ON CONFLICT(pair) DO UPDATE SET 
			price = excluded.price, 
			updated_at = CURRENT_TIMESTAMP
		`).run(pair, price);
	}

	clear(): void {
		this.db.exec('DELETE FROM exchange_rates');
	}
}

module.exports = ExchangeRateRepository;
module.exports.ExchangeRateRepository = ExchangeRateRepository;