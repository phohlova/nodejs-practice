import request from 'supertest';
import { createTestApp } from '../helpers/testApp';

describe('GET /price', () => {
	let app: any;
	let rateRepo: any;

	beforeEach(() => {
		const testEnv = createTestApp();
		app = testEnv.app;
		rateRepo = testEnv.rateRepo;
	});

	test('must return 400, if no parameter currency', async () => {
		const res = await request(app).get('/price');
		expect(res.status).toBe(400);
		expect(res.body.error).toContain('Validation failed');
	});

	test('must return 404, if no currency in database', async () => {
		const res = await request(app).get('/price?currency=BTC');
		expect(res.status).toBe(404);
		expect(res.body.error).toContain('No exchange rates found for');
	});

	test('must return filtered course with Binance', async () => {
		rateRepo.upsert('BTCUSDT', 42000.50);
		rateRepo.upsert('ETHUSDT', 2200.75);
		rateRepo.upsert('BNBBTC', 0.005);

		const res = await request(app).get('/price?currency=USDT');

		expect(res.status).toBe(200);
		expect(res.body.currency).toBe('USDT');
		expect(res.body.count).toBe(2);
		expect(res.body.data[0].pair).toBe('BTCUSDT');
		expect(res.body.data[0].price).toBe(42000.50);
		expect(res.body.source).toBe('database_cache');
	});

	test('must return sorted results by price desc', async () => {
		rateRepo.upsert('LOWPAIR', 10.00);
		rateRepo.upsert('HIGHPAIR', 999.99);
		rateRepo.upsert('MEDPAIR', 100.50);

		const res = await request(app).get('/price?currency=PAIR');

		expect(res.status).toBe(200);
		expect(res.body.data[0].pair).toBe('HIGHPAIR');
		expect(res.body.data[1].pair).toBe('MEDPAIR');
		expect(res.body.data[2].pair).toBe('LOWPAIR');
	});
});