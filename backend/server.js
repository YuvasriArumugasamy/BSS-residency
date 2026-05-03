const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const galleryRoutes = require('./routes/gallery');

// Models (Pre-load for consistency)
require('./models/Room');
require('./models/Guest');
require('./models/Booking');
require('./models/Payment');

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://bss-residency.vercel.app',
  'https://bssresidency.com',
  'https://www.bssresidency.com',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // In development, allow localhost and common variations
    const isLocal = !origin || 
                   origin.includes('localhost') || 
                   origin.includes('127.0.0.1') || 
                   process.env.NODE_ENV === 'development';

    if (isLocal || allowedOrigins.indexOf(origin) !== -1 || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      console.error('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);

// Static folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) =>
  res.json({ message: 'BSS Residency API running', status: 'ok' })
);

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set. Please configure the environment.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');

    // Auto-seed admin if not exists
    const Admin = require('./models/Admin');
    const existing = await Admin.findOne({});
    if (!existing) {
      const username = process.env.ADMIN_USERNAME || 'santhosh';
      const password = process.env.ADMIN_PASSWORD || 'santhosh@123';
      await Admin.create({ username, password });
      console.log('Admin auto-seeded:', username);
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB Error:', err);
    process.exit(1);
  });

// SECRET one-time endpoint to setup rooms in production
// Call this ONCE: https://bss-residency-2.onrender.com/api/setup-rooms-bss2025
app.get('/api/setup-rooms-bss2025', async (req, res) => {
  try {
    const Room = require('./models/Room');
    await Room.deleteMany({});

    const roomsToCreate = [];

    const pricing = {
      'Double Bed':     { non: 1000, sea: 1300 },
      'Double Bed A/C': { non: 1300, sea: 1600 },
      'Four Bed':       { non: 2000, sea: 2500 },
      'Four Bed A/C':   { non: 2300, sea: 2800 },
    };

    // First Floor (101-106)
    const floor1 = [
      { num: 101, type: 'Double Bed' },
      { num: 102, type: 'Four Bed' },
      { num: 103, type: 'Double Bed' },
      { num: 104, type: 'Double Bed' },
      { num: 105, type: 'Double Bed A/C' },
      { num: 106, type: 'Double Bed A/C' },
    ];

    // Second Floor (201-207)
    const floor2 = [
      { num: 201, type: 'Four Bed' },
      { num: 202, type: 'Four Bed' },
      { num: 203, type: 'Double Bed' },
      { num: 204, type: 'Double Bed' },
      { num: 205, type: 'Double Bed A/C' },
      { num: 206, type: 'Double Bed A/C' },
      { num: 207, type: 'Four Bed A/C' },
    ];

    // Third Floor (301-307)
    const floor3 = [
      { num: 301, type: 'Double Bed' },
      { num: 302, type: 'Four Bed' },
      { num: 303, type: 'Double Bed' },
      { num: 304, type: 'Double Bed' },
      { num: 305, type: 'Double Bed A/C' },
      { num: 306, type: 'Double Bed A/C' },
      { num: 307, type: 'Four Bed' },
    ];

    [...floor1, ...floor2, ...floor3].forEach(({ num, type }) => {
      const p = pricing[type];
      roomsToCreate.push({
        roomNumber: num.toString(),
        type,
        price: p.non,
        nonSeasonPrice: p.non,
        seasonPrice: p.sea,
        status: 'Available',
      });
    });

    await Room.insertMany(roomsToCreate);
    res.json({ success: true, message: `${roomsToCreate.length} rooms setup successfully!`, rooms: roomsToCreate.map(r => ({ roomNumber: r.roomNumber, type: r.type })) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
