const request = require('supertest');
const { app } = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
    const validToken = jwt.sign({ id: 1, role: 'admin' }, process.env.AUTH_SECRET);
    const invalidToken = '111111111';

    test('must success with valid Bearer token', async () => {
        const res = await request(app)
            .get('/secure/data')
            .set('Authorization', `Bearer ${validToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Secret data accessed');
        expect(res.body.userId).toBe(1);
    });

    test('must return 401, when header is empty', async () => {
        const res = await request(app).get('/secure/data');
        expect(res.status).toBe(401);
        expect(res.body.error).toContain('Auth header required');
    });

    test('must return 403, when token is not valid', async () => {
        const res = await request(app)
            .get('/secure/data')
            .set('Authorization', `Bearer ${invalidToken}`);

        expect(res.status).toBe(403);
        expect(res.body.error).toContain('Invalid token');
    });

    test('must return 403, when token is out of date', async () => {
        const expiredToken = jwt.sign({ id: 2 }, process.env.AUTH_SECRET, { expiresIn: '0s' });

        const res = await request(app) 
            .get('/secure/data')
            .set('Authorization', `Bearer ${expiredToken}`);

        expect(res.status).toBe(403);
    });
});