// project-root/backend/app/middlewares/requestLogger.js

const logger = require('../../shared/utils/logger');

/**
 * Request logger middleware.
 * Logs basic request information, including HTTP method, URL, query parameters,
 * request body (for POST/PUT requests), and the total duration of the request.
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // When response is finished, log the duration along with request details.
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { method, originalUrl, query, body } = req;
    // For sensitive routes, consider omitting body details.
    const bodyToLog = (method === 'POST' || method === 'PUT') ? JSON.stringify(body) : '';
    logger.info(`[${new Date().toISOString()}] ${method} ${originalUrl} - Duration: ${duration}ms, Query: ${JSON.stringify(query)} Body: ${bodyToLog}`);
  });
  
  next();
};

module.exports = requestLogger;
