const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');

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

    res.status(201).json({ success: true, message: 'Booking received! We will confirm shortly.', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// GET /api/bookings/availability — Get availability by room type
router.get('/availability', async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'Available' });
    const availability = {};
    
    // Group available counts by type
    rooms.forEach(r => {
      availability[r.type] = (availability[r.type] || 0) + 1;
    });

    res.json({ success: true, availability });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
