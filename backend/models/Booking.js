const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true },
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
        'AC Double Bed',
        'Non-AC Double Bed',
        'Deluxe AC',
        'Suite',
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
    roomNumber: { type: String, default: '' },
    guests: { type: Number, required: true, min: 1 },
    message: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Checked-out'],
      default: 'Pending',
    },

    // Online Check-in Fields
    checkedInOnline: { type: Boolean, default: false },
    checkinData: {
      fullName: { type: String, default: '' },
      age: { type: Number },
      gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      idType: { type: String, enum: ['Aadhaar', 'Driving License', 'Passport', 'Voter ID', ''], default: '' },
      idNumber: { type: String, default: '' },
      idProofImage: { type: String, default: '' }, // base64 image
      numberOfGuests: { type: Number, default: 1 },
      guestNames: [{ type: String }],
      vehicleNumber: { type: String, default: '' },
      specialRequests: { type: String, default: '' },
      checkinTime: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
