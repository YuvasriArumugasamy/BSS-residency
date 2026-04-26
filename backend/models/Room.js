const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['AC Double Bed', 'Non-AC Double Bed', 'Three Bed', 'Four Bed', 'Four Bed A/C', 'Deluxe AC', 'Suite'],
    },
    price: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['Available', 'Occupied', 'Maintenance'], 
      default: 'Available' 
    },
    photos: [{ type: String }],
    amenities: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
