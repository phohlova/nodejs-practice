import request from 'supertest';
import { createTestApp } from '../helpers/testApp';

describe('Addresses API', () => {
	let app: any;
	let addressRepo: any;

	beforeEach(() => {
		const testEnv = createTestApp();
		app = testEnv.app;
		addressRepo = testEnv.addressRepo;
	});

	describe('POST /addresses', () => {
		test('must create address with valid data', async () => {
			const res = await request(app)
				.post('/addresses')
				.send({ 
				address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 
				label: 'Satoshi Wallet' 
				})
				.set('Content-Type', 'application/json');

			expect(res.status).toBe(201);
			expect(res.body).toMatchObject({
				address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
				label: 'Satoshi Wallet'
			});
			expect(res.body.id).toBe(1);
		});

		test('must return 400 if address is empty', async () => {
			const res = await request(app)
				.post('/addresses')
				.send({ label: 'Test' });

			expect(res.status).toBe(400);
			expect(res.body.error).toContain('Validation failed');
		});

		test('must return 400 if label is empty', async () => {
			const res = await request(app)
				.post('/addresses')
				.send({ address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' });

			expect(res.status).toBe(400);
			expect(res.body.error).toContain('Validation failed');
		});

		test('must return 409 if address already exists', async () => {
			addressRepo.create({ 
				address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 
				label: 'First' 
			});

			const res = await request(app)
				.post('/addresses')
				.send({ 
				address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 
				label: 'Duplicate' 
				});

			expect(res.status).toBe(409);
			expect(res.body.error).toContain('already exists');
		});
	});

	describe('GET /addresses', () => {
		test('must return empty array if no addresses', async () => {
			const res = await request(app).get('/addresses');
			expect(res.status).toBe(200);
			expect(res.body).toEqual([]);
			});

			test('must return list of addresses', async () => {
			addressRepo.create({ address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', label: 'Satoshi' });
			addressRepo.create({ address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', label: 'Another' });

			const res = await request(app).get('/addresses');
			expect(res.status).toBe(200);
			expect(res.body).toHaveLength(2);
			expect(res.body[0].label).toBe('Another');
			expect(res.body[1].label).toBe('Satoshi');
		});
	});

	describe('GET /addresses/:id', () => {
		test('must return address with existing ID', async () => {
			const created = addressRepo.create({ 
				address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 
				label: 'Test' 
			});

			const res = await request(app).get(`/addresses/${created.id}`);
			expect(res.status).toBe(200);
			expect(res.body.address).toBe('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
		});

		test('must return 404 for non-existent ID', async () => {
			const res = await request(app).get('/addresses/999');
			expect(res.status).toBe(404);
			expect(res.body.error).toBe('Address not found');
		});
	});

	describe('PUT /addresses/:id', () => {
		test('must update existing address', async () => {
			const created = addressRepo.create({ 
				address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 
				label: 'Old' 
			});

			const res = await request(app)
				.put(`/addresses/${created.id}`)
				.send({ label: 'Updated' });

			expect(res.status).toBe(200);
			expect(res.body.label).toBe('Updated');
		});

		test('must return 404 for non-existing ID', async () => {
			const res = await request(app)
				.put('/addresses/999')
				.send({ label: 'Test' });

			expect(res.status).toBe(404);
		});
	});

	describe('DELETE /addresses/:id', () => {
		test('must delete existing address', async () => {
			const created = addressRepo.create({ 
				address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 
				label: 'ToDelete' 
			});

			const res = await request(app).delete(`/addresses/${created.id}`);
			expect(res.status).toBe(204);

			const getRes = await request(app).get(`/addresses/${created.id}`);
			expect(getRes.status).toBe(404);
		});

		test('must return 404 for non-existing ID', async () => {
			const res = await request(app).delete('/addresses/999');
			expect(res.status).toBe(404);
		});
	});
});