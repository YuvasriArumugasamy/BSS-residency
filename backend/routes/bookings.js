const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings — Create new booking
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, roomType, checkIn, checkOut, guests, rooms, message } = req.body;

    if (!name || !phone || !roomType || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      return res.status(400).json({ success: false, message: 'Check-out must be after check-in.' });
    }

    const roomCount = Math.max(1, Number(rooms) || 1);
    const booking = new Booking({
      name,
      phone,
      email,
      roomType,
      checkIn,
      checkOut,
      guests,
      rooms: roomCount,
      message,
    });
    await booking.save();

    // Emit real-time event for admin dashboard
    const io = req.app.get('io');
    if (io) {
      io.emit('booking:new', booking);
    }

    res.status(201).json({ success: true, message: 'Booking received! We will confirm shortly.', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

module.exports = router;
