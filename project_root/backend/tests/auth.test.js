// project-root/backend/tests/auth.test.js

const request = require('supertest');
const app = require('../config/app')();
const mongoose = require('mongoose');
const User = require('../app/models/User');
const config = require('../config/index');
const jwt = require('jsonwebtoken');

describe('Auth Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongodbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /auth/login - should login a valid user', async () => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });
    await user.save();

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    // Verify token structure
    const decoded = jwt.verify(response.body.token, config.jwtSecret);
    expect(decoded).toHaveProperty('id', user._id.toString());
  });

  test('POST /auth/login - should fail with missing credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'testuser@example.com' }); // missing password

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('POST /auth/login - should fail with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials.');
  });
});