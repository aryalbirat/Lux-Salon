const express = require('express');
const { login, signup, getMe, updateDetails, updatePassword, getStaff } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/staff', getStaff);

module.exports = router; 