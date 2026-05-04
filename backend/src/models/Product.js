import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, default: '', trim: true, maxlength: 5000 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    category: { type: String, trim: true, lowercase: true, maxlength: 80, index: true },
    images: [{ url: { type: String, maxlength: 2048 }, publicId: { type: String, maxlength: 512 } }],
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true, strict: 'throw' }
);

productSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
