const User = require('../models/User');

// @desc    Get all staff members
// @route   GET /api/users/staff
// @access  Public
exports.getStaff = async (req, res, next) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-password');
    
    res.status(200).json({
      success: true,
      count: staff.length,
      staff: staff.map(staffMember => staffMember.toPublicProfile())
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single staff member
// @route   GET /api/users/staff/:id
// @access  Public
exports.getStaffMember = async (req, res, next) => {
  try {
    const staffMember = await User.findOne({ 
      _id: req.params.id,
      role: 'staff'
    }).select('-password');
    
    if (!staffMember) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      staff: staffMember.toPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(user => user.toPublicProfile())
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new staff member (admin only)
// @route   POST /api/users/staff
// @access  Private (Admin only)
exports.createStaffMember = async (req, res, next) => {
  try {
    // Set role to staff
    req.body.role = 'staff';
    
    const user = await User.create(req.body);
    
    res.status(201).json({
      success: true,
      staff: user.toPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};
