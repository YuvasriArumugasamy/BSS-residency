const mongoose = require('mongoose');
const Room = require('./models/Room');

mongoose.connect('mongodb://localhost:27017/bss_residency')
  .then(async () => {
    const counts = await Room.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    console.log('---ROOM COUNTS---');
    counts.forEach(c => console.log(`${c._id}: ${c.count}`));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
