const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    console.log('Creating booking with data:', req.body);
    
    // Validate required fields
    const { service, date, time } = req.body;
    
    if (!service || !date || !time) {
      console.log('Missing required fields:', { service, date, time });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: service, date, and time are required'
      });
    }

    // Create booking object with all possible fields
    const bookingData = {
      user: req.user.id,
      service: req.body.service,
      serviceId: req.body.serviceId,
      staff: req.body.staff,
      staffId: req.body.staffId,
      date: new Date(date),
      time: req.body.time,
      duration: req.body.duration || '1 hour',
      notes: req.body.notes,
      status: 'pending'
    };

    console.log('Processed booking data:', bookingData);

    const booking = new Booking(bookingData);
    await booking.save();

    console.log('New booking created:', booking);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(400).json({
      success: false,
      message: err.message || 'Error creating booking'
    });
  }
};

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