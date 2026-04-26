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
      status: 'Pending',
    });
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking received! We will confirm your booking via WhatsApp shortly.',
      booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// GET /api/bookings/:id — Get booking status by ID (for guests)
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found. Please check your Booking ID.' });
    }
    // Return only safe fields to the guest
    res.json({
      success: true,
      booking: {
        _id: booking._id,
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        roomType: booking.roomType,
        roomNumber: booking.roomNumber,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        rooms: booking.rooms,
        status: booking.status,
        message: booking.message,
        createdAt: booking.createdAt,
      },
    });
  } catch (err) {
    // Handle invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Invalid Booking ID format.' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/bookings/availability — Get availability by room type
router.get('/availability', async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'Available' });
    const availability = {};

    // Group available counts by type — matches constants.js ROOMS[].name
    rooms.forEach(r => {
      const key = r.type; // e.g. "Double Bed", "Double Bed A/C"
      availability[key] = (availability[key] || 0) + 1;
    });

    res.json({ success: true, availability });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
