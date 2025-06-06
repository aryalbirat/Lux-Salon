const Booking = require('../models/Booking');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all bookings
// @route   GET /api/bookings/all
// @access  Private/Admin
exports.getAllBookings = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Finding resource
  query = Booking.find(JSON.parse(queryStr)).populate('user', 'name email');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-date');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Booking.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bookings = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: bookings.length,
    pagination,
    data: bookings
  });
});

// @desc    Get bookings for a specific user
// @route   GET /api/bookings/user/:userId
// @access  Private/Admin
exports.getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.params.userId })
    .populate('staff', 'name')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate('user', 'name email');

  if (!booking) {
    return next(new ErrorResponse(`No booking found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to access this booking`, 401));
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  
  // Set default values for required fields if not provided
  if (!req.body.staff) {
    req.body.staff = 'Available Stylist';
  }
  
  if (!req.body.package) {
    req.body.package = 'Standard Package';
  }

  const booking = await Booking.create(req.body);

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`No booking found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this booking`, 401));
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`No booking found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete this booking`, 401));
  }

  await Booking.deleteOne({ _id: booking._id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Get user's current bookings
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Get current date at start of day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const bookings = await Booking.find({
    user: req.user.id,
    date: { $gte: today }
  })
    .sort({ date: 1, time: 1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email');
    
  const total = await Booking.countDocuments({
    user: req.user.id,
    date: { $gte: today }
  });
  
  res.json({
    success: true,
    data: bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get user's booking history
exports.getBookingHistory = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Get current date at start of day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const bookings = await Booking.find({
    user: req.user.id,
    date: { $lt: today }
  })
    .sort({ date: -1, time: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email');
    
  const total = await Booking.countDocuments({
    user: req.user.id,
    date: { $lt: today }
  });
  
  res.json({
    success: true,
    data: bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Admin: Update booking status
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate('user', 'name email');
  
  if (!booking) {
    return next(new ErrorResponse(`No booking found with id of ${req.params.id}`, 404));
  }
  
  res.json({
    success: true,
    data: booking
  });
});
