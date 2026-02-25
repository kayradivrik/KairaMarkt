import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  name: String,
  options: [{ type: String }],
  stock: { type: Map, of: Number, default: {} },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null },
    stock: { type: Number, default: 0 },
    brand: { type: String, default: '' },
    category: { type: String, required: true },
    subCategory: { type: String, default: '' },
    images: [{ type: String }],
    technicalSpecs: [{ name: { type: String, default: '' }, value: { type: String, default: '' } }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Product', productSchema);
