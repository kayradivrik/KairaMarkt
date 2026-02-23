import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Giriş yapmanız gerekiyor' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'Kullanıcı bulunamadı' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Geçersiz veya süresi dolmuş token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Bu işlem için yetkiniz yok' });
  }
  next();
};
