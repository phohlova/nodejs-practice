const request = require('supertest');
const { createTestApp } = require('../helpers/testApp');

describe('Currencies API', () => {
	let app, currencyRepo;

	beforeEach(() => {
		const testEnv = createTestApp();
		app = testEnv.app;
		currencyRepo = testEnv.currencyRepo;
	});

	describe('POST /currencies', () => {
		test('must create currence with valid data', async () => {
			const res = await request(app)
				.post('/currencies')
				.send({ name: 'Euro', ticker: 'EUR' })
				.set('Content-Type', 'application/json');

			expect(res.status).toBe(201);
			expect(res.body).toMatchObject({
				name: 'Euro',
				ticker: 'EUR'
			});
			expect(res.body.id).toBe(1);

		});

		test('must return 409 if ticker already exists', async () => {
			currencyRepo.create({ name: 'USD', ticker: 'USD' });

			const res = await request(app)
				.post('/currencies')
				.send({ name: 'Another USD', ticker: 'USD' });

			expect(res.status).toBe(409);
			expect(res.body.error).toContain('already exists');
		});

		test('must return 400, if no name or ticker', async () => {
			const res = await request(app)
				.post('/currencies')
				.send({ name: 'Only Name' });

			expect(res.status).toBe(400);
			expect(res.body.error).toContain('required');
		});
	});

	describe('GET /currencies', () => {
		test('must return empty array, if no currencies', async () => {
			const res = await request(app).get('/currencies');
			expect(res.status).toBe(200);
			expect(res.body).toEqual([]);
		});

		test('must return list of currencies', async () => {
			currencyRepo.create({ name: 'US Dollar', ticker: 'USD' });
			currencyRepo.create({ name: 'Euro', ticker: 'EUR' });

			const res = await request(app).get('/currencies');
			expect(res.status).toBe(200);
			expect(res.body).toHaveLength(2);

			expect(res.body[0].ticker).toBe('EUR');
			expect(res.body[1].ticker).toBe('USD');
		});
	});

	describe('GET /currencies/:id', () => {
		test('must return currency with existing ID', async () => {
			const created = currencyRepo.create({ name: 'Pound', ticker: 'GBP' });

			const res = await request(app).get(`/currencies/${created.id}`);
			expect(res.status).toBe(200);
			expect(res.body.ticker).toBe('GBP');
		});

		test('must return 404 for non-existent ID', async () => {
			const res = await request(app).get('/currencies/999');
			expect(res.status).toBe(404);
			expect(res.body.error).toBe('Currency not found');
		});
	});

	describe('PUT /currencies/:id', () => {
		test('must update existing currency', async () => {
			const created = currencyRepo.create({ name: 'Old', ticker: 'OLD' });

			const res = await request(app)
				.put(`/currencies/${created.id}`)
				.send({ name: 'Updated', ticker: 'UPD' });

			expect(res.status).toBe(200);
			expect(res.body.name).toBe('Updated');
			expect(res.body.ticker).toBe('UPD');
		});

		test('must return 404 for non-existing ID', async () => {
			const res = await request(app)
				.put('/currencies/999')
				.send({ name: 'Test' });

			expect(res.status).toBe(404);
		});
	});

	describe('DELETE /currencies/:id', () => {
		test('must delete existing currency', async () => {
			const created = currencyRepo.create({ name: 'ToDelete', ticker: 'DEL' });

			const res = await request(app).delete(`/currencies/${created.id}`);
			expect(res.status).toBe(204);

			const getRes = await request(app).get(`/currencies/${created.id}`);
			expect(getRes.status).toBe(404);
		});

		test('must return 404 for non-existing ID', async () => {
			const res = await request(app).delete('/currencies/999');
			expect(res.status).toBe(404);
		});
	});
});