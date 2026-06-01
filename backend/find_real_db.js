const mongoose = require('mongoose');

async function checkDatabase(dbName) {
  const uri = `mongodb+srv://yuvasrikutty2005_db_user:yuva123@cluster0.ln78btj.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  console.log(`\nConnecting to Atlas DB: ${dbName}...`);
  try {
    const conn = await mongoose.createConnection(uri).asPromise();
    console.log(`Connected to ${dbName}`);
    
    const Booking = conn.model('Booking', new mongoose.Schema({}, { strict: false }));
    const count = await Booking.countDocuments({});
    console.log(`Bookings count in ${dbName}:`, count);
    
    if (count > 0) {
      const latest = await Booking.findOne({}).sort({ createdAt: -1 });
      console.log(`Latest booking in ${dbName} created at:`, latest.get('createdAt'));
    }
    
    await conn.close();
  } catch (err) {
    console.error(`Error with database ${dbName}:`, err.message);
  }
}

async function run() {
  await checkDatabase('test');
  await checkDatabase('bss_residency');
  process.exit(0);
}
run();
