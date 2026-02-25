import mongoose from 'mongoose';

const stockAlertSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

stockAlertSchema.index({ product: 1, email: 1 }, { unique: true });
export default mongoose.model('StockAlert', stockAlertSchema);
