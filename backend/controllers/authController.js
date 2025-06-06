const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('Email already registered', 400));
  }

  const user = new User({ name, email, password });
  await user.save();

  // Create token for immediate login
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  // Return success response with token and user data
  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'client' // Default to 'client' if role is not set
    }
  });
});

// Get staff members
exports.getStaff = asyncHandler(async (req, res, next) => {
  // Get all users with role 'staff'
  const staff = await User.find({ role: 'staff' })
    .select('name email specialty')
    .lean();
  // If no staff found, return default staff
  if (!staff || staff.length === 0) {
    const defaultStaff = [
      { _id: '1', name: 'Sarah Thompson', specialty: 'Hair Styling' },
      { _id: '2', name: 'Maria Garcia', specialty: 'Color Specialist' },
      { _id: '3', name: 'Emma Wilson', specialty: 'Skincare Expert' },
      { _id: '4', name: 'Lisa Chen', specialty: 'Nail Technician' }
    ];
    return res.json({
      success: true,
      data: defaultStaff
    });
  }
  res.json({
    success: true,
    data: staff
  });
});

// Get current logged in user
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  
  res.json({
    success: true,
    data: user
  });
});

// Update user details
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body;
  const fieldsToUpdate = {
    ...(name && { name }),
    ...(email && { email }),
    ...(phone && { phone })
  };

  const user = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  res.json({
    success: true,
    data: user
  });
});

// Update password
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});