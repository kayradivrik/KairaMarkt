import User from '../models/User.js';

export const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'avatar', 'address'];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Mevcut şifre hatalı' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Şifre güncellendi' });
  } catch (err) {
    next(err);
  }
};
