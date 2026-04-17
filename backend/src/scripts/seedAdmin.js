import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'dns';
import User from '../models/User.js';

dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);

let user = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
if (!user) {
  user = new User({
    name: ADMIN_NAME || 'Store Admin',
    email: ADMIN_EMAIL.toLowerCase(),
    role: 'admin',
  });
  await user.setPassword(ADMIN_PASSWORD);
  await user.save();
  console.log(`Admin created: ${user.email}`);
} else {
  user.role = 'admin';
  if (ADMIN_NAME) user.name = ADMIN_NAME;
  await user.setPassword(ADMIN_PASSWORD);
  await user.save();
  console.log(`Admin updated: ${user.email}`);
}

await mongoose.disconnect();
process.exit(0);
