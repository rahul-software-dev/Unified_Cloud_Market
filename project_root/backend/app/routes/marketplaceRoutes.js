// project-root/backend/app/routes/marketplaceRoutes.js

const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const MarketplaceController = require('../controllers/MarketplaceController');
const authMiddleware = require('../../shared/middlewares/authMiddleware');

// Protect all marketplace routes
router.use(authMiddleware);

/**
 * @route   GET /marketplace/products
 * @desc    Retrieve all products in the marketplace.
 */
router.get('/products', asyncHandler(MarketplaceController.listProducts));

/**
 * @route   POST /marketplace/products
 * @desc    Add a new product to the marketplace.
 */
router.post(
  '/products',
  [
    body('name').notEmpty().withMessage('Product name is required.'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Product price must be a positive number.'),
    body('marketplace')
      .isIn(['AWS', 'Azure', 'GCP'])
      .withMessage('Marketplace must be one of AWS, Azure, or GCP.')
  ],
  asyncHandler(MarketplaceController.addProduct)
);

/**
 * @route   PUT /marketplace/products/:id
 * @desc    Update an existing product.
 */
router.put(
  '/products/:id',
  [
    param('id').isMongoId().withMessage('Invalid product ID.'),
    body('name').optional().notEmpty().withMessage('Product name cannot be empty.'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Product price must be positive.'),
    body('marketplace')
      .optional()
      .isIn(['AWS', 'Azure', 'GCP'])
      .withMessage('Marketplace must be one of AWS, Azure, or GCP.')
  ],
  asyncHandler(MarketplaceController.updateProduct)
);

/**
 * @route   DELETE /marketplace/products/:id
 * @desc    Delete a product from the marketplace.
 */
router.delete(
  '/products/:id',
  [param('id').isMongoId().withMessage('Invalid product ID.')],
  asyncHandler(MarketplaceController.deleteProduct)
);

module.exports = router;