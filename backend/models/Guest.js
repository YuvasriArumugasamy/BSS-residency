const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, trim: true },
    idProof: { type: String }, // e.g. Aadhaar, License
    totalStays: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastStay: { type: Date },
    loyaltyLevel: { 
      type: String, 
      enum: ['New', 'Regular', 'VIP'], 
      default: 'New' 
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guest', guestSchema);
