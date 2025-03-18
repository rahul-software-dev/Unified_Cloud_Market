// project-root/backend/config/database.js

const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../shared/utils/logger');

/**
 * connectDB connects to MongoDB using Mongoose and sets up event listeners.
 */
const connectDB = async () => {
  try {
    // Set strictQuery mode (recommended for Mongoose 7+)
    mongoose.set('strictQuery', true);

    await mongoose.connect(config.mongodbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Enable autoIndex in development for convenience (disable in production)
      autoIndex: config.nodeEnv === 'development'
    });
    logger.info('MongoDB connected successfully.');

    // Set up event listeners for connection events
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnection...');
    });
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;