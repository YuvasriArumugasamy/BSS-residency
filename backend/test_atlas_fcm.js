const mongoose = require('mongoose');

async function checkFCM() {
  const uri = 'mongodb+srv://yuvasrikutty2005_db_user:yuva123@cluster0.ln78btj.mongodb.net/?appName=Cluster0';
  console.log('Connecting to Atlas...');
  try {
    await mongoose.connect(uri);
    console.log('Connected!');
    
    const db = mongoose.connection.db;
    const admins = await db.collection('admins').find({}).toArray();
    console.log('Admins count:', admins.length);
    admins.forEach(admin => {
      console.log(`Admin ${admin.username} has ${admin.fcmTokens?.length || 0} FCM tokens.`);
      if(admin.fcmTokens?.length > 0) console.log(admin.fcmTokens);
    });
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkFCM();
