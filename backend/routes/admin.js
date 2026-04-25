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

// GET /api/admin/bookings — All bookings with search
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const { status, roomType, page = 1, limit = 10, search, dateFrom, dateTo } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (roomType) filter.roomType = roomType;

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: regex },
        { phone: regex },
        { email: regex },
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

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

    const io = req.app.get('io');
    if (io) {
      io.emit('booking:updated', booking);
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/bookings/:id — Delete booking
router.delete('/bookings/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Booking not found' });

    const io = req.app.get('io');
    if (io) {
      io.emit('booking:deleted', { _id: req.params.id });
    }

    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/stats — Dashboard stats with revenue
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: 'Pending' });
    const confirmed = await Booking.countDocuments({ status: 'Confirmed' });
    const cancelled = await Booking.countDocuments({ status: 'Cancelled' });
    const byRoom = await Booking.aggregate([
      { $group: { _id: '$roomType', count: { $sum: 1 } } }
    ]);

    // Today's bookings
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({ createdAt: { $gte: startOfDay } });

    // This week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const weekBookings = await Booking.countDocuments({ createdAt: { $gte: startOfWeek } });

    // This month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthBookings = await Booking.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Recent activity (last 10 bookings)
    const recentActivity = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name roomType status createdAt phone');

    res.json({
      success: true,
      stats: {
        total, pending, confirmed, cancelled, byRoom,
        todayBookings, weekBookings, monthBookings,
        recentActivity,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/export — Export bookings as CSV
router.get('/export', adminAuth, async (req, res) => {
  try {
    const { status, roomType, dateFrom, dateTo } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (roomType) filter.roomType = roomType;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });

    const header = 'Name,Phone,Email,Room Type,Rooms,Check-in,Check-out,Guests,Status,Booked On\n';
    const rows = bookings.map(b => {
      const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '';
      return [
        `"${(b.name || '').replace(/"/g, '""')}"`,
        `"${b.phone || ''}"`,
        `"${b.email || ''}"`,
        `"${b.roomType || ''}"`,
        b.rooms || 1,
        fmt(b.checkIn),
        fmt(b.checkOut),
        b.guests || 1,
        b.status || 'Pending',
        fmt(b.createdAt),
      ].join(',');
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=bss-bookings.csv');
    res.send(header + rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
