import ContactSubmission from '../models/ContactSubmission.js';

export const submit = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Ad, e-posta ve mesaj gerekli' });
    }
    await ContactSubmission.create({
      name: name.trim(),
      email: email.trim(),
      subject: (subject || '').trim(),
      message: message.trim(),
    });
    res.status(201).json({ success: true, message: 'Mesajınız alındı. En kısa sürede dönüş yapacağız.' });
  } catch (err) {
    next(err);
  }
};

export const list = async (_req, res, next) => {
  try {
    const list = await ContactSubmission.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, list });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req, res, next) => {
  try {
    await ContactSubmission.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await ContactSubmission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
