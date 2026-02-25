import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

newsletterSchema.index({ email: 1 });
export default mongoose.model('Newsletter', newsletterSchema);
