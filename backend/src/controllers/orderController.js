import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Campaign from '../models/Campaign.js';
import ShippingSettings from '../models/ShippingSettings.js';

const TAX_RATE = 0.18;

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;
    if (!items?.length) return res.status(400).json({ success: false, message: 'Sepet boş' });
    let subtotal = 0;
    const orderItems = [];
    for (const it of items) {
      const product = await Product.findById(it.product).lean();
      if (!product) continue;
      const qty = Math.min(Math.max(1, parseInt(it.quantity) || 1), product.stock || 999);
      const price = product.discountPrice ?? product.price;
      subtotal += price * qty;
      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: qty,
        image: product.images?.[0] || null,
      });
    }
    if (!orderItems.length) return res.status(400).json({ success: false, message: 'Geçerli ürün yok' });
    let discount = 0;
    if (couponCode) {
      const campaign = await Campaign.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
        $or: [{ usageLimit: null }, { $expr: { $lt: ['$usedCount', '$usageLimit'] } }],
      });
      if (campaign && subtotal >= (campaign.minPurchase || 0)) {
        if (campaign.discountType === 'percent') discount = (subtotal * campaign.discountValue) / 100;
        else discount = Math.min(campaign.discountValue, subtotal);
        await Campaign.findByIdAndUpdate(campaign._id, { $inc: { usedCount: 1 } });
      }
    }
    const afterDiscount = subtotal - discount;
    const tax = Math.round(afterDiscount * TAX_RATE * 100) / 100;

    // Kargo ayarlarını uygula
    let shippingFee = 0;
    try {
      const ship = await ShippingSettings.findOne().lean();
      if (ship) {
        if (ship.freeShippingThreshold && afterDiscount >= ship.freeShippingThreshold) {
          shippingFee = 0;
        } else {
          shippingFee = ship.defaultShippingFee || 0;
        }
      }
    } catch {
      shippingFee = 0;
    }

    const total = afterDiscount + tax + shippingFee;
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      discount,
      shippingFee,
      total,
      couponCode: couponCode || null,
      shippingAddress: shippingAddress || {},
      status: 'pending',
    });
    for (const it of orderItems) {
      await Product.findByIdAndUpdate(it.product, {
        $inc: { stock: -it.quantity, salesCount: it.quantity },
      });
    }
    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Sipariş bulunamadı' });
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};
