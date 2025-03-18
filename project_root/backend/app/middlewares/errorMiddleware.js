// project-root/backend/app/middlewares/errorMiddleware.js

const logger = require('../../shared/utils/logger');

/**
 * Centralized error handling middleware.
 * Captures errors passed via next(error) from any route or middleware,
 * logs the error details along with the request method and URL, and sends
 * an appropriate JSON response.
 */
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  logger.error(`Error: ${err.message} - ${req.method} ${req.originalUrl}`);
  
  const response = {
    error: err.message || 'Internal Server Error'
  };
  
  // In development mode, include the stack trace for easier debugging.
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;