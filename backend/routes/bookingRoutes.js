const express = require('express');
const { createBooking, getMyBookings, getBookingHistory } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// Get user's bookings
router.get('/me', getMyBookings);

// Get user's booking history
router.get('/me/history', getBookingHistory);

// Create a new booking
router.post('/', createBooking);

module.exports = router; 