const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Room = require('./models/Room');
const Guest = require('./models/Guest');
require('dotenv').config();

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

    // Create Rooms (Fixed distribution: 13 Double, 1 Three, 6 Four)
    const rooms = [];
    let roomNum = 1;
    
    // 13 Double Bed (using AC Double Bed)
    for (let i = 0; i < 13; i++) {
        rooms.push({
            roomNumber: (roomNum++).toString(),
            type: 'AC Double Bed',
            price: 1500,
            status: 'Available',
            amenities: ['TV', 'Hot Water', 'WiFi']
        });
    }

    // 1 Three Bed
    rooms.push({
        roomNumber: (roomNum++).toString(),
        type: 'Three Bed',
        price: 2000,
        status: 'Available',
        amenities: ['TV', 'Hot Water', 'WiFi']
    });

    // 6 Four Bed
    for (let i = 0; i < 6; i++) {
        rooms.push({
            roomNumber: (roomNum++).toString(),
            type: 'Four Bed',
            price: 2500,
            status: 'Available',
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
