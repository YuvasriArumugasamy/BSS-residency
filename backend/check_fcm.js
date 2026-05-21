const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

async function checkTokens() {
  await mongoose.connect(process.env.MONGO_URI);
  const admins = await Admin.find({});
  console.log('Admins count:', admins.length);
  admins.forEach(admin => {
    console.log(`Admin ${admin.username} has ${admin.fcmTokens?.length || 0} FCM tokens.`);
  });
  mongoose.disconnect();
}

checkTokens();
