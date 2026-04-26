const mongoose = require('mongoose');
const Booking = require('../backend/models/Booking');
const Room = require('../backend/models/Room');
const Guest = require('../backend/models/Guest');
require('dotenv').config({ path: '../backend/.env' });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bss_residency');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await Promise.all([
      Booking.deleteMany({}),
      Room.deleteMany({}),
      Guest.deleteMany({})
    ]);

    // Create Rooms
    const roomTypes = ['AC Double Bed', 'Non-AC Double Bed', 'Four Bed', 'Four Bed A/C', 'Deluxe AC'];
    const rooms = [];
    for (let i = 101; i <= 120; i++) {
        rooms.push({
            roomNumber: i.toString(),
            type: roomTypes[Math.floor(Math.random() * roomTypes.length)],
            price: i > 110 ? 2500 : 1500,
            status: Math.random() > 0.8 ? 'Maintenance' : (Math.random() > 0.5 ? 'Occupied' : 'Available'),
            amenities: ['TV', 'Hot Water', 'WiFi']
        });
    }
    await Room.insertMany(rooms);
    console.log('Seed: Rooms created.');

    // Create Guests
    const guestData = [
        { name: 'Suresh Kumar', phone: '9876543210', email: 'suresh@example.com', loyaltyLevel: 'Regular', totalStays: 5 },
        { name: 'Anand Raj', phone: '9876543211', email: 'anand@example.com', loyaltyLevel: 'New', totalStays: 1 },
        { name: 'Divya Patel', phone: '9876543212', email: 'divya@example.com', loyaltyLevel: 'VIP', totalStays: 12 },
        { name: 'Nisha Verma', phone: '9876543213', email: 'nisha@example.com', loyaltyLevel: 'Regular', totalStays: 3 },
        { name: 'Karan Yadav', phone: '9876543214', email: 'karan@example.com', loyaltyLevel: 'New', totalStays: 1 }
    ];
    await Guest.insertMany(guestData);
    console.log('Seed: Guests created.');

    // Create Bookings
    const today = new Date();
    const bookings = [
        {
            name: 'Suresh Kumar', phone: '9876543210', roomType: 'AC Double Bed',
            checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
            guests: 2, status: 'Confirmed', createdAt: new Date(Date.now() - 86400000)
        },
        {
            name: 'Anand Raj', phone: '9876543211', roomType: 'Non-AC Double Bed',
            checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
            checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
            guests: 1, status: 'Pending'
        },
        {
            name: 'Divya Patel', phone: '9876543212', roomType: 'Four Bed A/C',
            checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
            checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
            guests: 4, status: 'Cancelled'
        }
    ];
    await Booking.insertMany(bookings);
    console.log('Seed: Bookings created.');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
