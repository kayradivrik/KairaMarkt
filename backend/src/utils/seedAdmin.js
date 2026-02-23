import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kairamarkt';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@kairamarkt.com';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin zaten var:', email);
    await mongoose.disconnect();
    return;
  }
  await User.create({
    name: 'Admin',
    email,
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin',
  });
  console.log('Admin oluşturuldu:', email);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
