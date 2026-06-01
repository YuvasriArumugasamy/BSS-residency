const mongoose = require('mongoose');

async function checkDB() {
  const uri = 'mongodb+srv://yuvasrikutty2005_db_user:yuva123@cluster0.ln78btj.mongodb.net/?appName=Cluster0';
  console.log('Connecting to Atlas...');
  try {
    await mongoose.connect(uri);
    console.log('Connected!');
    
    // The collection name is likely 'bookings' or similar
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const bookings = await db.collection('bookings').countDocuments();
    console.log('Bookings count in Atlas:', bookings);
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkDB();
