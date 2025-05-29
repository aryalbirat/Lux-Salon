const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getStaff, 
  getStaffMember,
  getUsers,
  createStaffMember
} = require('../controllers/users');

// Public routes
router.get('/staff', getStaff);
router.get('/staff/:id', getStaffMember);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.post('/staff', protect, authorize('admin'), createStaffMember);

module.exports = router;
