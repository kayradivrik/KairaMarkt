import StockAlert from '../models/StockAlert.js';
import Product from '../models/Product.js';

export const create = async (req, res, next) => {
  try {
    const { productId, email } = req.body || {};
    if (!productId || !email?.trim()) {
      return res.status(400).json({ success: false, message: 'Ürün ve e-posta gerekli' });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    if (product.stock > 0) {
      return res.json({ success: true, message: 'Ürün zaten stokta.' });
    }
    const e = email.trim().toLowerCase();
    const existing = await StockAlert.findOne({ product: productId, email: e });
    if (existing) return res.json({ success: true, message: 'Bu e-posta zaten kayıtlı.' });
    await StockAlert.create({ product: productId, email: e });
    res.status(201).json({ success: true, message: 'Stokta olduğunda e-posta ile bilgilendirileceksiniz.' });
  } catch (err) {
    next(err);
  }
};
