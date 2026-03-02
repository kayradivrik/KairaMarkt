import mongoose from 'mongoose';

const notificationSettingsSchema = new mongoose.Schema(
  {
    orderEmailsEnabled: { type: Boolean, default: true },
    lowStockEmailsEnabled: { type: Boolean, default: true },
    systemEmailsEnabled: { type: Boolean, default: true },
    adminEmail: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('NotificationSettings', notificationSettingsSchema);

