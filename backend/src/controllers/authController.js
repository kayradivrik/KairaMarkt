import User from '../models/User.js';
import generateToken from '../utils/jwt.js';

const cookieOptions = (remember) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
  path: '/',
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Bu e-posta zaten kayıtlı' });
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, false);
    res.cookie('token', token, cookieOptions(false));
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
    res.cookie('token', token, cookieOptions(!!remember));
    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req, res) => {
  res.cookie('token', '', { maxAge: 0, path: '/' });
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
