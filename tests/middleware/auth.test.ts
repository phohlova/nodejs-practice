import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createTestApp } from '../helpers/testApp';

describe('Auth Middleware', () => {
    let app: any;
    const validToken = jwt.sign({ id: 1, role: 'admin' }, process.env.AUTH_SECRET as string);
    const invalidToken = '111111111';

    beforeEach(() => {
        const testEnv = createTestApp();
        app = testEnv.app;
    });

    test('must success with valid Bearer token', async () => {
        const res = await request(app)
            .get('/secure/data')
            .set('Authorization', `Bearer ${validToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Secret data accessed');
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
        const expiredToken = jwt.sign({ id: 2 }, process.env.AUTH_SECRET as string, { expiresIn: '0s' });

        const res = await request(app)
            .get('/secure/data')
            .set('Authorization', `Bearer ${expiredToken}`);

        expect(res.status).toBe(403);
    });
});

module.exports = {};