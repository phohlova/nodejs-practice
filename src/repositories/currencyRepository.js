const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/app.sqlite');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS currencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ticker TEXT NOT NULL UNIQUE
  );
`);

const run = (sql, params = []) => db.prepare(sql).run(params);
const get = (sql, params = []) => db.prepare(sql).get(params);
const all = (sql, params = []) => db.prepare(sql).all(params);

const create = (data) => {
	const info = run('INSERT INTO currencies (name, ticker) VALUES (?, ?)', [data.name, data.ticker]);

	return { id: Number(info.lastInsertRowid), name: data.name, ticker: data.ticker };
};

const findAll = () => all('SELECT id, name, ticker FROM currencies');

const findById = (id) => get('SELECT id, name, ticker FROM currencies WHERE id = ?', [id]);

const update = (id, data) => {
	const existing = findById(id);
	if (!existing) {
		return undefined;
	}

	const sets = [];
	const params = [];

	if (data.name !== undefined && data.name !== null) {
		sets.push('name = ?');
		params.push(String(data.name));
	}
	if (data.ticker !== undefined && data.ticker !== null) {
		sets.push('ticker = ?');
		params.push(String(data.ticker));
	}

	if (sets.length === 0) {
		return existing;
	}

	params.push(Number(id));

	const sql = `UPDATE currencies SET ${sets.join(', ')} WHERE id = ?`;
	db.prepare(sql).run(params);

	return findById(id);
};

const remove = (id) => {
	const info = run('DELETE FROM currencies WHERE id = ?', [id]);
	return info.changes > 0;
};

const clear = () => {
	run('DELETE FROM currencies');
	run('DELETE FROM sqlite_sequence WHERE name = ?', ['currencies']);
};

module.exports = { create, findAll, findById, update, remove, clear };