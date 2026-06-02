const request = require('supertest');
const { createTestApp } = require('../helpers/testApp');
const binanceService = require('../../src/services/binanceService');


describe('GET /price', () => {
	let app, currencyRepo;

	beforeEach(() => {
		const testEnv = createTestApp();
		app = testEnv.app;
		currencyRepo = testEnv.currencyRepo;
		jest.clearAllMocks();
	});

	test('must return 400, if no parameter currency', async () => {
		const res = await request(app).get('/price');
		expect(res.status).toBe(400);
		expect(res.body.error).toContain('required');
	});

	test('must return 404, if no currency in database', async () => {
		currencyRepo.create({ name: 'US Dollar', ticker: 'USD' });

		const res = await request(app).get('/price?currency=EUR');
		expect(res.status).toBe(404);
		expect(res.body.error).toContain('not found');
	});

	test('must return filtered course with Binance', async () => {
		currencyRepo.create({ name: 'Tether', ticker: 'USDT' });

		const mockTickers = [
			{ symbol: 'BTCUSDT', price: '42000.50' },
			{ symbol: 'ETHUSDT', price: '2200.75' },
			{ symbol: 'BNBBTC', price: '0.005' }
		];
		binanceService.getAllTickers.mockResolvedValue(mockTickers);

		const res = await request(app).get('/price?currency=USDT');

		expect(res.status).toBe(200);
		expect(res.body.currency).toBe('USDT');
		expect(res.body.count).toBe(2);
		expect(res.body.data[0].pair).toBe('BTCUSDT');
		expect(res.body.data[0].price).toBe(42000.50);
	});

	test('must return 502 when Binance API error', async () => {
		currencyRepo.create({ name: 'Bitcoin', ticker: 'BTC' });

		binanceService.getAllTickers.mockRejectedValue(new Error('Network error'));

		const res = await request(app).get('/price?currency=BTC');
		expect(res.status).toBe(502);
		expect(res.body.error).toContain('external service');
	});
});
