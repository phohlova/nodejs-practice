class ExchangeRateRepository {
    constructor(db) {
        this.db = db;
        this._ensureSchema();
    }

    _ensureSchema() {
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS exchange_rates (
        pair TEXT PRIMARY KEY,
        price REAL NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    }

    findByCurrency(currency) {
        return this.db.prepare(`
      SELECT pair, price, updated_at 
      FROM exchange_rates 
      WHERE pair LIKE ? 
      ORDER BY price DESC
    `).all(`%${currency}%`);
    }

    upsert(pair, price) {
        return this.db.prepare(`
      INSERT INTO exchange_rates (pair, price, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(pair) DO UPDATE SET 
        price = excluded.price, 
        updated_at = CURRENT_TIMESTAMP
    `).run(pair, price);
    }

    clear() {
        this.db.exec('DELETE FROM exchange_rates');
    }
}

module.exports = ExchangeRateRepository;