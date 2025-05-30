const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  getAppointments, 
  getAppointment, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment, 
  getAvailableTimeSlots,
  getAppointmentHistory
} = require('../controllers/appointments');

// Routes
router.get('/', protect, getAppointments);
router.get('/history', protect, getAppointmentHistory);
router.get('/available/:date', getAvailableTimeSlots);
router.get('/available/:date/:staffId', getAvailableTimeSlots);
router.get('/:id', protect, getAppointment);
// Allow appointments to be created without authentication for demo purposes
router.post('/', createAppointment);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
