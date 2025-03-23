// project-root/backend/database/index.js

/**
 * Database Utilities Index
 *
 * This file serves as a reference point for database scripts.
 * Available scripts:
 *   - seed.js: Seeds initial data into the database.
 *   - migrate.js: Runs migration scripts (e.g., updating product names to Title Case).
 *
 * Usage:
 *   node seed.js [--no-clear]   // To seed data, optionally preserving existing records.
 *   node migrate.js              // To execute migration scripts.
 */

console.log('Database utilities available:');
console.log(' - Run "node seed.js" to seed the database. Use "--no-clear" to skip clearing data.');
console.log(' - Run "node migrate.js" to execute migration scripts.');

module.exports = {};