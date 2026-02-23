import Slider from '../models/Slider.js';

export const getActiveSlides = async (_req, res, next) => {
  try {
    const slides = await Slider.find({ isActive: true }).sort({ order: 1 }).lean();
    res.json({ success: true, slides });
  } catch (err) {
    next(err);
  }
};
