const express = require('express');
const { getClients, getUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

// Admin routes
router.get('/clients', authorize('admin'), getClients);
router.get('/:id', authorize('admin'), getUser);

module.exports = router; 