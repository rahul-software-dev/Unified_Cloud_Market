// project-root/backend/config/app.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const requestLogger = require('../app/middlewares/requestLogger');
const config = require('./index');

/**
 * createApp configures and returns an Express application.
 */
const createApp = () => {
  const app = express();

  // Security middleware: Set various HTTP headers
  app.use(helmet());

  // Compress responses for improved performance
  app.use(compression());

  // Parse JSON and URL-encoded data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Configure CORS based on environment variables
  app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));

  // HTTP request logging (using morgan) in development mode
  if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
  }

  // Custom request logger for additional details (duration, query, body, etc.)
  app.use(requestLogger);

  return app;
};

module.exports = createApp;