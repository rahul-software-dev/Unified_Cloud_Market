// project-root/backend/app/services/UserService.js

const User = require('../models/User');
const logger = require('../../shared/utils/logger');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });

/**
 * UserService handles operations related to user data.
 */
const UserService = {
  /**
   * Retrieves a user by ID.
   * @param {String} userId - The ID of the user.
   * @returns {Promise<Object|null>} The user data or null if not found.
   */
  getUserById: async (userId) => {
    try {
      const cacheKey = `user:${userId}`;
      let user = cache.get(cacheKey);
      if (user) {
        return user;
      }
      user = await User.findById(userId).lean();
      if (user) {
        cache.set(cacheKey, user);
      }
      return user;
    } catch (error) {
      logger.error(`UserService.getUserById error: ${error.message}`);
      throw error;
    }
  },

  /**
   * Updates a user's profile.
   * @param {String} userId - The ID of the user.
   * @param {Object} updateData - Data for updating the user.
   * @returns {Promise<Object|null>} The updated user data or null if not found.
   */
  updateUser: async (userId, updateData) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true
      }).lean();
      if (updatedUser) {
        cache.set(`user:${userId}`, updatedUser);
      }
      return updatedUser;
    } catch (error) {
      logger.error(`UserService.updateUser error: ${error.message}`);
      throw error;
    }
  },

  /**
   * Finds a user by email.
   * @param {String} email - The email address to search for.
   * @returns {Promise<Object|null>} The user data or null if not found.
   */
  findUserByEmail: async (email) => {
    try {
      const user = await User.findOne({ email }).lean();
      return user;
    } catch (error) {
      logger.error(`UserService.findUserByEmail error: ${error.message}`);
      throw error;
    }
  },

  /**
   * Updates a user's password.
   * @param {String} userId - The ID of the user.
   * @param {String} newPassword - The new password.
   * @returns {Promise<Object|null>} The updated user data or null if not found.
   */
  updatePassword: async (userId, newPassword) => {
    try {
      const user = await User.findById(userId);
      if (!user) return null;
      user.password = newPassword; // Pre-save hook will hash this
      await user.save();
      const updatedUser = user.toObject();
      delete updatedUser.password;
      cache.set(`user:${userId}`, updatedUser);
      return updatedUser;
    } catch (error) {
      logger.error(`UserService.updatePassword error: ${error.message}`);
      throw error;
    }
  }
};

module.exports = UserService;