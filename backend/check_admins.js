const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  const admins = await Admin.find({});
  console.log('Admins in DB:', admins);
  process.exit(0);
}
run().catch(console.error);
