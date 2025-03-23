// project-root/backend/app/services/OfferService.js

const Offer = require('../models/Offer');
const logger = require('../../shared/utils/logger');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });

/**
 * OfferService handles business logic for promotional offers.
 */
const OfferService = {
  /**
   * Retrieves all offers, with optional population of associated product details.
   * @returns {Promise<Array>} List of offers.
   */
  getAllOffers: async () => {
    try {
      const cacheKey = 'offers:all';
      let offers = cache.get(cacheKey);
      if (offers) {
        return offers;
      }
      offers = await Offer.find({}).populate('product').lean();
      cache.set(cacheKey, offers);
      return offers;
    } catch (error) {
      logger.error(`OfferService.getAllOffers error: ${error.message}`);
      throw error;
    }
  },

  /**
   * Retrieves only active offers using a virtual on the model.
   * @returns {Promise<Array>} List of active offers.
   */
  getActiveOffers: async () => {
    try {
      const cacheKey = 'offers:active';
      let activeOffers = cache.get(cacheKey);
      if (activeOffers) {
        return activeOffers;
      }
      // Leverage the static method defined in the Offer model
      activeOffers = await Offer.getActiveOffers();
      cache.set(cacheKey, activeOffers);
      return activeOffers;
    } catch (error) {
      logger.error(`OfferService.getActiveOffers error: ${error.message}`);
      throw error;
    }
  },

  /**
   * Creates a new offer.
   * @param {Object} offerData - Data for the new offer.
   * @returns {Promise<Object>} The created offer.
   */
  createOffer: async (offerData) => {
    try {
      const offer = new Offer(offerData);
      await offer.save();
      cache.flushAll();
      return offer;
    } catch (error) {
      logger.error(`OfferService.createOffer error: ${error.message}`);
      throw error;
    }
  },

  /**
   * Updates an existing offer.
   * @param {String} offerId - The ID of the offer to update.
   * @param {Object} updateData - Data to update.
   * @returns {Promise<Object|null>} The updated offer or null if not found.
   */
  updateOffer: async (offerId, updateData) => {
    try {
      const updatedOffer = await Offer.findByIdAndUpdate(offerId, updateData, {
        new: true,
        runValidators: true
      });
      cache.flushAll();
      return updatedOffer;
    } catch (error) {
      logger.error(`OfferService.updateOffer error: ${error.message}`);
      throw error;
    }
  },

  /**
   * Deletes an offer.
   * @param {String} offerId - The ID of the offer to delete.
   * @returns {Promise<void>}
   */
  deleteOffer: async (offerId) => {
    try {
      await Offer.findByIdAndDelete(offerId);
      cache.flushAll();
    } catch (error) {
      logger.error(`OfferService.deleteOffer error: ${error.message}`);
      throw error;
    }
  }
};

module.exports = OfferService;