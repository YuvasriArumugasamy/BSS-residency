const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.log(err));

const seedRooms = async () => {
  try {
    // Delete existing rooms
    await Room.deleteMany({});
    console.log('Existing rooms cleared.');

    const newRooms = [
      // First Floor (6 Rooms)
      { roomNumber: '101', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '102', type: 'Four Bed A/C', price: 2500, status: 'Available' },
      { roomNumber: '103', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '104', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '105', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '106', type: 'AC Double Bed', price: 1500, status: 'Available' },

      // Second Floor (7 Rooms)
      { roomNumber: '201', type: 'Four Bed A/C', price: 2500, status: 'Available' },
      { roomNumber: '202', type: 'Four Bed A/C', price: 2500, status: 'Available' },
      { roomNumber: '203', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '204', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '205', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '206', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '207', type: 'Four Bed A/C', price: 2500, status: 'Available' },

      // Third Floor (7 Rooms)
      { roomNumber: '301', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '302', type: 'Four Bed A/C', price: 2500, status: 'Available' },
      { roomNumber: '303', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '304', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '305', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '306', type: 'AC Double Bed', price: 1500, status: 'Available' },
      { roomNumber: '307', type: 'Four Bed A/C', price: 2500, status: 'Available' },
    ];

    await Room.insertMany(newRooms);
    console.log('20 Rooms seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding rooms:', error);
    process.exit(1);
  }
};

seedRooms();
