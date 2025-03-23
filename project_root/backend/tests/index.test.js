// project-root/backend/tests/index.test.js

const request = require('supertest');
const app = require('../config/app')();

describe('Root API', () => {
  test('GET / - should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Welcome to the Unified Cloud Marketplace Management System API.');
  });

  test('GET /nonexistent - should return 404 for undefined routes', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
  });
});