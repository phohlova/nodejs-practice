require('dotenv').config();

if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = 'test-secret-key-for-jest';
}

process.env.NODE_ENV = 'test';