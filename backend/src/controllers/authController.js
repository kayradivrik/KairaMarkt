import User from '../models/User.js';
import generateToken from '../utils/jwt.js';

// Cross-origin (Render: frontend ve backend farklı URL) için çerez mutlaka SameSite=None; Secure olmalı
const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = (req, remember) => {
  const origin = req.get('origin');
  const isCrossOrigin = origin && origin !== `${req.protocol}://${req.get('host')}`;
  const needCrossSiteCookie = isProduction || isCrossOrigin;
  return {
    httpOnly: true,
    secure: needCrossSiteCookie,
    sameSite: needCrossSiteCookie ? 'none' : 'lax',
    maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Bu e-posta zaten kayıtlı' });
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, false);
    res.cookie('token', token, cookieOptions(req, false));
    res.status(201).json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'E-posta veya şifre hatalı' });
    }
    const token = generateToken(user._id, !!remember);
    res.cookie('token', token, cookieOptions(req, !!remember));
    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  const clearOptions = { maxAge: 0, path: '/' };
  const origin = req.get('origin');
  const isCrossOrigin = !!origin;
  if (isProduction || isCrossOrigin) Object.assign(clearOptions, { sameSite: 'none', secure: true });
  res.cookie('token', '', clearOptions);
  res.json({ success: true });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
