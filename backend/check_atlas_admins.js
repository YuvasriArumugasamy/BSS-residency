const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function run() {
  const uri = 'mongodb+srv://yuvasrikutty2005_db_user:yuva123@cluster0.ln78btj.mongodb.net/bss_residency?retryWrites=true&w=majority';
  console.log('Connecting to Atlas...');
  await mongoose.connect(uri);
  console.log('Connected to Atlas!');
  
  const admins = await Admin.find({});
  console.log('Admins in Atlas:', admins);
  
  // If there's an admin, let's reset its password to 'santhosh@123'
  const existing = await Admin.findOne({ username: 'santhosh' });
  if (existing) {
    existing.password = 'santhosh@123';
    await existing.save();
    console.log('Atlas admin password forcefully reset to: santhosh@123');
  } else {
    const admin = new Admin({
      username: 'santhosh',
      password: 'santhosh@123'
    });
    await admin.save();
    console.log('Atlas admin created: santhosh / santhosh@123');
  }

  process.exit(0);
}
run().catch(console.error);
