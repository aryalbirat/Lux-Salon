const User = require('../models/User');
const Booking = require('../models/Booking');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
});

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

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: {} });
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