const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '919344989393';

// Helper: build a wa.me confirmation link for a booking
function buildWaConfirmLink(booking) {
  const checkIn = new Date(booking.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const checkOut = new Date(booking.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const msg =
    `✅ *BSS Residency – Booking Confirmed!*\n\n` +
    `Dear ${booking.name},\n\n` +
    `Your booking has been *confirmed*. Here are your details:\n\n` +
    `🆔 Booking ID: *${booking._id}*\n` +
    `🛏️ Room: *${booking.roomType}*${booking.roomNumber ? ` (Room #${booking.roomNumber})` : ''}\n` +
    `📅 Check-in: *${checkIn}*\n` +
    `📅 Check-out: *${checkOut}*\n` +
    `👥 Guests: *${booking.guests}*\n\n` +
    `📍 BSS Residency, Bus Stand, Near Anna Statue, Courtallam – 627 802\n\n` +
    `We look forward to hosting you! 🙏`;

  // Build link to guest's number
  const guestPhone = booking.phone.replace(/[^0-9]/g, '');
  const formattedPhone = guestPhone.startsWith('91') ? guestPhone : `91${guestPhone}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
}

function buildWaCancelLink(booking, reason = '') {
  const msg =
    `❌ *BSS Residency – Booking Update*\n\n` +
    `Dear ${booking.name},\n\n` +
    `We regret to inform you that your booking (ID: *${booking._id}*) has been *cancelled*.\n` +
    (reason ? `Reason: ${reason}\n` : '') +
    `\nPlease contact us to rebook or for further assistance.\n📞 +91 88385 99755`;
  const guestPhone = booking.phone.replace(/[^0-9]/g, '');
  const formattedPhone = guestPhone.startsWith('91') ? guestPhone : `91${guestPhone}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
}

// Simple auth middleware
const adminAuth = (req, res, next) => {
  const { username, password } = req.headers;
  const targetUser = process.env.ADMIN_USERNAME || 'santhosh';
  const targetPass = process.env.ADMIN_PASSWORD || 'santhosh@123';
  if (username === targetUser && password === targetPass) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// POST /api/admin/login — Verify credentials
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const targetUser = process.env.ADMIN_USERNAME || 'santhosh';
  const targetPass = process.env.ADMIN_PASSWORD || 'santhosh@123';

  if (username === targetUser && password === targetPass) {
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

// PATCH /api/admin/bookings/:id — Update booking status / roomNumber
router.patch('/bookings/:id', adminAuth, async (req, res) => {
  try {
    const { status, roomNumber, cancellationReason } = req.body;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (roomNumber !== undefined) updateFields.roomNumber = roomNumber;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Automation: Update room status if roomNumber is assigned
    if (booking.roomNumber) {
      if (status === 'Confirmed') {
        await Room.findOneAndUpdate({ roomNumber: booking.roomNumber }, { status: 'Occupied' });
      } else if (status === 'Checked-out' || status === 'Cancelled') {
        await Room.findOneAndUpdate({ roomNumber: booking.roomNumber }, { status: 'Available' });
      }
    }

    // Build WhatsApp link for admin to send to guest
    let waLink = null;
    if (status === 'Confirmed') {
      waLink = buildWaConfirmLink(booking);
    } else if (status === 'Cancelled') {
      waLink = buildWaCancelLink(booking, cancellationReason);
    }

    res.json({ success: true, booking, waLink });
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
    const totalBookings = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: 'Pending' });
    const confirmed = await Booking.countDocuments({ status: 'Confirmed' });
    const cancelled = await Booking.countDocuments({ status: 'Cancelled' });

    // Revenue tracking (Sum of all real payments)
    const payments = await Payment.find({ status: 'Paid' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Occupancy (Rooms available vs occupied)
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const availableRooms = await Room.countDocuments({ status: 'Available' });

    // Today's activity
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);

    const checkInsToday = await Booking.countDocuments({
      checkIn: { $gte: todayStart, $lte: todayEnd },
      status: { $ne: 'Cancelled' }
    });
    const checkOutsToday = await Booking.countDocuments({
      checkOut: { $gte: todayStart, $lte: todayEnd },
      status: { $ne: 'Cancelled' }
    });

    // Room performance (aggregate by type)
    const byRoom = await Booking.aggregate([
      { $group: { _id: '$roomType', count: { $sum: 1 } } }
    ]);

    // Revenue history (last 7 days)
    const revenueHistory = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end = new Date(d); end.setHours(23, 59, 59, 999);

      const dayPayments = await Payment.find({
        date: { $gte: start, $lte: end },
        status: 'Paid'
      });
      const amount = dayPayments.reduce((sum, p) => sum + p.amount, 0);
      revenueHistory.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        amount
      });
    }

    res.json({
      success: true,
      stats: {
        totalBookings, pending, confirmed, cancelled, byRoom,
        totalRevenue, availableRooms, occupiedRooms, totalRooms,
        checkInsToday, checkOutsToday,
        revenueHistory
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ROOM ROUTES ---

router.get('/rooms', adminAuth, async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 }).collation({ locale: 'en', numericOrdering: true });
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/rooms', adminAuth, async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/rooms/:id', adminAuth, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/rooms/:id', adminAuth, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- GUEST ROUTES ---
router.get('/guests', adminAuth, async (req, res) => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 });
    res.json({ success: true, guests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- PAYMENT ROUTES ---
router.get('/payments', adminAuth, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/payments — Record a new payment manually
router.post('/payments', adminAuth, async (req, res) => {
  try {
    const { guestName, bookingId, amount, method, status } = req.body;
    if (!guestName || !amount) {
      return res.status(400).json({ success: false, message: 'Guest name and amount are required.' });
    }
    const payment = new Payment({
      guestName,
      bookingId: bookingId || undefined,
      amount: Number(amount),
      method: method || 'Cash',
      status: status || 'Paid',
      date: new Date(),
    });
    await payment.save();
    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/payments/:id — Remove a payment record
router.delete('/payments/:id', adminAuth, async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- REVIEW ROUTES ---
router.get('/reviews', adminAuth, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- NOTIFICATION ROUTES ---
router.get('/notifications', adminAuth, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
