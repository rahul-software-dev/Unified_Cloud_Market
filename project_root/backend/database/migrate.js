// project-root/backend/database/migrate.js

/**
 * Enhanced Migration Script
 *
 * This script performs a sample migration: converting all product names to Title Case.
 * It uses a bulkWrite operation for efficiency and supports running within a transaction if the environment supports it.
 *
 * Usage: node migrate.js
 */

const connectDB = require('../config/database');
const Product = require('../app/models/Product');
const logger = require('../shared/utils/logger');
const mongoose = require('mongoose');

/**
 * Convert a string to Title Case.
 * @param {String} str - Input string.
 * @returns {String} Title-cased string.
 */
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const migrateProductNames = async () => {
  let session;
  try {
    await connectDB();

    // Start a session for transaction (if using a replica set)
    session = await mongoose.startSession();
    session.startTransaction();

    const products = await Product.find({}).session(session);
    logger.info(`Found ${products.length} products to migrate.`);

    // Prepare bulkWrite operations
    const bulkOps = products.map((product) => {
      const titleCasedName = toTitleCase(product.name);
      if (product.name !== titleCasedName) {
        return {
          updateOne: {
            filter: { _id: product._id },
            update: { $set: { name: titleCasedName } }
          }
        };
      }
      return null;
    }).filter(Boolean);

    if (bulkOps.length > 0) {
      const bulkResult = await Product.bulkWrite(bulkOps, { session });
      logger.info(`Bulk update modified ${bulkResult.modifiedCount} products.`);
    } else {
      logger.info('No products required migration.');
    }

    await session.commitTransaction();
    logger.info('Product name migration completed successfully.');
    process.exit(0);
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    logger.error(`Migration failed: ${error.message}`);
    process.exit(1);
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

migrateProductNames();