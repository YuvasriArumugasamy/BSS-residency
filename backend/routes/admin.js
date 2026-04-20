const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Simple auth middleware
const adminAuth = (req, res, next) => {
  const { username, password } = req.headers;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// POST /api/admin/login — Verify credentials
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// GET /api/admin/bookings — All bookings
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const { status, roomType, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (roomType) filter.roomType = roomType;

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/bookings/:id — Update booking status
router.patch('/bookings/:id', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/bookings/:id — Delete booking
router.delete('/bookings/:id', adminAuth, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/stats — Dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: 'Pending' });
    const confirmed = await Booking.countDocuments({ status: 'Confirmed' });
    const cancelled = await Booking.countDocuments({ status: 'Cancelled' });
    const byRoom = await Booking.aggregate([
      { $group: { _id: '$roomType', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, stats: { total, pending, confirmed, cancelled, byRoom } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
