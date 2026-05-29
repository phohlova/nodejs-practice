let currencies = new Map();
let nextId = 1;

const create = (data) => {
	const id = nextId++;
	const currency = { id, ...data };
	currencies.set(id, currency);
	return currency;
};

const findAll = () => Array.from(currencies.values());

const findById = (id) => currencies.get(id);

const update = (id, data) => {
	const existing = currencies.get(id);
	if (!existing) return undefined;

	const updated = { ...existing, ...data, id };
	currencies.set(id, updated);
	return updated;
};

const remove = (id) => currencies.delete(id);

const clear = () => {
	currencies.clear();
	nextId = 1;
};

module.exports = { create, findAll, findById, update, remove, clear };