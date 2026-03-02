import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MongoDB bağlantı hatası: MONGODB_URI ortam değişkeni tanımlı değil (Render: Environment Variables\'a ekleyin).');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log(`MongoDB bağlı: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB bağlantı hatası:', err.message);
    if (err.message && err.message.includes('timed out')) {
      console.error('İpucu: MongoDB Atlas → Network Access → "Allow Access from Anywhere" (0.0.0.0/0) ekleyin. Render IP\'leri sabit değildir.');
    }
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => console.log('MongoDB bağlantısı kesildi'));

export default connectDB;
