const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['non-ac', 'ac', 'suite'],
    },
    price: { type: Number, required: true }, // Current active price
    nonSeasonPrice: { type: Number },
    seasonPrice: { type: Number },
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
