import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB bağlı: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => console.log('MongoDB bağlantısı kesildi'));

export default connectDB;
