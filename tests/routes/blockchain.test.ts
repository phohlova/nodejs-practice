import request from 'supertest';
import { createTestApp } from '../helpers/testApp';

describe('Blockchain API', () => {
    let app: any;

    beforeEach(() => {
        const testEnv = createTestApp();
        app = testEnv.app;
    });

    describe('GET /blockchain/height', () => {
        test('must return blockchain height or 502 if API unavailable', async () => {
            const res = await request(app).get('/blockchain/height');

            expect([200, 502]).toContain(res.status);
            
            if (res.status === 200) {
                expect(res.body).toHaveProperty('height');
                expect(typeof res.body.height).toBe('number');
                expect(res.body).toHaveProperty('timestamp');
            }
        });
    });

    describe('GET /blockchain/address/:address/balance', () => {
        test('must return 400 for invalid address format', async () => {
            const res = await request(app).get('/blockchain/address/invalid/balance');
            
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/Validation failed|Invalid Bitcoin address format/);
        });

        test('must return 400 for short address', async () => {
            const res = await request(app).get('/blockchain/address/abc/balance');
            expect(res.status).toBe(400);
        });

        test('must return balance for valid address', async () => {
            const res = await request(app)
                .get('/blockchain/address/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa/balance');
            
            expect([200, 502]).toContain(res.status);
            
            if (res.status === 200) {
                expect(res.body).toHaveProperty('address');
                expect(res.body).toHaveProperty('final_balance');
                expect(typeof res.body.final_balance).toBe('number');
                expect(res.body).toHaveProperty('final_balance_btc');
            }
        });

        test('must work with different address formats', async () => {
            const res1 = await request(app)
                .get('/blockchain/address/3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy/balance');
            
            expect([200, 502]).toContain(res1.status);

            const res2 = await request(app)
                .get('/blockchain/address/bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq/balance');
            
            expect([200, 502]).toContain(res2.status);
        });
    });
});