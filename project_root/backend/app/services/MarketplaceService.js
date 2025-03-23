// project-root/backend/app/services/MarketplaceService.js

const Product = require('../models/Product');
const logger = require('../../shared/utils/logger');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Cache with a 5-minute TTL

/**
 * MarketplaceService handles business logic related to marketplace products.
 */
const MarketplaceService = {
  /**
   * Retrieves all products.
   * Supports optional filtering by marketplace and pagination.
   * @param {Object} [options] - Optional filtering options.
   * @param {String} [options.marketplace] - Filter by marketplace (AWS, Azure, GCP).
   * @param {Number} [options.page=1] - Page number.
   * @param {Number} [options.limit=10] - Number of records per page.
   * @returns {Promise<Object>} Result object with products and pagination info.
   */
  getAllProducts: async (options = {}) => {
    try {
      const { marketplace, page = 1, limit = 10 } = options;
      const query = {};
      if (marketplace) query.marketplace = marketplace;

      // Use cache key based on filter and pagination options
      const cacheKey = `products:${JSON.stringify(query)}:page${page}:limit${limit}`;
      let productsResult = cache.get(cacheKey);
      if (productsResult) {
        return productsResult;
      }

      const skip = (page - 1) * limit;
      const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalCount = await Product.countDocuments(query);
      productsResult = {
        products,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      };

      cache.set(cacheKey, productsResult);
      return productsResult;
    } catch (error) {
      logger.error(`MarketplaceService.getAllProducts error: ${error.message}`);
      throw error;
    }
  },

  /**
   * Creates a new product.
   * @param {Object} productData - Data for the new product.
   * @returns {Promise<Object>} The created product.
   */
  createProduct: async (productData) => {
    try {
      const product = new Product(productData);
      await product.save();
      // Invalidate relevant cache entries
      cache.flushAll();
      return product;
    } catch (error) {
      logger.error(`MarketplaceService.createProduct error: ${error.message}`);
      throw error;
    }
  },

  /**
   * Updates an existing product.
   * @param {String} productId - The ID of the product to update.
   * @param {Object} updateData - Data to update.
   * @returns {Promise<Object|null>} The updated product or null if not found.
   */
  updateProduct: async (productId, updateData) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
        new: true,
        runValidators: true
      });
      cache.flushAll();
      return updatedProduct;
    } catch (error) {
      logger.error(`MarketplaceService.updateProduct error: ${error.message}`);
      throw error;
    }
  },

  /**
   * Deletes a product.
   * @param {String} productId - The ID of the product to delete.
   * @returns {Promise<void>}
   */
  deleteProduct: async (productId) => {
    try {
      await Product.findByIdAndDelete(productId);
      cache.flushAll();
    } catch (error) {
      logger.error(`MarketplaceService.deleteProduct error: ${error.message}`);
      throw error;
    }
  }
};

module.exports = MarketplaceService;