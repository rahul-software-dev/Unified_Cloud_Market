// project-root/backend/app/models/Product.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * ProductSchema defines the structure for product documents.
 * Represents items listed in the unified cloud marketplace.
 */
const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required.'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required.'],
    min: [0, 'Price cannot be negative.']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  marketplace: {
    type: String,
    enum: ['AWS', 'Azure', 'GCP'],
    required: [true, 'Marketplace is required.'],
    index: true
  },
  available: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Virtual property for a formatted price string
ProductSchema.virtual('formattedPrice').get(function() {
  return `${this.currency} ${this.price.toFixed(2)}`;
});

// Ensure virtual fields are serialized
ProductSchema.set('toJSON', { virtuals: true });

// Example: Index on marketplace and price for faster querying
ProductSchema.index({ marketplace: 1, price: 1 });

module.exports = mongoose.model('Product', ProductSchema);