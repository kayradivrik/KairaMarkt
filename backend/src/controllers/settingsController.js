import SiteSettings from '../models/SiteSettings.js';

const DEFAULTS = {
  siteName: 'KairaMarkt',
  logoUrl: '',
  showLogo: false,
  primaryColor: '#b91c1c',
  marqueeText: 'KairaMarkt Admin Paneli · Hoş geldiniz · Sipariş ve ürün yönetimini buradan takip edebilirsiniz',
  footerText: '',
};

export const getPublicSettings = async (_req, res, next) => {
  try {
    const doc = await SiteSettings.findOne().lean();
    const settings = doc ? { ...DEFAULTS, ...doc } : DEFAULTS;
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
};
