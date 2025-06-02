const express = require('express');
const { 
  createBooking, 
  getMyBookings, 
  getBookingHistory,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getBookings,
  getBooking,
  updateBooking,
  getUserBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// Regular user routes
router.get('/me', getMyBookings);
router.get('/me/history', getBookingHistory);
router.post('/', createBooking);

// Admin routes
router.get('/all', authorize('admin'), getAllBookings);
router.put('/:id/status', authorize('admin'), updateBookingStatus);
router.delete('/:id', authorize('admin'), deleteBooking);

// Get bookings for current user
router.get('/me', getBookings);

// Get bookings for specific user (admin only)
router.get('/user/:userId', authorize('admin'), getUserBookings);

// Get single booking
router.get('/:id', getBooking);

// Update booking
router.put('/:id', updateBooking);

// Delete booking
router.delete('/:id', deleteBooking);

module.exports = router; 