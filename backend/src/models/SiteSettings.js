import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'KairaMarkt' },
    logoUrl: { type: String, default: '' },
    showLogo: { type: Boolean, default: false },
    primaryColor: { type: String, default: '#b91c1c' },
    marqueeText: { type: String, default: 'KairaMarkt Admin Paneli · Hoş geldiniz · Sipariş ve ürün yönetimini buradan takip edebilirsiniz' },
    footerText: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
