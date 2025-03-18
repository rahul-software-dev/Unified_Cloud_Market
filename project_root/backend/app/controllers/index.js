// project-root/backend/app/controllers/index.js

const AuthController = require('./AuthController');
const MarketplaceController = require('./MarketplaceController');
const OfferController = require('./OfferController');
const UserController = require('./UserController');

module.exports = {
  AuthController,
  MarketplaceController,
  OfferController,
  UserController
};