import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Campaign from '../models/Campaign.js';
import AdminLog from '../models/AdminLog.js';
import Slider from '../models/Slider.js';
import Faq from '../models/Faq.js';
import SiteSettings from '../models/SiteSettings.js';

const logAction = (adminId, action, target, details = {}, ip = '') => {
  return AdminLog.create({ admin: adminId, action, target, details, ip });
};

export const getDashboard = async (_req, res, next) => {
  try {
    const [userCount, productCount, orderCount, totalRevenue] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, sum: { $sum: '$total' } } }]),
    ]);
    const revenue = totalRevenue[0]?.sum ?? 0;
    const lastOrders = await Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email').lean();
    res.json({
      success: true,
      stats: { userCount, productCount, orderCount, totalRevenue: revenue },
      lastOrders,
    });
  } catch (err) {
    next(err);
  }
};

export const getSalesChart = async (req, res, next) => {
  try {
    const days = Math.min(90, Math.max(7, parseInt(req.query.days) || 30));
    const start = new Date();
    start.setDate(start.getDate() - days);
    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: start }, status: { $ne: 'cancelled' } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(),
    ]);
    res.json({ success: true, users, total, page, limit });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });
    await logAction(req.user._id, 'UPDATE_USER_ROLE', user.email, { role: user.role }, req.ip);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const [products, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(),
    ]);
    res.json({ success: true, products, total, page, limit });
  } catch (err) {
    next(err);
  }
};

function parseTechnicalSpecs(specs) {
  if (Array.isArray(specs)) return specs.filter((s) => s && (s.name != null || s.value != null));
  if (typeof specs === 'string') {
    try {
      const arr = JSON.parse(specs);
      return Array.isArray(arr) ? arr.filter((s) => s && (s.name != null || s.value != null)) : [];
    } catch { return []; }
  }
  return [];
}

export const createProduct = async (req, res, next) => {
  try {
    const images = req.files?.filter((f) => f.path).map((f) => f.path) || [];
    const body = req.body || {};
    const technicalSpecs = parseTechnicalSpecs(body.technicalSpecs);
    const product = await Product.create({
      name: body.name,
      description: body.description ?? '',
      price: body.price != null ? Number(body.price) : 0,
      discountPrice: body.discountPrice != null && body.discountPrice !== '' ? Number(body.discountPrice) : null,
      stock: body.stock != null && body.stock !== '' ? Number(body.stock) : 0,
      brand: body.brand ?? '',
      category: body.category ?? 'Telefon',
      subCategory: body.subCategory ?? '',
      featured: body.featured === 'true' || body.featured === true,
      isActive: body.isActive !== 'false' && body.isActive !== false,
      images,
      technicalSpecs,
    });
    await logAction(req.user._id, 'CREATE_PRODUCT', product.name, { id: product._id }, req.ip);
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: req.body.images ?? undefined },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    await logAction(req.user._id, 'UPDATE_PRODUCT', product.name, { id: product._id }, req.ip);
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    await logAction(req.user._id, 'DELETE_PRODUCT', product.name, { id: product._id }, req.ip);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { stock: req.body.stock }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const [orders, total] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).populate('user', 'name email').skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments(),
    ]);
    res.json({ success: true, orders, total, page, limit });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Sipariş bulunamadı' });
    await logAction(req.user._id, 'UPDATE_ORDER_STATUS', order._id.toString(), { status: order.status }, req.ip);
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

export const getAdminReviews = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const [reviews, total] = await Promise.all([
      Review.find().populate('user', 'name email').populate('product', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Review.countDocuments(),
    ]);
    res.json({ success: true, reviews, total, page, limit });
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Yorum bulunamadı' });
    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await Product.findByIdAndUpdate(review.product, {
      rating: stats[0]?.avg ?? 0,
      reviewCount: stats[0]?.count ?? 0,
    });
    await logAction(req.user._id, 'DELETE_REVIEW', review._id.toString(), {}, req.ip);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, campaigns });
  } catch (err) {
    next(err);
  }
};

