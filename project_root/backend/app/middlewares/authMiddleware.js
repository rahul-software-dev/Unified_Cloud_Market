// project-root/backend/app/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const logger = require('../../shared/utils/logger');

/**
 * Authentication middleware that verifies JWT tokens.
 * It expects the "Authorization" header to have a Bearer token.
 * If the token is valid, it attaches the decoded token to req.user.
 * Otherwise, it responds with a 401 Unauthorized error.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed.' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload (e.g., user ID) to req.user
    next();
  } catch (error) {
    logger.error(`AuthMiddleware error: ${error.message}`);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;