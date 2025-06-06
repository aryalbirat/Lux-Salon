const User = require('../models/User');
const Booking = require('../models/Booking');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Get user's bookings
  const bookings = await Booking.find({ user: req.params.id })
    .populate('staff', 'name')
    .sort('-date');

  // Add bookings to user object
  const userWithBookings = {
    ...user.toObject(),
    bookings
  };
  res.status(200).json({ success: true, data: userWithBookings });
});

// @desc    Get all clients
// @route   GET /api/users/clients
// @access  Private/Admin
exports.getClients = asyncHandler(async (req, res, next) => {
  const clients = await User.find({ role: 'client' }).select('-password');

  res.status(200).json({
    success: true,
    data: clients
  });
});