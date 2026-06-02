const request = require('supertest');
const { createTestApp } = require('../helpers/testApp');

describe('GET /status', () => {
    let app;

    beforeEach(() => {
        const testEnv = createTestApp();
        app = testEnv.app;
    });

    test('should return 200 and OK', async () => {
        const response = await request(app).get('/status');

        expect(response.status).toBe(200);
        expect(response.text).toBe('ok');
    }); 
});