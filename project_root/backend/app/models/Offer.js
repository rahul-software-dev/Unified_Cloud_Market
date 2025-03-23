// project-root/backend/app/models/Offer.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * OfferSchema defines the structure for offer documents.
 * Represents promotional offers linked to products.
 */
const OfferSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required.'],
    trim: true
  },
  discount: {
    type: Number,
    required: [true, 'Discount is required.'],
    min: [0, 'Discount must be a positive number.']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Associated product is required.']
  },
  validFrom: {
    type: Date,
    required: [true, 'Offer start date is required.']
  },
  validTo: {
    type: Date,
    required: [true, 'Offer end date is required.'],
    // Custom validator to ensure validTo is after validFrom
    validate: {
      validator: function(value) {
        return value > this.validFrom;
      },
      message: 'Offer end date must be after the start date.'
    }
  },
  terms: {
    type: String,
    default: '',
    trim: true
  }
}, { timestamps: true });

// Virtual property to determine if the offer is currently active
OfferSchema.virtual('isActive').get(function() {
  const now = new Date();
  return now >= this.validFrom && now <= this.validTo;
});

// Static method to get all currently active offers
OfferSchema.statics.getActiveOffers = async function() {
  const now = new Date();
  return this.find({ validFrom: { $lte: now }, validTo: { $gte: now } });
};

// Ensure virtual fields are serialized
OfferSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Offer', OfferSchema);