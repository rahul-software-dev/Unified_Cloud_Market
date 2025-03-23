// project-root/backend/tests/marketplace.test.js

const request = require('supertest');
const app = require('../config/app')();
const mongoose = require('mongoose');
const Product = require('../app/models/Product');
const config = require('../config/index');
const jwt = require('jsonwebtoken');
const User = require('../app/models/User');

let token;

describe('Marketplace Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongodbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Create a test user and generate a token
    const testUser = new User({
      name: 'Marketplace Tester',
      email: 'marketplace@test.com',
      password: 'testpassword',
      role: 'admin',
    });
    await testUser.save();
    token = jwt.sign({ id: testUser._id }, config.jwtSecret, { expiresIn: '1h' });
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /marketplace/products - should return empty list initially', async () => {
    const res = await request(app)
      .get('/marketplace/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBe(0);
  });

  test('POST /marketplace/products - should create a new product', async () => {
    const productData = {
      name: 'Test Product',
      description: 'Test Description',
      price: 49.99,
      currency: 'USD',
      marketplace: 'AWS',
      available: true,
    };

    const res = await request(app)
      .post('/marketplace/products')
      .set('Authorization', `Bearer ${token}`)
      .send(productData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Test Product');
  });

  test('POST /marketplace/products - should fail if required fields are missing', async () => {
    const incompleteData = { price: 49.99, marketplace: 'AWS' };
    const res = await request(app)
      .post('/marketplace/products')
      .set('Authorization', `Bearer ${token}`)
      .send(incompleteData);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /marketplace/products/:id - should update an existing product', async () => {
    const product = new Product({
      name: 'Old Product',
      description: 'Old Description',
      price: 29.99,
      currency: 'USD',
      marketplace: 'AWS',
      available: true,
    });
    await product.save();

    const updateData = { name: 'Updated Product', price: 39.99 };
    const res = await request(app)
      .put(`/marketplace/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Product');
    expect(res.body.price).toBe(39.99);
  });

  test('DELETE /marketplace/products/:id - should delete a product', async () => {
    const product = new Product({
      name: 'Delete Product',
      description: 'To be deleted',
      price: 19.99,
      currency: 'USD',
      marketplace: 'AWS',
      available: true,
    });
    await product.save();

    const res = await request(app)
      .delete(`/marketplace/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});