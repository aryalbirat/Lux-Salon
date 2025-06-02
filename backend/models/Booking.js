const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: String,
    required: true
  },
  serviceId: {
    type: Number
  },
  staff: {
    type: String,
    required: true
  },
  staffId: {
    type: String
  },
  package: {
    type: String,
    required: true
  },
  packageId: {
    type: Number
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: '1 hour'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
bookingSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Booking', bookingSchema); 