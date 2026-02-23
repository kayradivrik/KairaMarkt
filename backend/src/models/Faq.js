import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    keywords: { type: [String], default: [] },
    response: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Faq', faqSchema);