export const createCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.create(req.body);
    await logAction(req.user._id, 'CREATE_CAMPAIGN', campaign.code, { id: campaign._id }, req.ip);
    res.status(201).json({ success: true, campaign });
  } catch (err) {
    next(err);
  }
};

export const updateCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!campaign) return res.status(404).json({ success: false, message: 'Kampanya bulunamadı' });
    res.json({ success: true, campaign });
  } catch (err) {
    next(err);
  }
};

export const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Kampanya bulunamadı' });
    await logAction(req.user._id, 'DELETE_CAMPAIGN', campaign.code, {}, req.ip);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getAdminLogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const [logs, total] = await Promise.all([
      AdminLog.find().populate('admin', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      AdminLog.countDocuments(),
    ]);
    res.json({ success: true, logs, total, page, limit });
  } catch (err) {
    next(err);
  }
};

export const getSliders = async (_req, res, next) => {
  try {
    const slides = await Slider.find().sort({ order: 1 }).lean();
    res.json({ success: true, slides });
  } catch (err) {
    next(err);
  }
};

export const createSlider = async (req, res, next) => {
  try {
    const slide = await Slider.create(req.body);
    await logAction(req.user._id, 'CREATE_SLIDER', slide._id.toString(), {}, req.ip);
    res.status(201).json({ success: true, slide });
  } catch (err) {
    next(err);
  }
};

export const updateSlider = async (req, res, next) => {
  try {
    const slide = await Slider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slide) return res.status(404).json({ success: false, message: 'Slider bulunamadı' });
    res.json({ success: true, slide });
  } catch (err) {
    next(err);
  }
};

export const deleteSlider = async (req, res, next) => {
  try {
    const slide = await Slider.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ success: false, message: 'Slider bulunamadı' });
    await logAction(req.user._id, 'DELETE_SLIDER', slide._id.toString(), {}, req.ip);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

const SETTINGS_DEFAULTS = {
  siteName: 'KairaMarkt',
  logoUrl: '',
  showLogo: false,
  primaryColor: '#b91c1c',
  marqueeText: 'KairaMarkt Admin Paneli · Hoş geldiniz · Sipariş ve ürün yönetimini buradan takip edebilirsiniz',
  footerText: '',
};

export const getSettings = async (_req, res, next) => {
  try {
    const doc = await SiteSettings.findOne().lean();
    res.json({ success: true, settings: doc ? { ...SETTINGS_DEFAULTS, ...doc } : SETTINGS_DEFAULTS });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const body = req.body || {};
    const update = {};
    if (body.siteName != null) update.siteName = String(body.siteName).trim() || SETTINGS_DEFAULTS.siteName;
    if (body.logoUrl != null) update.logoUrl = String(body.logoUrl).trim();
    if (body.showLogo != null) update.showLogo = !!body.showLogo;
    if (body.primaryColor != null) update.primaryColor = String(body.primaryColor).trim() || SETTINGS_DEFAULTS.primaryColor;
    if (body.marqueeText != null) update.marqueeText = String(body.marqueeText).trim();
    if (body.footerText != null) update.footerText = String(body.footerText).trim();
    const doc = await SiteSettings.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true }).lean();
    await logAction(req.user._id, 'UPDATE_SETTINGS', 'site', update, req.ip);
    res.json({ success: true, settings: { ...SETTINGS_DEFAULTS, ...doc } });
  } catch (err) {
    next(err);
  }
};

export const uploadLogo = async (req, res, next) => {
  try {
    const url = req.file?.path || req.file?.url || '';
    if (!url) return res.status(400).json({ success: false, message: 'Logo dosyası gerekli' });
    await SiteSettings.findOneAndUpdate({}, { $set: { logoUrl: url, showLogo: true } }, { new: true, upsert: true });
    await logAction(req.user._id, 'UPLOAD_LOGO', 'site', {}, req.ip);
    res.json({ success: true, logoUrl: url });
  } catch (err) {
    next(err);
  }
};
