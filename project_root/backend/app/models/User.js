// project-root/backend/app/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Regular expression to validate email format
const emailRegex = /^\S+@\S+\.\S+$/;

/**
 * UserSchema defines the structure for user documents.
 * It includes fields for email, password, name, and role.
 * It also provides password hashing and JSON transformation to hide sensitive data.
 */
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegex, 'Please fill a valid email address.']
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'user'
  }
}, { timestamps: true });

// Remove password field when converting to JSON
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

// Pre-save hook to hash the password if it has been modified
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare candidate password with stored hash
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// (Optional) Instance method to generate a password reset token could be added here
// e.g., using crypto.randomBytes() and saving a reset expiry field

module.exports = mongoose.model('User', UserSchema);