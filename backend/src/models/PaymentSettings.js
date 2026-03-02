import mongoose from 'mongoose';

const paymentSettingsSchema = new mongoose.Schema(
  {
    providerName: { type: String, default: '' },
    installmentsEnabled: { type: Boolean, default: false },
    cashOnDeliveryEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('PaymentSettings', paymentSettingsSchema);

