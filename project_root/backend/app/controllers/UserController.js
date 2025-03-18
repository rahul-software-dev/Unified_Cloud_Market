// project-root/backend/app/controllers/UserController.js

const UserService = require('../services/UserService');
const logger = require('../../shared/utils/logger');

/**
 * UserController handles operations related to user profiles.
 */
const UserController = {
  /**
   * Get the authenticated user's profile.
   * Assumes req.user is populated by an authentication middleware.
   */
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user && req.user.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized access.' });
      }
      const userProfile = await UserService.getUserById(userId);
      if (!userProfile) {
        return res.status(404).json({ error: 'User not found.' });
      }
      return res.json(userProfile);
    } catch (error) {
      logger.error(`UserController.getProfile error: ${error.message}`);
      next(error);
    }
  },

  /**
   * Update the authenticated user's profile.
   * Expects updated profile data in req.body.
   */
  updateProfile: async (req, res, next) => {
    try {
      const userId = req.user && req.user.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized access.' });
      }
      const updateData = req.body;
      const updatedUser = await UserService.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found or update failed.' });
      }
      return res.json(updatedUser);
    } catch (error) {
      logger.error(`UserController.updateProfile error: ${error.message}`);
      next(error);
    }
  }
};

module.exports = UserController;