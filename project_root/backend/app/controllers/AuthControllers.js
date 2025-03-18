// project-root/backend/app/controllers/AuthController.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../../shared/utils/logger'); // Assuming a logger module exists

/**
 * AuthController handles user authentication (login/logout).
 */
const AuthController = {
  /**
   * Logs in a user.
   * Expects { email, password } in req.body.
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    } catch (error) {
      logger.error(`AuthController.login error: ${error.message}`);
      next(error);
    }
  },

  /**
   * Logs out a user.
   * Note: With JWT-based auth, logout is handled client-side.
   */
  logout: (req, res) => {
    // Optionally, you can blacklist the token here if using a token revocation strategy.
    return res.status(200).json({ message: 'Logout successful.' });
  }
};

module.exports = AuthController;