const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Get all appointments for the current user
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    let query = {};
    
    // If user is a client, only return their appointments
    if (req.user.role === 'client') {
      query.client = req.user.id;
    } 
    // If user is staff, only return appointments assigned to them
    else if (req.user.role === 'staff') {
      query.staff = req.user.id;
    }
    // Admin can see all appointments
    
    const appointments = await Appointment.find(query)
      .populate('staff', 'name')
      .populate('client', 'name email phone')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('staff', 'name')
      .populate('client', 'name email phone');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if the user is authorized to view this appointment
    if (
      req.user.role === 'client' && 
      appointment.client._id.toString() !== req.user.id &&
      req.user.role !== 'admin' && 
      req.user.role !== 'staff'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this appointment'
      });
    }

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res, next) => {
  try {
    console.log('Creating appointment:', req.body);
    
    // Set client to current user if not specified
    if (!req.body.client) {
      req.body.client = req.user.id;
    }
    
    // Make sure staffId maps correctly to staff
    if (req.body.staffId && !req.body.staff) {
      req.body.staff = req.body.staffId;
    }
    
    // Ensure date is properly formatted as Date object
    if (req.body.date && typeof req.body.date === 'string') {
      req.body.date = new Date(req.body.date);
    }

    // Create appointment
    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    next(error);
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if the user is authorized to update this appointment
    if (
      req.user.role === 'client' && 
      appointment.client.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if the user is authorized to delete this appointment
    if (
      req.user.role === 'client' && 
      appointment.client.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this appointment'
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available time slots for a given date
// @route   GET /api/appointments/available/:date
// @access  Public
exports.getAvailableTimeSlots = async (req, res, next) => {
  try {
    const { date, staffId } = req.params;
    
    console.log(`Getting available slots for date: ${date}, staffId: ${staffId || 'not specified'}`);
    
    // Define all possible time slots - include AM/PM format for frontend compatibility
    const allTimeSlots = [
      '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
      '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
    ];
    
    // Always return all time slots for demonstration purposes
    res.status(200).json({
      success: true,
      data: allTimeSlots
    });
    
    return;
    
    // This code is commented out since we're just returning all time slots for simplicity
    /*
    // Parse the date properly to handle various formats
    let parsedDate;
    try {
      // Check if date is in ISO format or other common formats
      parsedDate = new Date(date);
      
      // If the date is invalid, throw an error
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }
      
      // Set time to beginning of day to match all appointments on that day
      parsedDate.setHours(0, 0, 0, 0);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format.'
      });
    }
    
    // Find all appointments for the given date
    // Use date range to capture all appointments for the day regardless of time
    const startOfDay = new Date(parsedDate);
    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    let query = { 
      date: { $gte: startOfDay, $lte: endOfDay } 
    };
    
    // Add staff filter if provided
    if (staffId) {
      query.staff = staffId;
    }
      const bookedAppointments = await Appointment.find(query);
    
    // Filter out booked time slots
    const bookedTimeSlots = bookedAppointments.map(app => app.time);
    const availableTimeSlots = allTimeSlots.filter(
      time => !bookedTimeSlots.includes(time)
    );
    
    res.status(200).json({
      success: true,
      availableTimeSlots
    });
    */
  } catch (error) {
    console.error('Error getting available time slots:', error);
    // Return default time slots on error for better user experience
    res.status(200).json({
      success: true,
      data: allTimeSlots,
      message: 'Using default time slots due to an error'
    });
  }
};

// @desc    Get past appointments for the current user
// @route   GET /api/appointments/history
// @access  Private
exports.getAppointmentHistory = async (req, res, next) => {
  try {
    let query = {
      // Only get completed, cancelled, or no-show appointments
      status: { $in: ['completed', 'cancelled', 'no-show'] }
    };
    
    // If user is a client, only return their appointments
    if (req.user.role === 'client') {
      query.client = req.user.id;
    } 
    // If user is staff, only return appointments assigned to them
    else if (req.user.role === 'staff') {
      query.staff = req.user.id;
    }
    // Admin can see all appointments
    
    const appointments = await Appointment.find(query)
      .populate('staff', 'name')
      .populate('client', 'name email phone')
      .sort({ date: -1, time: 1 }); // Sort by date descending (newest first)

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};
