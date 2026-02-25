import Newsletter from '../models/Newsletter.js';

export const subscribe = async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: 'E-posta gerekli' });
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.subscribed) return res.json({ success: true, message: 'Zaten abonesiniz.' });
      existing.subscribed = true;
      await existing.save();
      return res.json({ success: true, message: 'Aboneliğiniz yeniden aktif edildi.' });
    }
    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Bülten aboneliğiniz oluşturuldu.' });
  } catch (err) {
    next(err);
  }
};

export const list = async (_req, res, next) => {
  try {
    const list = await Newsletter.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, list });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
