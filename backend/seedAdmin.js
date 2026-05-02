const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await Admin.findOne({ username: 'santhosh' });
    if (!existing) {
      const admin = new Admin({
        username: 'santhosh',
        password: 'santhosh@123'
      });
      await admin.save();
      console.log('Default admin created: santhosh / santhosh@123');
    } else {
      console.log('Admin already exists');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedAdmin();
