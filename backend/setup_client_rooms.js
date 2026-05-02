const mongoose = require('mongoose');
require('dotenv').config();
const Room = require('./models/Room');

async function setupClientRooms() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Delete ALL existing rooms to start fresh for the client
    await Room.deleteMany({});
    console.log('Cleared existing rooms.');

    const roomsToCreate = [];

    // --- First Floor (101-106) ---
    for (let i = 101; i <= 106; i++) {
      const type = (i === 102) ? 'Four Bed A/C' : 'Double Bed A/C';
      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        price: (type === 'Four Bed A/C' ? 2300 : 1300),
        status: 'Available'
      });
    }

    // --- Second Floor (201-207) ---
    for (let i = 201; i <= 207; i++) {
      const type = ([201, 202, 207].includes(i)) ? 'Four Bed A/C' : 'Double Bed A/C';
      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        price: (type === 'Four Bed A/C' ? 2300 : 1300),
        status: 'Available'
      });
    }

    // --- Third Floor (301-307) ---
    for (let i = 301; i <= 307; i++) {
      const type = ([302, 307].includes(i)) ? 'Four Bed A/C' : 'Double Bed A/C';
      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        price: (type === 'Four Bed A/C' ? 2300 : 1300),
        status: 'Available'
      });
    }

    await Room.insertMany(roomsToCreate);
    console.log('Successfully configured 20 rooms as per client requirements!');
    process.exit(0);
  } catch (err) {
    console.error('Setup error:', err);
    process.exit(1);
  }
}

setupClientRooms();
