// project-root/backend/app/routes/offerRoutes.js

const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const OfferController = require('../controllers/OfferController');
const authMiddleware = require('../../shared/middlewares/authMiddleware');

// Protect all offer routes
router.use(authMiddleware);

/**
 * @route   GET /offers
 * @desc    Retrieve all offers.
 */
router.get('/', asyncHandler(OfferController.listOffers));

/**
 * @route   POST /offers
 * @desc    Create a new offer.
 */
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Offer title is required.'),
    body('discount')
      .isFloat({ min: 0 })
      .withMessage('Discount must be a positive number.'),
    body('product').isMongoId().withMessage('Invalid product ID.'),
    body('validFrom')
      .isISO8601()
      .withMessage('Valid from date must be a valid ISO8601 date.'),
    body('validTo')
      .isISO8601()
      .withMessage('Valid to date must be a valid ISO8601 date.')
  ],
  asyncHandler(OfferController.createOffer)
);

/**
 * @route   PUT /offers/:id
 * @desc    Update an existing offer.
 */
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid offer ID.'),
    body('title').optional().notEmpty().withMessage('Offer title cannot be empty.'),
    body('discount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Discount must be positive.'),
    body('validFrom')
      .optional()
      .isISO8601()
      .withMessage('Valid from date must be a valid ISO8601 date.'),
    body('validTo')
      .optional()
      .isISO8601()
      .withMessage('Valid to date must be a valid ISO8601 date.')
  ],
  asyncHandler(OfferController.updateOffer)
);

/**
 * @route   DELETE /offers/:id
 * @desc    Delete an offer.
 */
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid offer ID.')],
  asyncHandler(OfferController.deleteOffer)
);

module.exports = router;