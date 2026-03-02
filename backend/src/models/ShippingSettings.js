import mongoose from 'mongoose';

const shippingSettingsSchema = new mongoose.Schema(
  {
    freeShippingThreshold: { type: Number, default: 0 },
    defaultShippingFee: { type: Number, default: 0 },
    carrierName: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('ShippingSettings', shippingSettingsSchema);

