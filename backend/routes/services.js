const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getAllServices, 
  getServiceById, 
  createService,
  updateService,
  deleteService,
  getFeaturedServices
} = require('../controllers/services');

// Public routes
router.get('/', getAllServices);
router.get('/featured', getFeaturedServices);
router.get('/:id', getServiceById);

// Admin routes
router.post('/', protect, authorize('admin'), createService);
router.put('/:id', protect, authorize('admin'), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

module.exports = router;
