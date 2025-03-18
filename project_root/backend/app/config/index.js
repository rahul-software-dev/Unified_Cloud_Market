// project-root/backend/config/index.js

const convict = require('convict');

// Define a schema for configuration variables
const config = convict({
  port: {
    doc: 'The port to bind the application',
    format: 'port',
    default: 5000,
    env: 'PORT'
  },
  jwtSecret: {
    doc: 'JWT Secret for authentication',
    format: String,
    default: '',
    env: 'JWT_SECRET'
  },
  mongodbURI: {
    doc: 'MongoDB connection URI',
    format: 'url',
    default: '',
    env: 'MONGODB_URI'
  },
  nodeEnv: {
    doc: 'The application environment',
    format: ['development', 'production', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  logLevel: {
    doc: 'Logging level',
    format: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
    default: 'info',
    env: 'LOG_LEVEL'
  },
  corsOrigin: {
    doc: 'Allowed CORS origin(s)',
    format: String,
    default: '*',
    env: 'CORS_ORIGIN'
  }
});

// Validate the configuration
config.validate({ allowed: 'strict' });

module.exports = config.getProperties();