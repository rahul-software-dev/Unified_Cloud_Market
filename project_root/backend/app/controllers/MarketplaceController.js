// project-root/backend/app/controllers/MarketplaceController.js

const MarketplaceService = require('../services/MarketplaceService');
const logger = require('../../shared/utils/logger');

/**
 * MarketplaceController manages marketplace-related operations.
 */
const MarketplaceController = {
  /**
   * Retrieve all products from the marketplace.
   */
  listProducts: async (req, res, next) => {
    try {
      const products = await MarketplaceService.getAllProducts();
      return res.json(products);
    } catch (error) {
      logger.error(`MarketplaceController.listProducts error: ${error.message}`);
      next(error);
    }
  },

  /**
   * Add a new product to the marketplace.
   * Expects product details in req.body.
   */
  addProduct: async (req, res, next) => {
    try {
      const productData = req.body;
      // Basic input validation (further validation can be applied using express-validator)
      if (!productData.name || !productData.price) {
        return res.status(400).json({ error: 'Product name and price are required.' });
      }
      const newProduct = await MarketplaceService.createProduct(productData);
      return res.status(201).json(newProduct);
    } catch (error) {
      logger.error(`MarketplaceController.addProduct error: ${error.message}`);
      next(error);
    }
  },

  /**
   * Update an existing product.
   * Expects product ID as req.params.id and update data in req.body.
   */
  updateProduct: async (req, res, next) => {
    try {
      const productId = req.params.id;
      const updateData = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required.' });
      }
      const updatedProduct = await MarketplaceService.updateProduct(productId, updateData);
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      return res.json(updatedProduct);
    } catch (error) {
      logger.error(`MarketplaceController.updateProduct error: ${error.message}`);
      next(error);
    }
  },

  /**
   * Delete a product from the marketplace.
   * Expects product ID as req.params.id.
   */
  deleteProduct: async (req, res, next) => {
    try {
      const productId = req.params.id;
      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required.' });
      }
      await MarketplaceService.deleteProduct(productId);
      return res.status(204).send();
    } catch (error) {
      logger.error(`MarketplaceController.deleteProduct error: ${error.message}`);
      next(error);
    }
  }
};

module.exports = MarketplaceController;