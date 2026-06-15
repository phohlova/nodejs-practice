import request from 'supertest';
import { createTestApp } from '../helpers/testApp';

describe('Price History API', () => {
    let app: any;
    let priceHistoryRepo: any;

    beforeEach(() => {
        const testEnv = createTestApp();
        app = testEnv.app;
        priceHistoryRepo = testEnv.priceHistoryRepo;
    });

    describe('GET /history/:pair', () => {
        test('must return 404 if no history for pair', async () => {
            const res = await request(app).get('/history/BTCUSDT');
            expect(res.status).toBe(404);
            expect(res.body.error).toContain('No price history found');
        });

        test('must return 400 if limit is invalid', async () => {
            const res = await request(app).get('/history/BTCUSDT?limit=0');
            expect(res.status).toBe(400);
            expect(res.body.error).toContain('Validation failed');
        });

        test('must return history for existing pair', async () => {
            priceHistoryRepo.create('BTCUSDT', 42000.50);
            priceHistoryRepo.create('BTCUSDT', 43000.00);
            priceHistoryRepo.create('ETHUSDT', 2200.75);

            const res = await request(app).get('/history/BTCUSDT');
            expect(res.status).toBe(200);
            expect(res.body.pair).toBe('BTCUSDT');
            expect(res.body.count).toBe(2);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.data[0].price).toBe(43000.00);
        });

        test('must return limited results', async () => {
            priceHistoryRepo.create('BTCUSDT', 42000.50);
            priceHistoryRepo.create('BTCUSDT', 43000.00);
            priceHistoryRepo.create('BTCUSDT', 44000.00);

            const res = await request(app).get('/history/BTCUSDT?limit=2');
            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.data[0].price).toBe(44000.00);
        });

        test('must return results sorted by date desc', async () => {
            priceHistoryRepo.create('BTCUSDT', 42000.50);
            priceHistoryRepo.create('BTCUSDT', 43000.00);
            priceHistoryRepo.create('BTCUSDT', 44000.00);

            const res = await request(app).get('/history/BTCUSDT');
            expect(res.status).toBe(200);
            expect(res.body.data[0].price).toBe(44000.00);
            expect(res.body.data[1].price).toBe(43000.00);
            expect(res.body.data[2].price).toBe(42000.50);
        });
    });
});