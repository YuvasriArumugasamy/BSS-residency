const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['Double Bed', 'Double Bed A/C', 'Three Bed', 'Four Bed A/C'],
    },
    price: { type: Number, required: true }, // Current active price
    nonSeasonPrice: { type: Number },
    seasonPrice: { type: Number },
    weekendPrice: { type: Number },
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
