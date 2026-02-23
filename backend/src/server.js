import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import sliderRoutes from './routes/sliderRoutes.js';

await connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(helmet());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS policy: origin not allowed'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

// Genel API: dakikada ~30 istek civarı (15 dk'da 300). Health sayılmaz.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Çok fazla istek. Lütfen bir dakika bekleyin.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
});
app.use('/api', apiLimiter);

// Login/Register: brute-force önleme (15 dk'da 20 deneme)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin.' },
  standardHeaders: true,
  skip: (req) => req.method !== 'POST' || (req.path !== '/login' && req.path !== '/register'),
});
app.use('/api/auth', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/sliders', sliderRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server http://localhost:${PORT} portunda çalışıyor`));
