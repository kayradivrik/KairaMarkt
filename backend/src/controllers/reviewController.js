import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const rating = stats[0]?.avg ?? 0;
  const reviewCount = stats[0]?.count ?? 0;
  await Product.findByIdAndUpdate(productId, { rating, reviewCount });
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      status: { $in: ['processing', 'shipped', 'delivered'] },
    });
    if (!hasPurchased) {
      return res.status(403).json({ success: false, message: 'Sadece satın aldığınız ürünlere yorum yapabilirsiniz' });
    }
    let review = await Review.findOne({ product: productId, user: req.user._id });
    let created = false;
    if (review) {
      review.rating = rating;
      review.comment = comment || review.comment;
      await review.save();
    } else {
      review = await Review.create({ product: productId, user: req.user._id, rating, comment });
      created = true;
    }
    await updateProductRating(productId);
    res.status(created ? 201 : 200).json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.reviewId, user: req.user._id });
    if (!review) return res.status(404).json({ success: false, message: 'Yorum bulunamadı' });
    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();
    await updateProductRating(review.product);
    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      ...(req.user.role !== 'admin' ? { user: req.user._id } : {}),
    });
    if (!review) return res.status(404).json({ success: false, message: 'Yorum bulunamadı' });
    await updateProductRating(review.product);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
