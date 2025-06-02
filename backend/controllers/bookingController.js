const Booking = require('../models/Booking');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // If not admin, show only user's bookings
  if (req.user.role !== 'admin') {
    reqQuery.user = req.user.id;
  }

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
    query = query.sort('-createdAt');
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

  await booking.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

exports.getMyBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('Fetching bookings for user:', req.user.id);
    
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

    console.log('Current bookings found:', bookings.length);
    
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
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(400).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

exports.getBookingHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('Fetching booking history for user:', req.user.id);
    
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

    console.log('Historical bookings found:', bookings.length);
    
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
  } catch (err) {
    console.error('Error fetching booking history:', err);
    res.status(400).json({
      success: false,
      message: 'Error fetching booking history'
    });
  }
};

// Admin: Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const bookings = await Booking.find()
      .sort({ date: -1, time: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');

    const total = await Booking.countDocuments();

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
  } catch (err) {
    console.error('Error fetching all bookings:', err);
    res.status(400).json({
      success: false,
      message: 'Error fetching all bookings'
    });
  }
};

// Admin: Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(400).json({
      success: false,
      message: 'Error updating booking status'
    });
  }
};

// Admin: Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(400).json({
      success: false,
      message: 'Error deleting booking'
    });
  }
}; 