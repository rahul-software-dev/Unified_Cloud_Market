// project-root/backend/server.js

/**
 * Entry point for the Unified Cloud Marketplace Management System backend.
 * This file loads configuration, connects to the database, initializes the Express app,
 * sets up API routes and middleware, and starts the HTTP server.
 * 
 * Enhancements include:
 *  - A health check endpoint (GET /health)
 *  - Optional clustering support to leverage multi-core systems
 *  - Global error handling for uncaught exceptions and promise rejections
 *  - Server-level error event handling
 *  - Graceful shutdown with proper logging and resource cleanup
 */

const http = require('http');
const cluster = require('cluster');
const os = require('os');
const mongoose = require('mongoose');
const config = require('./config/index');
const createApp = require('./config/app');
const connectDB = require('./config/database');
const routes = require('./app/routes/index');
const errorMiddleware = require('./app/middlewares/errorMiddleware');
const logger = require('./shared/utils/logger'); // Centralized logger

// Create Express app instance from configuration
const app = createApp();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Mount API routes under /api prefix
app.use('/api', routes);

// Catch-all handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Use centralized error handling middleware
app.use(errorMiddleware);

// Create HTTP server instance
const server = http.createServer(app);

// Optional clustering: If CLUSTER_MODE env var is set to true, fork worker processes.
if (config.nodeEnv !== 'test' && process.env.CLUSTER_MODE === 'true' && cluster.isMaster) {
  const numCPUs = os.cpus().length;
  logger.info(`Master process ${process.pid} is running. Forking ${numCPUs} workers...`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died. Spawning a new one.`);
    cluster.fork();
  });
} else {
  /**
   * Start the server after successful database connection.
   */
  const startServer = async () => {
    try {
      await connectDB();
      server.listen(config.port, () => {
        logger.info(`Server (PID: ${process.pid}) is running on port ${config.port} in ${config.nodeEnv} mode.`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();

  // Server-level error handling
  server.on('error', (error) => {
    logger.error(`Server error: ${error.message}`);
    process.exit(1);
  });
}

// Global error handling for uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

/**
 * Gracefully shuts down the server and closes the MongoDB connection.
 */
const gracefulShutdown = () => {
  logger.info('Initiating graceful shutdown...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  });
};

// Listen for termination signals to trigger graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);