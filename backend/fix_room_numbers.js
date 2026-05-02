const mongoose = require('mongoose');
require('dotenv').config();
const Room = require('./models/Room');

async function fixRooms() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Delete rooms with short numbers (1, 2, 3...) that were accidentally seeded
    const deleted = await Room.deleteMany({ roomNumber: { $regex: /^[0-9]$|^[0-9][0-9]$/ } });
    console.log(`Deleted ${deleted.deletedCount} misnumbered rooms.`);

    // 2. Ensure we have rooms for each type starting from 101, 201, 301, 401
    const requiredTypes = [
      { type: 'Double Bed', price: 1000, base: 101 },
      { type: 'Double Bed A/C', price: 1300, base: 201 },
      { type: 'Four Bed', price: 2000, base: 301 },
      { type: 'Four Bed A/C', price: 2300, base: 401 }
    ];

    for (const spec of requiredTypes) {
      const existing = await Room.find({ type: spec.type });
      if (existing.length < 5) {
        console.log(`Seeding rooms for ${spec.type}...`);
        const toAdd = 5 - existing.length;
        let roomsToSave = [];
        let currentNum = spec.base;
        
        // Find highest existing number for this type to continue
        const highest = await Room.findOne({ type: spec.type }).sort({ roomNumber: -1 });
        if (highest) {
          currentNum = Math.max(spec.base, parseInt(highest.roomNumber) + 1);
        }

        for (let i = 0; i < toAdd; i++) {
          roomsToSave.push({
            roomNumber: (currentNum++).toString(),
            type: spec.type,
            price: spec.price,
            status: 'Available'
          });
        }
        await Room.insertMany(roomsToSave);
      }
    }

    console.log('Room numbering fixed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Fix error:', err);
    process.exit(1);
  }
}

fixRooms();
