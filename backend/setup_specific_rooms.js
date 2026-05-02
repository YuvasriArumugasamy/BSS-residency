const mongoose = require('mongoose');
require('dotenv').config();
const Room = require('./models/Room');

async function setupRooms() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Delete ALL existing rooms to start fresh
    await Room.deleteMany({});
    console.log('Deleted all existing rooms.');

    const roomsToCreate = [];

    // --- First Floor (6 rooms: 101-106) ---
    // 102: Four Bed, others: Double Bed
    for (let i = 101; i <= 106; i++) {
      const type = (i === 102) ? 'Four Bed A/C' : 'Double Bed A/C';
      const price = (type === 'Four Bed A/C') ? 2500 : 1500;
      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        price,
        status: 'Available'
      });
    }

    // --- Second Floor (7 rooms: 201-207) ---
    // 201, 202, 207: Four Bed, others: Double Bed
    for (let i = 201; i <= 207; i++) {
      const type = ([201, 202, 207].includes(i)) ? 'Four Bed A/C' : 'Double Bed A/C';
      const price = (type === 'Four Bed A/C') ? 2500 : 1500;
      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        price,
        status: 'Available'
      });
    }

    // --- Third Floor (7 rooms: 301-307) ---
    // 302, 307: Four Bed, others: Double Bed
    for (let i = 301; i <= 307; i++) {
      const type = ([302, 307].includes(i)) ? 'Four Bed A/C' : 'Double Bed A/C';
      const price = (type === 'Four Bed A/C') ? 2500 : 1500;
      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        price,
        status: 'Available'
      });
    }

    await Room.insertMany(roomsToCreate);
    console.log(`Successfully created ${roomsToCreate.length} rooms exactly as specified!`);
    
    process.exit(0);
  } catch (err) {
    console.error('Setup error:', err);
    process.exit(1);
  }
}

setupRooms();
