import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';
import Product from './models/Product.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import sliderRoutes from './routes/sliderRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import stockAlertRoutes from './routes/stockAlertRoutes.js';

await connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(helmet());
// FRONTEND_URL virgülle ayrılmış birden fazla adres olabilir (örn. https://site.com,https://www.site.com)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL || '').split(',').map((u) => u.trim()).filter(Boolean),
].filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // Origin yoksa (örn. same-origin, Postman) kabul et
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    // Trailing slash farkı: https://site.com ve https://site.com/ aynı sayılır
    const originNorm = origin.replace(/\/$/, '');
    if (allowedOrigins.some((o) => o.replace(/\/$/, '') === originNorm)) return cb(null, true);
    cb(new Error('CORS policy: origin not allowed'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

// Genel API: geliştirmede yüksek limit (StrictMode + çok endpoint), production'da makul limit.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 500 : 2000,
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
app.use('/api/faq', faqRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stock-alert', stockAlertRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const base = process.env.FRONTEND_URL || 'http://localhost:5173';
    const products = await Product.find({ isActive: true }).select('slug updatedAt').limit(5000).lean();
    const urls = [
      { loc: base + '/', priority: '1.0' },
      { loc: base + '/urunler', priority: '0.9' },
      { loc: base + '/kampanyalar', priority: '0.8' },
      { loc: base + '/iletisim', priority: '0.7' },
      ...products.map((p) => ({ loc: `${base}/urun/${p.slug || p._id}`, priority: '0.8', lastmod: p.updatedAt })),
    ];
    const xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      urls.map((u) => `<url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString().slice(0, 10)}</lastmod>` : ''}<priority>${u.priority || '0.5'}</priority></url>`).join('') +
      '</urlset>';
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

// SPA fallback: frontend build varsa statik dosyaları sun, tüm GET isteklerinde (API hariç) index.html dön → F5 /sepet vb. çalışır
const clientBuild = path.resolve(process.env.CLIENT_BUILD_PATH || path.join(__dirname, '..', '..', 'frontend', 'dist'));
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientBuild, 'index.html'), (err) => {
      if (err) next();
    });
  });
}

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server http://localhost:${PORT} portunda çalışıyor`));
