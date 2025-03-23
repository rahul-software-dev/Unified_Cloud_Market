// project-root/backend/app/routes/userRoutes.js

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../../shared/middlewares/authMiddleware');

// Protect all user routes
router.use(authMiddleware);

/**
 * @route   GET /users/profile
 * @desc    Retrieve the authenticated user's profile.
 */
router.get('/profile', asyncHandler(UserController.getProfile));

/**
 * @route   PUT /users/profile
 * @desc    Update the authenticated user's profile.
 */
router.put(
  '/profile',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty.'),
    body('email').optional().isEmail().withMessage('Invalid email format.')
  ],
  asyncHandler(UserController.updateProfile)
);

module.exports = router;