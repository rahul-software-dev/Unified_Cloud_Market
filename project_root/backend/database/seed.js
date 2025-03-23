// project-root/backend/database/seed.js

/**
 * Enhanced Database Seeder
 *
 * This script connects to the database, optionally clears existing collections,
 * and seeds initial data for Users, Products, and Offers.
 *
 * Usage:
 *   node seed.js [--no-clear]
 *   By default, existing data will be removed. Use --no-clear to keep existing data.
 */

const connectDB = require('../config/database');
const config = require('../config/index');
const mongoose = require('mongoose');
const User = require('../app/models/User');
const Product = require('../app/models/Product');
const Offer = require('../app/models/Offer');
const logger = require('../shared/utils/logger');

// Determine if data should be cleared (default true)
const args = process.argv.slice(2);
const shouldClear = !args.includes('--no-clear');

const seedDatabase = async () => {
  try {
    await connectDB();

    if (shouldClear) {
      logger.info('Clearing existing data...');
      await Promise.all([
        User.deleteMany({}),
        Product.deleteMany({}),
        Offer.deleteMany({})
      ]);
      logger.info('Existing data cleared.');
    } else {
      logger.info('Skipping data clearance (--no-clear flag detected).');
    }

    // Seed Users
    const usersData = [
      { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'admin' },
      { name: 'Bob Smith', email: 'bob@example.com', password: 'password123', role: 'manager' },
      { name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123', role: 'user' }
    ];
    const users = await User.insertMany(usersData);
    logger.info(`Seeded ${users.length} users.`);

    // Seed Products
    const productsData = [
      {
        name: 'Cloud Storage Pro',
        description: 'High performance cloud storage solution.',
        price: 99.99,
        currency: 'USD',
        marketplace: 'AWS',
        available: true
      },
      {
        name: 'Compute Engine Plus',
        description: 'Optimized compute services for your enterprise.',
        price: 199.99,
        currency: 'USD',
        marketplace: 'GCP',
        available: true
      },
      {
        name: 'Azure Analytics',
        description: 'Advanced analytics tools for data-driven insights.',
        price: 149.99,
        currency: 'USD',
        marketplace: 'Azure',
        available: true
      }
    ];
    const products = await Product.insertMany(productsData);
    logger.info(`Seeded ${products.length} products.`);

    // Seed Offers
    const offersData = [
      {
        title: 'Launch Discount',
        discount: 15,
        product: products[0]._id,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
        terms: 'Valid on first purchase only.'
      },
      {
        title: 'Holiday Special',
        discount: 20,
        product: products[1]._id,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days later
        terms: 'Limited time offer.'
      }
    ];
    const offers = await Offer.insertMany(offersData);
    logger.info(`Seeded ${offers.length} offers.`);

    logger.info('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    logger.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();