import SiteSettings from '../models/SiteSettings.js';

const DEFAULTS = {
  siteName: 'KairaMarkt',
  logoUrl: '',
  showLogo: false,
  primaryColor: '#b91c1c',
  marqueeText: '',
  footerText: '',
  footerBgColor: '',
  footerTextColor: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  workingHours: '',
  metaDescription: '',
  facebookUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  showSocialLinks: true,
  footerSectionKurumsal: '',
  footerSectionYardim: '',
  footerSectionYasal: '',
  footerLabelAbout: '',
  footerLabelContact: '',
  footerLabelCampaigns: '',
  footerLabelSss: '',
  footerLabelIade: '',
  footerLabelTeslimat: '',
  footerLabelGizlilik: '',
  footerLabelKvkk: '',
  footerLabelKosullar: '',
  footerBadge1: '',
  footerBadge2: '',
  footerBadge3: '',
  footerBadge4: '',
  footerBottomText: '',
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
