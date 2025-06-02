const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
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
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({
      success: false,
      message: err.message || 'Error registering user'
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt for email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ 
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials'
      });
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
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ 
      success: false,
      message: 'Error logging in'
    });
  }
};

// Get staff members
exports.getStaff = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff members'
    });
  }
};

// Get current logged in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Error getting user details:', err);
    res.status(500).json({
      success: false,
      message: 'Error getting user details'
    });
  }
};

// Update user details
exports.updateDetails = async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Error updating user details:', err);
    res.status(400).json({
      success: false,
      message: err.message || 'Error updating user details'
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(400).json({
      success: false,
      message: err.message || 'Error updating password'
    });
  }
}; 