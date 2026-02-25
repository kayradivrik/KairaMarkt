import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'KairaMarkt' },
    logoUrl: { type: String, default: '' },
    showLogo: { type: Boolean, default: false },
    primaryColor: { type: String, default: '#b91c1c' },
    marqueeText: { type: String, default: '' },
    footerText: { type: String, default: '' },
    footerBgColor: { type: String, default: '' },
    footerTextColor: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    workingHours: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    showSocialLinks: { type: Boolean, default: true },
    footerSectionKurumsal: { type: String, default: '' },
    footerSectionYardim: { type: String, default: '' },
    footerSectionYasal: { type: String, default: '' },
    footerLabelAbout: { type: String, default: '' },
    footerLabelContact: { type: String, default: '' },
    footerLabelCampaigns: { type: String, default: '' },
    footerLabelSss: { type: String, default: '' },
    footerLabelIade: { type: String, default: '' },
    footerLabelTeslimat: { type: String, default: '' },
    footerLabelGizlilik: { type: String, default: '' },
    footerLabelKvkk: { type: String, default: '' },
    footerLabelKosullar: { type: String, default: '' },
    footerBadge1: { type: String, default: '' },
    footerBadge2: { type: String, default: '' },
    footerBadge3: { type: String, default: '' },
    footerBadge4: { type: String, default: '' },
    footerBottomText: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
