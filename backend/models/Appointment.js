const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: String,
    required: [true, 'Please add a service name']
  },
  serviceId: {
    type: String,
    required: [true, 'Please add a service ID']
  },
  date: {
    type: Date,
    required: [true, 'Please add an appointment date']
  },
  time: {
    type: String,
    required: [true, 'Please add an appointment time']
  },
  duration: {
    type: String,
    required: [true, 'Please add a duration']
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
