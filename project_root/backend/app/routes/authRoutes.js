// project-root/backend/app/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const AuthController = require('../controllers/AuthController');

/**
 * @route   POST /auth/login
 * @desc    Logs in a user and returns a JWT token.
 */
router.post('/login', asyncHandler(AuthController.login));

/**
 * @route   POST /auth/logout
 * @desc    Logs out a user (client should remove the token).
 */
router.post('/logout', asyncHandler(AuthController.logout));

module.exports = router;