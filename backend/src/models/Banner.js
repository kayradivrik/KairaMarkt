import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, default: '' },
    position: { type: String, default: 'home', index: true }, // home, category, sepet vs.
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Banner', bannerSchema);

