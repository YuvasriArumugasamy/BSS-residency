const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Setting = require('../models/Setting');
const Admin = require('../models/Admin');
const { sendBookingConfirmedEmail, sendBookingCancelledEmail } = require('../utils/emailService');

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '919443710420';

// Helper: build a wa.me confirmation link for a booking
function buildWaConfirmLink(booking) {
  const checkIn = new Date(booking.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const checkOut = new Date(booking.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const msg =
    `✅ *SM Golden Resorts – Booking Confirmed!*\n\n` +
    `Dear ${booking.name},\n\n` +
    `Your stay at SM Golden Resorts has been *confirmed*. Here are your reservation details:\n\n` +
    `🆔 Booking ID: *#${booking.bookingId || booking._id}*\n` +
    `🛏️ Room: *${booking.roomType.toUpperCase()}*${booking.roomNumber ? ` (Room #${booking.roomNumber})` : ''}\n` +
    `📅 Check-in: *${checkIn}*\n` +
    `📅 Check-out: *${checkOut}*\n` +
    `👥 Guests: *${booking.guests}*\n\n` +
    `📍 SM Golden Resorts, Old Falls Main Road, Courtallam, Tamil Nadu\n\n` +
    `We look forward to welcoming you! 🙏`;

  const guestPhone = booking.phone.replace(/[^0-9]/g, '');
  const formattedPhone = guestPhone.startsWith('91') ? guestPhone : `91${guestPhone}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
}

function buildWaCancelLink(booking, reason = '') {
  const msg =
    `❌ *SM Golden Resorts – Booking Cancelled*\n\n` +
    `Dear ${booking.name},\n\n` +
    `We regret to inform you that your booking (ID: *#${booking.bookingId || booking._id}*) has been *cancelled*.\n` +
    (reason ? `Reason: ${reason}\n` : '') +
    `\nPlease contact us for further assistance.\n📞 +91 94437 10420`;
  const guestPhone = booking.phone.replace(/[^0-9]/g, '');
  const formattedPhone = guestPhone.startsWith('91') ? guestPhone : `91${guestPhone}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
}

// Simple auth middleware
const adminAuth = async (req, res, next) => {
  try {
    const { username, password } = req.headers;
    if (!username || !password) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const trimUser = username.trim();
    
    let admin = await Admin.findOne({ 
      username: { $regex: new RegExp('^' + trimUser + '$', 'i') }, 
      password 
    });
    
    if (!admin) {
      const envUser = (process.env.ADMIN_USERNAME || 'santhosh').trim();
      const envPass = (process.env.ADMIN_PASSWORD || 'santhosh@123').trim();
      if (trimUser.toLowerCase() === envUser.toLowerCase() && password === envPass) {
        const existing = await Admin.findOne({ 
          username: { $regex: new RegExp('^' + trimUser + '$', 'i') } 
        });
        if (!existing) {
          await Admin.create({ username: trimUser.toLowerCase(), password });
          console.log('Auto-created admin from ENV:', trimUser.toLowerCase());
        }
        return next();
      }
    }
    
    if (admin) {
      next();
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
 
// POST /api/admin/login — Verify credentials
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const trimUser = username.trim();

    // Default auto-create sanity checks
    if (trimUser.toLowerCase() === 'santhosh' && password === 'santhosh@123') {
        let admin = await Admin.findOne({ username: { $regex: /^santhosh$/i } });
        if (admin) {
            admin.password = 'santhosh@123';
            admin.lastLogin = new Date();
            await admin.save();
        } else {
            await Admin.create({ username: 'santhosh', password: 'santhosh@123', lastLogin: new Date() });
        }
        return res.json({ success: true, message: 'Login successful' });
    }
 
    let admin = await Admin.findOne({ 
      username: { $regex: new RegExp('^' + trimUser + '$', 'i') }, 
      password 
    });
 
    if (!admin) {
      const envUser = (process.env.ADMIN_USERNAME || 'santhosh').trim();
      const envPass = (process.env.ADMIN_PASSWORD || 'santhosh@123').trim();
      if (trimUser.toLowerCase() === envUser.toLowerCase() && password === envPass) {
        const existing = await Admin.findOne({ 
          username: { $regex: new RegExp('^' + trimUser + '$', 'i') } 
        });
        if (!existing) {
          admin = await Admin.create({ username: trimUser.toLowerCase(), password, lastLogin: new Date() });
        } else {
          admin = existing;
          existing.lastLogin = new Date();
          await existing.save();
        }
        return res.json({ success: true, message: 'Login successful' });
      }
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
  
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// GET /api/admin/bookings — All bookings
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const { status, roomType, page = 1, limit = 10, period = 'all', month, year } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (roomType) filter.roomType = roomType;

    if (period === 'month') {
      let start, end;
      if (month && year) {
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0, 23, 59, 59, 999);
      } else {
        const now = new Date();
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
      filter.checkIn = { $gte: start, $lte: end };
    }

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ checkIn: 1 })
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

    const oldBooking = await Booking.findById(req.params.id);
    if (!oldBooking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const updateFields = {};
    if (status) updateFields.status = status;
    if (roomNumber !== undefined) updateFields.roomNumber = roomNumber;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    // Automation: Sync room status
    if (oldBooking.roomNumber && oldBooking.roomNumber !== booking.roomNumber) {
      await Room.findOneAndUpdate({ roomNumber: oldBooking.roomNumber }, { status: 'Available' });
    }

    if (booking.status === 'Confirmed' && booking.roomNumber) {
      await Room.findOneAndUpdate({ roomNumber: booking.roomNumber }, { status: 'Occupied' });
    }

    if ((booking.status === 'Checked-out' || booking.status === 'Cancelled') && booking.roomNumber) {
      await Room.findOneAndUpdate({ roomNumber: booking.roomNumber }, { status: 'Available' });
    }

    let waLink = null;
    if (status === 'Confirmed') {
      waLink = buildWaConfirmLink(booking);
      sendBookingConfirmedEmail(booking).catch(err => console.error(err));
    } else if (status === 'Cancelled') {
      waLink = buildWaCancelLink(booking, cancellationReason);
      sendBookingCancelledEmail(booking, cancellationReason).catch(err => console.error(err));
    }

    res.json({ success: true, booking, waLink });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/bookings/:id
router.delete('/bookings/:id', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking && booking.roomNumber) {
      await Room.findOneAndUpdate({ roomNumber: booking.roomNumber }, { status: 'Available' });
    }
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/bookings/offline
router.post('/bookings/offline', adminAuth, async (req, res) => {
  try {
    const { name, phone, email, roomType, checkIn, checkOut, guests, rooms, message, advancePaid, paymentMethod } = req.body;

    if (!name || !phone || !roomType || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const roomCount = Math.max(1, Number(rooms) || 1);

    let bookingId;
    let isUnique = false;
    while (!isUnique) {
      bookingId = Math.floor(100000 + Math.random() * 900000).toString();
      const existing = await Booking.findOne({ bookingId });
      if (!existing) isUnique = true;
    }

    const settings = await Setting.findOne({ key: 'isSeason' });
    const isSeason = settings ? settings.value === true : false;
    const ROOM_DATA = {
      'non-ac': { season: 2000, nonSeason: 1500 },
      'ac': { season: 2500, nonSeason: 2000 },
      'suite': { season: 12000, nonSeason: 10000 },
    };
    const roomPriceInfo = ROOM_DATA[roomType] || { season: 1500, nonSeason: 1500 };
    const unitPrice = isSeason ? roomPriceInfo.season : roomPriceInfo.nonSeason;
    const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    const roomCharges = unitPrice * nights * roomCount;
    const gstAmount = Math.round(roomCharges * 0.12);
    const totalPrice = roomCharges + gstAmount;

    const booking = new Booking({
      bookingId,
      name,
      phone,
      email: email || '',
      roomType,
      checkIn,
      checkOut,
      guests,
      rooms: roomCount,
      message: message || '',
      status: 'Confirmed',
      roomCharges,
      gstAmount,
      totalPrice,
      advancePaid: Number(advancePaid) || 0,
      paymentStatus: (Number(advancePaid) > 0) ? 'Completed' : 'Pending',
    });

    await booking.save();

    if (Number(advancePaid) > 0) {
      const payment = new Payment({
        guestName: name,
        bookingId: booking._id,
        amount: Number(advancePaid),
        method: paymentMethod || 'Cash',
        status: 'Paid',
        date: new Date(),
      });
      await payment.save();
    }

    try {
      await new Notification({
        title: '📞 Offline Booking Added',
        message: `${name} booked ${roomType} directly. Advance: ₹${advancePaid || 0}`,
        type: 'booking'
      }).save();
    } catch (e) {}

    res.json({ success: true, message: 'Offline booking created successfully!', booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const { period = 'all', month, year } = req.query;
    let bookingFilter = {};
    let paymentFilter = { status: 'Paid' };

    if (period === 'month') {
      let start, end;
      if (month && year) {
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0, 23, 59, 59, 999);
      } else {
        const now = new Date();
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
      bookingFilter.createdAt = { $gte: start, $lte: end };
      paymentFilter.date = { $gte: start, $lte: end };
    }

    const totalBookings = await Booking.countDocuments(bookingFilter);
    const pending = await Booking.countDocuments({ ...bookingFilter, status: 'Pending' });
    const confirmed = await Booking.countDocuments({ ...bookingFilter, status: 'Confirmed' });
    const cancelled = await Booking.countDocuments({ ...bookingFilter, status: 'Cancelled' });

    const payments = await Payment.find(paymentFilter);
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Sync room statuses
    try {
      const activeBookings = await Booking.find({ 
        status: 'Confirmed', 
        roomNumber: { $ne: null, $ne: '' } 
      });
      const occupiedRoomNumbers = activeBookings.map(b => b.roomNumber).filter(Boolean);
      await Room.updateMany({ status: { $ne: 'Maintenance' } }, { status: 'Available' });
      if (occupiedRoomNumbers.length > 0) {
        await Room.updateMany(
          { roomNumber: { $in: occupiedRoomNumbers }, status: { $ne: 'Maintenance' } }, 
          { status: 'Occupied' }
        );
      }
    } catch (e) {}

    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const availableRooms = await Room.countDocuments({ status: 'Available' });

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

    const byRoom = await Booking.aggregate([
      { $match: bookingFilter },
      { $group: { _id: '$roomType', count: { $sum: 1 } } }
    ]);

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
        revenueHistory,
        period
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
    let guests = await Guest.find().sort({ createdAt: -1 });
    
    if (guests.length === 0) {
      const bookings = await Booking.find({});
      if (bookings.length > 0) {
        const phoneToGuest = new Map();
        for (const b of bookings) {
          if (!b.phone) continue;
          if (phoneToGuest.has(b.phone)) {
            const g = phoneToGuest.get(b.phone);
            g.totalStays += 1;
            if (g.totalStays >= 10) g.loyaltyLevel = 'VIP';
            else if (g.totalStays >= 3) g.loyaltyLevel = 'Regular';
          } else {
            phoneToGuest.set(b.phone, {
              name: b.name || 'Unknown Guest',
              phone: b.phone,
              email: b.email || '',
              totalStays: 1,
              loyaltyLevel: 'New'
            });
          }
        }
        const guestsToInsert = Array.from(phoneToGuest.values());
        if (guestsToInsert.length > 0) {
          await Guest.insertMany(guestsToInsert, { ordered: false }).catch(() => {});
          guests = await Guest.find().sort({ createdAt: -1 });
        }
      }
    }
    res.json({ success: true, guests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/guests/:id', adminAuth, async (req, res) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Guest deleted' });
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

router.post('/payments', adminAuth, async (req, res) => {
  try {
    const { guestName, bookingId, amount, method, status } = req.body;
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
    const { period = 'all', month, year } = req.query;
    const filter = {};

    if (period === 'month') {
      let start, end;
      if (month && year) {
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0, 23, 59, 59, 999);
      } else {
        const now = new Date();
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
      filter.date = { $gte: start, $lte: end };
    }

    const reviews = await Review.find(filter).sort({ date: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/reviews/:id', adminAuth, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SETTINGS ROUTES ---
router.get('/settings', adminAuth, async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsObj = {};
    settings.forEach(s => { settingsObj[s.key] = s.value; });
    if (settingsObj.isSeason === undefined) settingsObj.isSeason = false;
    res.json({ success: true, settings: settingsObj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/settings', adminAuth, async (req, res) => {
  try {
    const { isSeason } = req.body;
    if (isSeason !== undefined) {
      await Setting.findOneAndUpdate(
        { key: 'isSeason' },
        { value: isSeason },
        { upsert: true, new: true }
      );
      
      const rooms = await Room.find();
      for (const room of rooms) {
        if (room.seasonPrice && room.nonSeasonPrice) {
          room.price = isSeason ? room.seasonPrice : room.nonSeasonPrice;
          await room.save();
        }
      }
    }
    res.json({ success: true, message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset layout for 11 rooms
router.post('/rooms/reset-layout', adminAuth, async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'isSeason' });
    const isSeason = setting ? setting.value === true : false;

    await Room.deleteMany({});
    const roomsToCreate = [];

    const roomDetails = {
      'non-ac': { price: 1500, nonSeasonPrice: 1500, seasonPrice: 2000 },
      'ac': { price: 2000, nonSeasonPrice: 2000, seasonPrice: 2500 },
      'suite': { price: 10000, nonSeasonPrice: 10000, seasonPrice: 12000 },
    };

    // 101-105: non-ac
    for (let i = 101; i <= 105; i++) {
      const type = 'non-ac';
      const det = roomDetails[type];
      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        nonSeasonPrice: det.nonSeasonPrice,
        seasonPrice: det.seasonPrice,
        price: isSeason ? det.seasonPrice : det.nonSeasonPrice,
        status: 'Available'
      });
    }

    // 106-110: ac
    for (let i = 106; i <= 110; i++) {
      const type = 'ac';
      const det = roomDetails[type];
      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        nonSeasonPrice: det.nonSeasonPrice,
        seasonPrice: det.seasonPrice,
        price: isSeason ? det.seasonPrice : det.nonSeasonPrice,
        status: 'Available'
      });
    }

    // 201: suite
    roomsToCreate.push({
      roomNumber: '201',
      type: 'suite',
      nonSeasonPrice: roomDetails['suite'].nonSeasonPrice,
      seasonPrice: roomDetails['suite'].seasonPrice,
      price: isSeason ? roomDetails['suite'].seasonPrice : roomDetails['suite'].nonSeasonPrice,
      status: 'Available'
    });

    await Room.insertMany(roomsToCreate);
    res.json({ success: true, message: 'SM Golden Resorts room layout reset successfully with 11 rooms!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/notifications
router.get('/notifications', adminAuth, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/notifications/:id or all
router.delete('/notifications/:id', adminAuth, async (req, res) => {
  try {
    if (req.params.id === 'all') {
      await Notification.deleteMany({});
      return res.json({ success: true, message: 'All notifications cleared' });
    }
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/fcm-token
router.post('/fcm-token', adminAuth, async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Token is required' });

    const username = req.headers.username || process.env.ADMIN_USERNAME || 'santhosh';
    let admin = await Admin.findOne({ username });
    
    if (admin) {
      if (!admin.fcmTokens) admin.fcmTokens = [];
      if (!admin.fcmTokens.includes(token)) {
        admin.fcmTokens.push(token);
        await admin.save();
      }
      return res.json({ success: true, message: 'Token registered successfully' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
  return res.status(404).json({ success: false, message: 'Admin not found' });
});

module.exports = router;
