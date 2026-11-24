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
      // First Floor
      { roomNumber: '101', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },
      { roomNumber: '102', type: 'Four Bed A/C', price: 4500, nonSeasonPrice: 4500, seasonPrice: 4500, status: 'Available' },
      { roomNumber: '103', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },
      { roomNumber: '104', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },
      { roomNumber: '105', type: 'Double Bed A/C', price: 2500, nonSeasonPrice: 2500, seasonPrice: 2500, status: 'Available' },
      { roomNumber: '106', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },

      // Second Floor
      { roomNumber: '201', type: 'Four Bed A/C', price: 4500, nonSeasonPrice: 4500, seasonPrice: 4500, status: 'Available' },
      { roomNumber: '202', type: 'Four Bed A/C', price: 4500, nonSeasonPrice: 4500, seasonPrice: 4500, status: 'Available' },
      { roomNumber: '203', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },
      { roomNumber: '204', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },
      { roomNumber: '205', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },
      { roomNumber: '206', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },
      { roomNumber: '207', type: 'Four Bed A/C', price: 4500, nonSeasonPrice: 4500, seasonPrice: 4500, status: 'Available' },

      // Third Floor
      { roomNumber: '301', type: 'Three Bed', price: 2500, nonSeasonPrice: 2500, seasonPrice: 2500, status: 'Available' },
      { roomNumber: '302', type: 'Four Bed A/C', price: 4500, nonSeasonPrice: 4500, seasonPrice: 4500, status: 'Available' },
      { roomNumber: '303', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },
      { roomNumber: '304', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },
      { roomNumber: '305', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },
      { roomNumber: '306', type: 'Double Bed', price: 2000, nonSeasonPrice: 2000, seasonPrice: 2000, status: 'Available' },
      { roomNumber: '307', type: 'Four Bed A/C', price: 4500, nonSeasonPrice: 4500, seasonPrice: 4500, status: 'Available' },
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
