const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config();

const updateRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bss_residency');
    console.log('Connected to MongoDB...');

    // Clear existing rooms
    await Room.deleteMany({});
    console.log('Cleared existing rooms.');

    const rooms = [];
    let roomNum = 1;

    // 13 Double Bed (using 'AC Double Bed')
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
    console.log(`Successfully added ${rooms.length} rooms.`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error updating rooms:', err);
    process.exit(1);
  }
};

updateRooms();
