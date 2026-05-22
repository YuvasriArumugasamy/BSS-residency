const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true },
    profileImage: { type: String, default: '' }, // Add this for profile photos
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
