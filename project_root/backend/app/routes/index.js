// project-root/backend/app/routes/index.js

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const marketplaceRoutes = require('./marketplaceRoutes');
const offerRoutes = require('./offerRoutes');
const userRoutes = require('./userRoutes');

/**
 * Mount all route modules with clear URL prefixes.
 */
router.use('/auth', authRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/offers', offerRoutes);
router.use('/users', userRoutes);

/**
 * Default welcome route.
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Unified Cloud Marketplace Management System API.'
  });
});

module.exports = router;