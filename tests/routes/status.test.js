const request = require('supertest');
const { app } = require('../../src/app');

describe('GET /status', () => {
    test('should return 200 and OK', async () => {
        const response = await request(app).get('/status');

        expect(response.status).toBe(200);
        expect(response.text).toBe('ok');
    }); 
});