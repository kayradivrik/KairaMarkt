import Product from '../models/Product.js';

const buildQuery = (query) => {
  const q = {};
  if (query.category) q.category = query.category;
  if (query.brand) q.brand = new RegExp(query.brand, 'i');
  if (query.minPrice != null || query.maxPrice != null) {
    q.price = {};
    if (query.minPrice != null) q.price.$gte = Number(query.minPrice);
    if (query.maxPrice != null) q.price.$lte = Number(query.maxPrice);
  }
  if (query.rating != null) q.rating = { $gte: Number(query.rating) };
  if (query.featured === 'true') q.featured = true;
  q.isActive = true;
  return q;
};

const getSort = (sort) => {
  switch (sort) {
    case 'price_asc': return { price: 1 };
    case 'price_desc': return { price: -1 };
    case 'popular': return { salesCount: -1 };
    case 'new': return { createdAt: -1 };
    case 'rating': return { rating: -1 };
    default: return { createdAt: -1 };
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { search, category, brand, minPrice, maxPrice, rating, featured, sort = 'new', page = 1, limit = 12 } = req.query;
    const filter = buildQuery({ category, brand, minPrice, maxPrice, rating, featured });
    if (search?.trim()) filter.$text = { $search: search.trim() };
    const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(50, Math.max(1, parseInt(limit)));
    const [products, total] = await Promise.all([
      Product.find(filter).sort(getSort(sort)).skip(skip).limit(Math.min(50, Math.max(1, parseInt(limit)))).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, products, total, page: parseInt(page) || 1, limit: parseInt(limit) || 12 });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({
      ...req.body,
      images: req.files?.map((f) => f.path) || req.body.images || [],
    });
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
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (_req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

export const getBrands = async (_req, res, next) => {
  try {
    const brands = await Product.distinct('brand', { isActive: true, brand: { $ne: '' } });
    res.json({ success: true, brands: brands.sort() });
  } catch (err) {
    next(err);
  }
};
