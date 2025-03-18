// project-root/backend/app/controllers/OfferController.js

const OfferService = require('../services/OfferService');
const logger = require('../../shared/utils/logger');

/**
 * OfferController manages offer-related operations.
 */
const OfferController = {
  /**
   * Retrieve all offers.
   */
  listOffers: async (req, res, next) => {
    try {
      const offers = await OfferService.getAllOffers();
      return res.json(offers);
    } catch (error) {
      logger.error(`OfferController.listOffers error: ${error.message}`);
      next(error);
    }
  },

  /**
   * Create a new offer.
   * Expects offer details in req.body.
   */
  createOffer: async (req, res, next) => {
    try {
      const offerData = req.body;
      if (!offerData.title || !offerData.discount) {
        return res.status(400).json({ error: 'Offer title and discount are required.' });
      }
      const newOffer = await OfferService.createOffer(offerData);
      return res.status(201).json(newOffer);
    } catch (error) {
      logger.error(`OfferController.createOffer error: ${error.message}`);
      next(error);
    }
  },

  /**
   * Update an existing offer.
   * Expects offer ID in req.params.id and update data in req.body.
   */
  updateOffer: async (req, res, next) => {
    try {
      const offerId = req.params.id;
      const updateData = req.body;
      if (!offerId) {
        return res.status(400).json({ error: 'Offer ID is required.' });
      }
      const updatedOffer = await OfferService.updateOffer(offerId, updateData);
      if (!updatedOffer) {
        return res.status(404).json({ error: 'Offer not found.' });
      }
      return res.json(updatedOffer);
    } catch (error) {
      logger.error(`OfferController.updateOffer error: ${error.message}`);
      next(error);
    }
  },

  /**
   * Delete an offer.
   * Expects offer ID in req.params.id.
   */
  deleteOffer: async (req, res, next) => {
    try {
      const offerId = req.params.id;
      if (!offerId) {
        return res.status(400).json({ error: 'Offer ID is required.' });
      }
      await OfferService.deleteOffer(offerId);
      return res.status(204).send();
    } catch (error) {
      logger.error(`OfferController.deleteOffer error: ${error.message}`);
      next(error);
    }
  }
};

module.exports = OfferController;