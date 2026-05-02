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
  .then(() => {
    console.log('MongoDB Connected');
    
    // Auto-seed admin if database is empty
    const Admin = require('./models/Admin');
    Admin.findOne({ username: 'santhosh' }).then(existing => {
      if (!existing) {
        new Admin({
          username: process.env.ADMIN_USERNAME || 'santhosh',
          password: process.env.ADMIN_PASSWORD || 'santhosh@123'
        }).save().then(() => console.log('Default admin seeded')).catch(e => console.error('Seed error:', e));
      }
    });

    // Auto-seed default rooms if missing types
    (async () => {
      try {
        const Room = require('./models/Room');
        
        // --- MIGRATION: Fix room numbers (renumber 1-99 to 101+) ---
        const shortRooms = await Room.find({ roomNumber: { $regex: /^[0-9]$|^[0-9][0-9]$/ } });
        if (shortRooms.length > 0) {
          console.log(`Fixing ${shortRooms.length} misnumbered rooms...`);
          for (const room of shortRooms) {
            const lastRoom = await Room.findOne({ roomNumber: { $not: /^[0-9]$|^[0-9][0-9]$/ } }).sort({ roomNumber: -1 });
            let nextNum = lastRoom ? parseInt(lastRoom.roomNumber) + 1 : 101;
            room.roomNumber = nextNum.toString();
            await room.save();
          }
        }

        const requiredTypes = [
          { type: 'Double Bed', price: 1000 },
          { type: 'Double Bed A/C', price: 1300 },
          { type: 'Four Bed', price: 2000 },
          { type: 'Four Bed A/C', price: 2300 }
        ];

        for (const roomSpec of requiredTypes) {
          const count = await Room.countDocuments({ type: roomSpec.type });
          if (count === 0) {
            console.log(`Seeding 5 rooms for missing type: ${roomSpec.type}`);
            let roomsToSave = [];
            const lastRoom = await Room.findOne().sort({ roomNumber: -1 });
            let startNum = lastRoom ? parseInt(lastRoom.roomNumber) + 1 : 101;
            if (startNum < 101) startNum = 101; // Force 101+ base
            
            for(let i=0; i<5; i++) {
              roomsToSave.push({
                roomNumber: (startNum++).toString(),
                type: roomSpec.type,
                price: roomSpec.price,
                status: 'Available'
              });
            }
            await Room.insertMany(roomsToSave);
          }
        }
      } catch (e) {
        console.error('Seeding error:', e);
      }
    })();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB Error:', err);
    process.exit(1);
  });
