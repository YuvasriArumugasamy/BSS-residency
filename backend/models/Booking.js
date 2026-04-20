const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    roomType: {
      type: String,
      required: true,
      enum: [
        'Double Bed',
        'Double Bed A/C',
        'Four Bed',
        'Four Bed A/C',
        // legacy values kept for backward compatibility
        'AC Room',
        'Non-AC Room',
        'Family Room',
        'Dormitory',
        'Suite Room',
      ],
    },
    rooms: { type: Number, default: 1, min: 1 },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    message: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
