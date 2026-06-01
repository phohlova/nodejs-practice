const DatabaseError = require('../errors/DatabaseError');
const DuplicateError = require('../errors/DuplicateError');

class CurrencyRepository {
	constructor(db) {
		this.db = db;
	}

	create(data) {
		try {
			const stmt = this.db.prepare('INSERT INTO currencies (name, ticker) VALUES (?, ?)');
			const info = stmt.run(data.name, data.ticker);
			return { id: Number(info.lastInsertRowid), name: data.name, ticker: data.ticker };
		} catch (err) {
			if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				throw new DuplicateError(`Ticker '${data.ticker}' already exists`);
			}
			throw new DatabaseError(`Failed to create currency: ${err.message}`);
		}
	}

	findAll() {
		try {
			return this.db.prepare('SELECT id, name, ticker FROM currencies ORDER BY id DESC').all();
		} catch (err) {
			throw new DatabaseError(`Failed to fetch currencies: ${err.message}`);
		}
	}

	findById(id) {
		try {
			return this.db.prepare('SELECT id, name, ticker FROM currencies WHERE id = ?').get(id);
		} catch (err) {
			throw new DatabaseError(`Failed to find currency by id ${id}: ${err.message}`);
		}
	}

	update(id, data) {
		try {
			const existing = this.findById(id);
			if (!existing) return undefined;

			const sets = [];
			const params = [];

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
			if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				throw new DuplicateError(`Ticker '${data.ticker}' is already taken by another currency`);
			}
			throw new DatabaseError(`Failed to update currency ${id}: ${err.message}`);
		}
	}

	remove(id) {
		try {
			const info = this.db.prepare('DELETE FROM currencies WHERE id = ?').run(id);
			return info.changes > 0;
		} catch (err) {
			throw new DatabaseError(`Failed to delete currency ${id}: ${err.message}`);
		}
	}

	clear() {
		this.db.exec('DELETE FROM currencies');
		this.db.exec("DELETE FROM sqlite_sequence WHERE name = 'currencies'");
	}
}

module.exports = CurrencyRepository;
